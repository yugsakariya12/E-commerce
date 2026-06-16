import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectionStr } from '@/app/(root)/lib/db';        // ✅ your db connection
import Cart from '@/app/(root)/lib/models/Cart';             // ✅ your cart model path

// GET - fetch cart items
export async function GET(req) {
  try {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const userId = req.headers.get('user-id');
    if (!userId) return NextResponse.json({ error: 'user-id missing' }, { status: 400 });

    const cart = await Cart.findOne({ userId });
    return NextResponse.json(cart?.items || []);

  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - save/update full cart
export async function POST(req) {
  try {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const { userId, items } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId missing' }, { status: 400 });

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { upsert: true, new: true }
    );

    return NextResponse.json(cart);

  } catch (err) {
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
  }
}

// DELETE - remove one item by cartId
export async function DELETE(req) {
  try {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const { userId, cartId } = await req.json();
    if (!userId || !cartId) return NextResponse.json({ error: 'userId or cartId missing' }, { status: 400 });

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    cart.items = cart.items.filter(item => item.cartId !== cartId);
    await cart.save();

    return NextResponse.json(cart.items);

  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}