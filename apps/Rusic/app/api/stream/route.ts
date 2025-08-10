import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getServerSession } from "next-auth";
import { youtubeRegex } from "@repo/lib/utils" 
import { authOptions } from "@repo/lib/authOptions";
import db from '@repo/lib/db'
import { parse } from "path";
const CreateStreamSchem = z.object({
    url: z.string(),
    email:z.string()
})
    export async function POST(req:NextRequest){

        const session =await getServerSession( authOptions );
        try{

            const inputJson = await req.json();
            const parsedData = CreateStreamSchem.parse(inputJson);

          if(!session?.user){
            return NextResponse.json({
                msg:"UnAuthenticaeted for the request"
            },{
                status:411
            })
          } 
           const userInformation = await db.user.findFirst({
            // Check if the User Exist And iif not then give them the error 
            where:{
                email:session.user?.email ?? ""
            }
           });
         const isYt = parsedData.url.match(youtubeRegex);
        const videoId = parsedData.url ? parsedData.url.match(youtubeRegex)?.[1] : null;
            
                    if (!isYt || !videoId) {
            return NextResponse.json(
                {
                message: "Invalid YouTube URL format",
                },
                {
                status: 400,
                },
            );
            }
        
                await db.stream.create({
                    data:{
                        userId:userInformation?.id||  "",
                        url: parsedData.url,
                        urlId:videoId ,
                        type:"youtube",
                    }
                })
            return NextResponse.json({
                msg:"Success in Job ",
                hello:"This iis working "
            },{status:200})
        } 
        catch(err){
            return NextResponse.json({
                msg:"This messege cannot be sent back to the user ",
            },{
                status:411
            })
        }
        }
export async function GET (){
    console.log("Hey this is the get request ");
    return NextResponse.json({
        msg:"You will be seeing the stream done by you in this section"
    })
}

    
   
    
