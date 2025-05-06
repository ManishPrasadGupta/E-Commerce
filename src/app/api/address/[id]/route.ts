import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT method to update address
export async function PUT(
  req: NextRequest
) {
  //   const addressId = params.id;

  const url = new URL(req.url);

  // Parsing the pathname to extract the ID after '/api/address/'
  const pathMatch = url.pathname.match(/\/api\/address\/([^\/]+)$/);
  const addressId = pathMatch ? pathMatch[1] : null;

  console.log("Address ID:", addressId); // Log the extracted address ID

  //authentication check
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user._id;
  const { address } = await req.json(); 

  if (!address) {
    return NextResponse.json(
      { success: false, message: "Address data required" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const addr = user.addresses.id(addressId);
  if (!addr) {
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 }
    );
  }

 
  Object.assign(addr, address);
  user.markModified("addresses");
  await user.save();

  return NextResponse.json({ success: true, address: addr });
}


export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);

  // Parsing the pathname to extract the ID after '/api/address/'
  const pathMatch = url.pathname.match(/\/api\/address\/([^\/]+)$/);
  const addressId = pathMatch ? pathMatch[1] : null;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const addr = user.addresses.id(addressId);
  if (!addr) {
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 }
    );
  }

  addr.deleteOne(); // <-- Actually remove the address
  await user.save();

  return NextResponse.json({ success: true });
}
