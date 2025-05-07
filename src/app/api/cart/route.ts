import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Cart from "@/models/Cart.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

//POST
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items to add to the cart" }, { status: 400 });
    }
    const item = items[0];
    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user._id);
    const existing = await Cart.findOne({ userId });

    if (existing) {
      // Check for same productId and variant.type
      const foundIndex = existing.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.variant &&
          item.variant &&
          i.variant.type === item.variant.type
      );
      if (foundIndex !== -1) {
        existing.items[foundIndex].quantity += item.quantity;
      } else {
        existing.items.push(item);
      }
      await existing.save();
    } else {
      await Cart.create({ userId: session.user._id, items: [item] });
    }

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Error in POST /api/cart:", error);
    let errorMessage = "Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

//GET
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const cart = await Cart.findOne({ userId: session.user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }
    return NextResponse.json(cart.items || []);
  } catch (error) {
    console.error("Error in GET /api/cart:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


//PUT
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantType, quantity } = await req.json();
    if (!productId || !variantType || typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await dbConnect();
    const cart = await Cart.findOne({ userId: session.user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const foundIndex = cart.items.findIndex(
      (item) =>
        item.productId === productId &&
        item.variant?.type === variantType
    );
    if (foundIndex === -1) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }

    cart.items[foundIndex].quantity = quantity;
    await cart.save();

    return NextResponse.json({ message: "Cart item quantity updated" });
  } catch (error) {
    console.error("Error in PUT /api/cart:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}



//DELETE
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantType } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
    }
    await dbConnect();

    const cart = await Cart.findOne({ userId: session.user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

   
    cart.items = cart.items.filter(
      (item) =>
        item.productId !== productId ||
        (variantType && item.variant?.type !== variantType)
    );
    await cart.save();

    return NextResponse.json({ message: "Item removed from cart", status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/cart:", error);
    let errorMessage = "Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}