import { NextRequest, NextResponse } from "next/server";
import GridAd from "@/models/GridAd";
import { dbConnect } from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();
        const gridAds = await GridAd.find({}).lean();
        return NextResponse.json({ gridAds }, { status: 200 });
    } catch (error) {
        console.error("Error fetching GridAds:", error);
        return NextResponse.json({ error: "Failed to fetch GridAds" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body =  await request.json();
        const {title, description, thumbnail} = body;

        if(!title || !description || !thumbnail) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newAd = new GridAd({title, description, thumbnail});
        await newAd.save();

        return NextResponse.json(newAd, {status: 201})
    } catch (error) {
        console.error("Error creating GridAd:", error);
        return NextResponse.json({ error: "Failed to create GridAd" }, { status: 500 });
    }
}