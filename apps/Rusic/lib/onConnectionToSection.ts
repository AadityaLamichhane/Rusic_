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
export async function  onConnectionToSection(sectionprops:string ){
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        exportVariable.isError = true ; 
        exportVariable.AnyError="No any session was found for the user  "
        return exportVariable;
    }
    const Clientuser = session.user;
    if (!Clientuser.id || !Clientuser.name || !Clientuser.email) {
        exportVariable.isError = true
        exportVariable.AnyError = "Invalid session: missing required user properties"
        return exportVariable;
    }
    const sessionInformation: SessionType = Clientuser ;
    try{
           const sectioninfo = await  prisma.section.findFirst({
             where:{
                 createrId:session.user.id,
                 id:sectionprops
             }
         });
             const streamerInformation = await prisma.user.findFirst({
                where:{
                    id:sectioninfo?.createrId
                }
             })
         if(sectioninfo==null){
            exportVariable.AnyError = "No section Was found"
            return exportVariable ; 
         }else{
            exportVariable.isSection = false 
         }
         
         if(sectioninfo && sectioninfo.createrId == Clientuser.id ){
            exportVariable.isOwner = true ; 
            // Return the control that is for the Creatr 
         }else{
            exportVariable.createdBy = streamerInformation.name ; 

         }
         return exportVariable; 
    }catch(err){
        console.log("Db call error thrown ");
        throw new Error("Eror while getting the information");
    }



    return true ; 
}