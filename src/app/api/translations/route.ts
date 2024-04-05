import { db } from "@/server/db";
import { apiHandler } from "@/server/utils/api-handler";
import { errorHandler } from "@/server/utils/error-handler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        const language = request.headers.get("accept-language")?.split("-")[0];
        const translation = await db.dictionary.findMany({ where: { language }, select: { key: true, value: true }});
        return NextResponse.json({ body: translation });
    } catch (error) {
        return errorHandler(error);
    }
}



