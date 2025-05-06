import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Product, { IProduct } from "@/models/Product.model";
import { dbConnect } from "@/lib/db";


export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).lean();  //learn lean() method...

    if (!products || products.length === 0) {
      return NextResponse.json({error: " products is empty in backend"}, { status: 404 });
    }

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    //we need session bcz we want only admin have permission to upload.
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body: IProduct = await request.json();

    if (
      !body.name ||
      !body.imageUrl ||
      !body.variants ||
      body.variants.length === 0
      ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    } else {
      body.imageUrl = body.imageUrl.map(url => {
        // Extract only the filename (everything after the last slash)
        return url.split('/').pop() || url;
      });
    }

    // Validate variants
    for (const variant of body.variants) {
      if (!variant.type || !variant.price ) {
        return NextResponse.json(
          { error: "Invalid variant data" },
          { status: 400 }
        );
      }
    }

    const newProduct = await Product?.create(body);
    return NextResponse.json(newProduct);
    
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}