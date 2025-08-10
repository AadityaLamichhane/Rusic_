"use server"
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken"
export default async function onSocketConnection(){
    const session =  await getServerSession();
    const jwttoken = jwt.sign(session?.user as string,process.env.AUTH_SECRET as string);
    return jwttoken;
}
