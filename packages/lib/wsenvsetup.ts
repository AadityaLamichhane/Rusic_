"use server"
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken"
import { authOptions } from "./authOptions";
 export type SessionType = {
    name:String , 
    email:String,
    image:String,
    id:String 
 }
export default async function onSocketConnection(){
    const session =  await getServerSession(authOptions);
    const jwttoken = jwt.sign(session?.user as string,process.env.AUTH_SECRET as string);
    return jwttoken;
}
