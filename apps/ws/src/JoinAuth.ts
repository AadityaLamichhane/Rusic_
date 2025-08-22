import prisma from "@repo/db/client";
export async function JoinMessegeHandling(token:string,socketSendingVariable:any):Promise<any>{
   try{
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
           console.log("you are handing the messege");
           return {status:false , id:'',name:"Anonymous"}; 
   }
}
