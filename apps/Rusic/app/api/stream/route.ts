import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { youtubeRegex } from "@repo/lib/utils" 
const CreateStreamSchem = z.object({
    url: z.string(),
    email:z.string()
})
    export async function POST(req:NextRequest){
        const ytstream = (await import ("yt-stream")).default ; 
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
                    msg: "Invalid YouTube URL format",
                    },
                    {
                    status: 400,
                    },
                );
            }
            // const videoObject = await GetVideoDetails(videoId);
            console.log("Thing is working till now ");
            const videoObjects = await ytstream.getInfo(`${isYt[0]}`);
            return NextResponse.json({
                msg:"Success in Job ",
                hello:"This iis working ",
                videoId:videoId,
                videoUrl:isYt[0],
                videoinfo:videoObjects
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

    
   
    
