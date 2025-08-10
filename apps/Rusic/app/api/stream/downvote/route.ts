// Expects the post request to downvote and the upVote 
import { authOptions } from '@/lib/authOptions'
import db from '@/lib/db'
import  { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import z from "zod"
const UpvoteSchema = z.object({
    streamId :z.string(),
})
export  async function POST (req:NextRequest){

    // Authentication of the user 
    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        return NextResponse.json({
            msg:"unAutherize acces to the folder "
    },{status:411});
}
    const inputVariable = await req.json();
    const user  = await db.user.findFirst({
        where:{
            email:session?.user,
        }
    });
    if(!user){
        return NextResponse.json({msg:"No user found in the data base with the credentials"});
    }
    const upvote = await db.upvotes.create({
        data:{
            streamid: inputVariable.streamId,
            userId:user.id
        }
    })
    
    return NextResponse.json({
        msg:"Upvoted"
    },{status:200});
    // Update the upvote for the stream with the stream id 

    


}