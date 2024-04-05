import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
// Create ProductType with translations
const jewelry = await prisma.productType.create({
  data: {
    translations: {
      create: [
        {
          language: 'en',
          name: 'Jewelry',
        },
        {
          language: 'ja',
          name: 'ジュエリー',
        },
      ],
    },
  },
});

const clothing = await prisma.productType.create({
  data: {
    translations: {
      create: [
        {
          language: 'en',
          name: 'Clothing',
        },
        {
          language: 'ja',
          name: '衣類',
        },
      ],
    },
  },
});

// Create ProductCategory with translations
const wedding = await prisma.productCategory.create({
  data: {
    productTypeId: jewelry.id,
    translations: {
      create: [
        {
          language: 'en',
          name: 'Wedding',
        },
        {
          language: 'ja',
          name: '結婚式',
        },
      ],
    },
  },
});

const shirts = await prisma.productCategory.create({
  data: {
    productTypeId: clothing.id,
    translations: {
      create: [
        {
          language: 'en',
          name: 'Shirts',
        },
        {
          language: 'ja',
          name: 'シャツ',
        },
      ],
    },
  },
});

// Create Product with translations
await prisma.product.create({
  data: {
    productTypeId: jewelry.id,
    productCategoryId: wedding.id,
    translations: {
      create: [
        {
          language: 'en',
          name: 'Ring with Diamonds',
          description: '18k gold ring with diamonds',
        },
        {
          language: 'ja',
          name: 'ダイヤモンドリング',
          description: 'ダイヤモンドがちりばめられた18金のリング',
        },
      ],
    },
  },
});

await prisma.product.create({
  data: {
    productTypeId: clothing.id,
    productCategoryId: shirts.id,
    translations: {
      create: [
        {
          language: 'en',
          name: 'Graphic T-Shirt',
          description: '100% cotton, graphic tee with a cool print',
        },
        {
          language: 'ja',
          name: 'グラフィックTシャツ',
          description: 'クールなプリントが施された100%コットンのグラフィックTシャツ',
        },
      ],
    },
  },
});


  // Translation examples
  await prisma.dictionary.create({
    data: {
      key: "welcome",
      value: "Welcome to our store",
      language: "en",
    },
  });

  await prisma.dictionary.create({
    data: {
      key: "welcome",
      value: "cショップへようこそ",
      language: "ja",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
