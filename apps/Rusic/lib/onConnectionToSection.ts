"use server"
import  prisma from "@repo/db/client"
import { authOptions } from "@repo/lib";
import { getServerSession } from "next-auth";
import { ExportType } from "./types";
let exportVariable :ExportType = {
    isOwner:false,
    isError:false,
    AnyError:"",
    isSection:false ,
    createdBy:"",
} ; 
export async function  onConnectionToSection(sectionprops:string ){
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        exportVariable.isError = true ; 
        exportVariable.AnyError="No any session was found for the user  "
        return exportVariable;
    }
    const Clientuser = session.user;
    exportVariable.userid = Clientuser.id;
    if (!Clientuser.id || !Clientuser.name || !Clientuser.email) {
        exportVariable.isError = true
        exportVariable.AnyError = "Invalid session: missing required user properties"
        return exportVariable;
    }
    try{
        exportVariable.isSection = false ;
           const sectioninfo = await  prisma.section.findFirst({
             where:{
                 Sectionname:sectionprops
             }
         });
         if(sectioninfo!=null && sectioninfo!=undefined){
            console.log("you are tyring to open the section");
            exportVariable.isSection = true ;
             const streamerInformation = await prisma.user.findFirst({
                where:{
                    id:sectioninfo?.createrId
                }
             })
         exportVariable.createdBy = streamerInformation.name; 
         if(streamerInformation!=undefined){
            exportVariable.isOwner=(streamerInformation.createrId==Clientuser.id)?true:false;
         }
         }else{
            exportVariable.AnyError = "No section Was found"
            return exportVariable ; 
         }
         return exportVariable; 
    }catch(err){
        console.log("Db call error thrown ");
        throw new Error("Eror while getting the information");
    }


}