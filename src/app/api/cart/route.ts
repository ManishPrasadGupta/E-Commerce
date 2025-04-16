import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Cart from "@/models/Cart.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";



export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
    await dbConnect();
  const cart = await Cart.findOne({ userId: session.user._id });
  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  return Response.json(cart?.items || []);
}


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
      console.log("Item to add:", item);
      await dbConnect();
    
      const userId = new mongoose.Types.ObjectId(session.user._id);
      const existing = await Cart.findOne({ userId });
      if (existing) {
        existing.items.push(item);
        await existing.save();
      } else {
        await Cart.create({ userId: session.user._id, items: [item] });
      }
    
      return NextResponse.json({ message: "Cart updated" });
    } catch (error: unknown) {
      console.error("Error in /api/cart:", error);
    
      let errorMessage = "Server Error";
    
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }




export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
    if (!session || !session.user?._id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { productId } = await req.json(); 
   
    if(!productId ) {
      return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
    }
    await dbConnect();

    const cart = await Cart.findOne({ userId: session.user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

 // remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId !== productId);
    await cart.save(); 


    return NextResponse.json({ message: "Item removed from cart" , status: 200});
}
