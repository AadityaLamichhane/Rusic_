"use server"
import  prisma from "@repo/db/client"
import { authOptions } from "@repo/lib";
import { SessionType } from "@repo/lib/wsenvsetup";
import { getServerSession } from "next-auth";
export async function  onConnectionToSection(id:string){
//    Create the section with the user creating id
    const session = await getServerSession(authOptions);

    // Type guard to validate session
    if (!session || !session.user) {
        throw new Error("User not authenticated");
    }
    
    // Check if session.user has required SessionType properties
    const user = session.user;
    if (!user.id || !user.name || !user.email) {
        throw new Error("Invalid session: missing required user properties");
    }
    
    const sessionInformation: SessionType = user as SessionType;
    await prisma.user.create();
    


    // responsible for joining them to the room and then having them the control or role returned by the component 
    // await prisma.section.findFirst({
        // where:{
            // user:session.user.id
        // }
    // })

    return true ; 
}