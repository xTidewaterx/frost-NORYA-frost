import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ✅ GET /api/creatorProducts?creator=USER_UID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creator");

    if (!creatorId) {
      return NextResponse.json(
        { error: "Missing 'creator' query parameter" },
        { status: 400 }
      );
    }

    console.log(`Fetching products for creator: ${creatorId}`);

    // Fetch all products (you can later optimize by using pagination)
    const products = await stripe.products.list({ limit: 100 });

    // Filter products by metadata.creator
    const creatorProducts = products.data.filter(
      (product) => product.metadata?.creator === creatorId
    );

    // Attach price info to each product
    const productsWithPrices = await Promise.all(
      creatorProducts.map(async (product) => {
        let price = null;
        if (product.default_price) {
          const priceData = await stripe.prices.retrieve(product.default_price);
          price = priceData.unit_amount / 100;
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          price,
          metadata: product.metadata,
        };
      })
    );

    console.log(`Found ${productsWithPrices.length} products for ${creatorId}`);

    return NextResponse.json({ data: productsWithPrices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching creator products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
