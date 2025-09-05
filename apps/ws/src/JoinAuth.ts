import prisma from "@repo/db/client";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "./UserClass";
import { userIdMapping } from ".";
dotenv.config();
export const JoinMessegeHandling:any = async(token:string,socketSendingVariable:any,socket:WebSocket)=>{
   try{
       // @ts-ignore
           const decryptedToken =  jwt.verify(token,process.env.AUTH_SECRET_WS);
           if(decryptedToken==null && decryptedToken==undefined){
            console.log("Cannot Continue ");

           }
           if(decryptedToken!=null){
               const prismaUser = await prisma.user.findFirst({
                   where:{
                    //@ts-ignore
                       id:decryptedToken.id 
                   }
               });
               if(prismaUser==null){
                   socketSendingVariable= {...socketSendingVariable,msg:"fail"}
                   return {status:false}; 
               }
               console.log('user confirmed');
               //@ts-ignore
               const addeduser = new User( prismaUser.name,decryptedToken.id,socket );
               //@ts-ignore
                userIdMapping.set(decryptedToken.id , addeduser);
                console.log(`This is the added User${addeduser}`);
               return {status:true , addeduser} ; 
           }
           return {status:false };
   }catch(err){
            console.log(err);
           console.log("you are handing the messege");
           return {status:false }; 
   }
}
