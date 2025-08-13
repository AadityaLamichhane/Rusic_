"use server"
import  prisma from "@repo/db/client"
import { authOptions } from "@repo/lib";
import { SessionType } from "@repo/lib/wsenvsetup";
import { getServerSession } from "next-auth";
import { exportTraceState } from "next/dist/trace";
type ExportType = {
    isOwner:boolean  ,
    isError?:boolean,
    AnyError? :String,
    createdBy?:String
    isSection:boolean
}
let exportVariable :ExportType = {
    isOwner:false,
    isError:false,
    AnyError:"",
    isSection:false ,
    createdBy:""
} ; 
// const exportvalue:ExportType  ={isOwner:false  }; 
export async function  onConnectionToSection(sectionprops:string ){
//    Create the section with the user creating id
    const session = await getServerSession(authOptions);
    // Type guard to validate session
    if (!session || !session.user) {
        exportVariable.isError = true ; 
        exportVariable.AnyError="No any session was found for the user  "
        return exportVariable;
    }
    // Check if session.user has required SessionType properties
    const Clientuser = session.user;
    if (!Clientuser.id || !Clientuser.name || !Clientuser.email) {
        exportVariable.isError = true
        exportVariable.AnyError = "Invalid session: missing required user properties"
        return exportVariable;
    }
    const sessionInformation: SessionType = Clientuser as SessionType;
    try{
           const sectionuser = await  prisma.section.findFirst({
             where:{
                 createrId:session.user.id,
                 id:sectionprops
             }
         });
             const streamerInformation = await prisma.user.findFirst({
                where:{
                    id:sectionuser?.createrId
                }
             })
            
         if(sectionuser==null){
            exportVariable.AnyError = "no section"
            // There is not any section of such thing so i have to throw some flag .

            return  {}  
         }
         
         if(sectionuser?.id && sectionuser.createrId == Clientuser.id ){
            // Return the control that is for the Creatr 
         }
    }catch(err){
        throw new Error("Eror while getting the information");
    }



    return true ; 
}