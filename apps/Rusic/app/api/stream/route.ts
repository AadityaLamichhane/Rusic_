import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getServerSession } from "next-auth";
import { youtubeRegex } from "@repo/lib/utils" 
import { authOptions } from "@repo/lib/authOptions";
import db from '@repo/db/client'
import { GetVideoDetails } from "youtube-search-api";
const CreateStreamSchem = z.object({
    url: z.string(),
    email:z.string()
})
    export async function POST(req:NextRequest){
        const session =await getServerSession( authOptions );
        const userInformation = session.user;
        try{
            const inputJson = await req.json();
            if(!inputJson){
                console.log("Not any required information cannot get the input");
                return NextResponse.json({msg:"Cannot find the infomration to add the stream"});
            }
        const isYt = inputJson.url.match(youtubeRegex);
        const videoId = inputJson.url ? inputJson.url.match(youtubeRegex)?.[1] : null;
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
            const videoObject = await GetVideoDetails(videoId);
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

    
   
    
