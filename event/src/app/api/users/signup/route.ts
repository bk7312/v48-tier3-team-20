import User, { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongo";

export async function POST(request: NextRequest): Promise<NextResponse> {

    await dbConnect();
    
    try {
        const reqBody = await request.json();
        const { fullname, email, username, password }: {fullname: string, email: string, username: string, password: string } = reqBody;
       
        const user: IUser | null = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists with that email" }, { status: 400 });
        }
        
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPassword,                                    
        });

        const savedUser = await newUser.save();

        const responseUser = savedUser.toJSON();
        delete responseUser.password;
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            responseUser 
        });

    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
