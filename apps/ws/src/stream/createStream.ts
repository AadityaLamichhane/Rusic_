import prisma from "@repo/db/client";
import { SendToConnectedUser } from "../useraction/Sendtoconnected";
import { Socket_Sending } from "./../type";
export async function createStream (parsedMessege:Socket_Sending){
// call the publiser to publish the Stream and with the payload added

    if(parsedMessege.payload.videoInfo!=undefined  ){
                    const findPrisma = await prisma.stream.findFirst({
                        where:{
                            url:parsedMessege.url,
                            sectionId:parsedMessege.sectionid,
                        }});
                        if(findPrisma==undefined ||   findPrisma==null){
                            console.log('Creating the new Stream file');
                            prisma.stream.create({
                                data:{
                                sectionId :parsedMessege.sectionid,
                                    userId:parsedMessege.userid,
                                    urlId:parsedMessege.payload.videoInfo.urlId ,
                                    url:parsedMessege.url
                                }
                                }).then((responce:any)=>{
                                    console.log(responce);
                                SendToConnectedUser(parsedMessege,responce);
                            }).catch((err:any)=>{
                                console.log(err);
                            });
                            return true ; 
                    // Make the asynchronous db call to store the data 
                    }
                    else{//
                        // Condition for the stream is Doun in the file 
                        console.log("This was already in the Section Try Recaching it ");
                        return false ; 
                        }
}
}