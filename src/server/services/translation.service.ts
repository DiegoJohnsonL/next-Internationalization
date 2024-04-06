"use server"

import { Prisma } from "@prisma/client";
import { db } from "../db";
import { ApiError } from "../utils/api-error";
import { supportedLangs } from "@/languages/support-langs";

export async function getAllTranslations(){
    return db.dictionary.findMany();
}

export async function getTranslationsByLanguage(language: string){
    return db.dictionary.findMany({ where: { language } });
} 

export async function getTranslationByKey(key: string){
    return db.dictionary.findFirst({ where: { key } });
}

export async function createTranslation(key: string, value: string, language: string) {
  try {
    // Translate the value to Japanese
    const translateToLanguages = supportedLangs.filter(lang => lang !== language);    
    // Start a transaction to ensure both translations are created
    return await db.$transaction(async prisma => {
      // Store the original translation
      const results = [];
      const original = await prisma.dictionary.create({
        data: { key, value, language },
      });
      results.push(original);
      // Iterate over the languages we need to translate to
      for (const lang of translateToLanguages) {
        // Translate the value to the target language
        const translatedValue = await translateText(value, lang, language);
        // Store the translated version
        const translated = await prisma.dictionary.create({
          data: { key, value: translatedValue, language: lang },
        });
        results.push(translated);
      }

      return results;
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ApiError("Translation already exists", 400);
    }
    // Adjust the error handling as needed
    throw new ApiError("Error creating translation", 500);
  }
}


async function translateText(text: string, targetLang: string, src: string) {
    const apiKey = process.env.TRANSLATE_SERVICE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const body = {
      q: text,
      source: src,
      target: targetLang,
      format: 'text'
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      // Check for errors in response
      if (data.error) {
        console.error('Translation API error:', data.error);
        throw new Error(`Error during translation: ${data.error.message}`);
      }
  
      return data.data.translations[0].translatedText;
    } catch (error) {
      throw new Error("Failed to translate text");
    }
}