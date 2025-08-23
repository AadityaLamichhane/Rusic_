import prisma from "@repo/db/client";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();
export const JoinMessegeHandling:any = async(token:string,socketSendingVariable:any)=>{
   try{
    console.log(token );
    console.log(process.env.AUTH_SECRET_WS);
       // @ts-ignore
           const decryptedToken = jwt.verify(token,process.env.AUTH_SECRET_WS);
           if(decryptedToken!=null){
               const prismaUser = await prisma.user.findFirst({
                   where:{
                       //@ts-ignore
                       id:decryptedToken.id 
                   }
               });
               if(prismaUser==null){
                   console.log("No such user was found");
                   socketSendingVariable= {...socketSendingVariable,msg:"fail"}
                   return {status:false,id:"",name:"Anonymous"} ; 
               }
               //@ts-ignore
               console.log('user confirmed');
               return {status:true , id:prismaUser.id , name:prismaUser.name} ; 
           }
           return {status:false , id:'',name:"Anonymous"};
   }catch(err){
            console.log(err);
           console.log("you are handing the messege");
           return {status:false , id:'',name:"Anonymous"}; 
   }
}
