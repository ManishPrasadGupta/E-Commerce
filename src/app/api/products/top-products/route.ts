import {  NextResponse } from "next/server";
import Product from "@/models/Product.model";
import { dbConnect } from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();
        const topProducts = await Product.find({ isTopProduct: true });
        return NextResponse.json(topProducts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching top products", error }, { status: 500 });
    }
}
