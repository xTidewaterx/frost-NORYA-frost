import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creator');

    if (!creatorId) {
      return NextResponse.json({ error: 'creator query param is required' }, { status: 400 });
    }

    // Fetch all products (or use pagination for larger lists)
    const products = await stripe.products.list({ limit: 100 });

    const creatorProducts = await Promise.all(
      products.data
        .filter((product) => product.metadata?.creatorId === creatorId)
        .map(async (product) => {
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

    return NextResponse.json({ data: creatorProducts }, { status: 200 });
  } catch (err) {
    console.error('Error fetching creator products:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
