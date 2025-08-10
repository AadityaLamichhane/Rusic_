"use server"
import  prisma from "@repo/db/client"
import { authOptions } from "@repo/lib";
import { getServerSession } from "next-auth";

export async function  onConnectionToSection(id:string){
//    Create the section with the user creating id
    const session = await getServerSession(authOptions);
    console.log(session);
    return true ; 
}