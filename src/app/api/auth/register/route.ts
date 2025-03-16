import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json();
        if(!email || !password) {
           return NextResponse.json(
                {error: 'email and password are required'},
                {status: 400}
           )
        }

        await dbConnect();
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return NextResponse.json(
                {error: 'User already exists'},
                {status: 400}
            )
        }
        
        await User.create({
            email,
            password,
            role: "user"
        });

        return NextResponse.json(
            { message: 'User created successfully' },
            {status: 201}
    )
    } catch (error) {
        console.error("Register Error", error);

        return NextResponse.json(
            {message: "failed to register user"},
            {status: 500}
        )
    }
}