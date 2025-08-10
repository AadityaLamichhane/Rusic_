import GoogleProvider from "next-auth/providers/google";
import prisma from "../db/src/db"
import { NextAuthOptions } from "next-auth";
export const authOptions = {
 secret: process.env.AUTH_SECRET,
    providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID??'',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET??""
  })
] ,
session:{
  strategy:"jwt"
},
callbacks:{
  async signIn({profile, user , account}:any){
    try{
      if(account?.provider==="google"){
        const userinformation = await prisma.user.findFirst(
        {
          where:{
            email:profile?.email!
          }
        }
        ).catch((err:any)=>console.log(err));
        if(!userinformation){
          const data = await prisma.user.create({
            data:{
              provider:'Google',
              email:profile.email
            }
          })
          profile.User_id = data.id;
        }
      return true;
      }
    }catch(err){
      throw new Error ("Unable to Signing the user ");
    }
   return true; 
  }
  ,async jwt({ token, user, account, profile ,isNewUser=true }:any) {

    // in the second time the profile is undefined that is going to make this false  
    if(profile){
      const userInformation = await prisma.user.findFirst({
        where:{
          email:profile.email
        }}
      )
      if(userInformation){
      token.userID = userInformation?.id
      token.provider = userInformation?.provider
      isNewUser = false  ;
      }
    }
      return token;
    }
    ,async session({ session ,token}:any){
      if(token && session.user){
        session.user.id = token.userID;
      }
      return session ; 
    }
}


}satisfies NextAuthOptions;