import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user._id;
  const { address } = await req.json();
  if (!address) {
    return NextResponse.json({ success: false, message: "Missing address" }, { status: 400 });
  }
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  user.addresses.push(address);
  await user.save();
  const addedAddress = user.addresses[user.addresses.length - 1]; 

  return NextResponse.json({ success: true, address: addedAddress });
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
    const userId = session?.user._id;
    
    const user = await User.findById(userId, "addresses");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, addresses: user.addresses || [] });
  }