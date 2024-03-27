import { IUserPayload } from "@/app/api/users/login/route";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import Event, { Events } from "@/models/Event";
import { EventSchema, IEvent } from "../route";
import dbConnect from "@/lib/mongo";

export async function GET(req: NextRequest, content: any) {

  let skey: string = process.env.SECRETKEY!;
  let cookie = req.cookies.get("accessToken")
  const key = new TextEncoder().encode(skey)
  if (!cookie) {
    console.log('no cookie')
    console.log(req.cookies)
    return NextResponse.json({
      status: 400,
      body: { error: 'Data Invalid', details: 'Not Authorized' },
    })
  }

  const { payload, protectedHeader }: { payload: IUserPayload, protectedHeader: any } = await jose.jwtVerify(cookie.value, key, {})

  console.log(payload);

  if (!payload.userId) {
    return NextResponse.json({ error: "Invalid user" })
  }

  const id = content.params.id
  console.log(id)
  const events: Events | null = await Event.findById(id)
  if(events?.host.equals(payload.userId)){
    return NextResponse.json(events)
  }
  return NextResponse.json({error: "you are not the host!"})
 
}

