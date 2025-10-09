import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });


import { products as productsData } from "../data/products";
import { reviews as reviewsData } from "../data/reviews";
import { sizeGuides as sizeGuideData } from "../data/sizeGuide";

import Product from "../src/models/Product";
import Category from "../src/models/Category";
import Review from "../src/models/Review";
import SizeGuide from "../src/models/SizeGuide";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(" Connected to MongoDB");

    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await SizeGuide.deleteMany({});

    const categoryMap: Record<string, any> = {};

    // categories
    for (const p of productsData as any[]) {
      if (!categoryMap[p.category]) {
        const c = await Category.create({ name: p.category });
        categoryMap[p.category] = c._id;
      }
    }

    // products
    for (const p of productsData as any[]) {
      await Product.create({
        legacyId: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
        image: p.image,
        description: p.description,
        categoryName: p.category,
        category: categoryMap[p.category] || null,
        stock: 100,
        isActive: true,
      });
    }

    // size guides
    for (const [name, sg] of Object.entries(sizeGuideData as any)) {
      await SizeGuide.create({ name, ...(sg as any) });
    }

    // reviews
    for (const r of reviewsData as any[]) {
      const prod = await Product.findOne({ legacyId: r.productId });
      if (prod) {
        await Review.create({
          product: prod._id,
          legacyProductId: r.productId,
          author: r.author,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verified: r.verified,
          helpfulCount: r.helpfulCount,
        });
      }
    }

    console.log("🌱 Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
