import prisma from "@repo/db/client";
import { SendToConnectedUser } from "../useraction/Sendtoconnected";
export async function createStream (parsedMessege:any){


// call the publiser to publish the Stream and with the payload added 

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
                                    urlId:parsedMessege.urlid,
                                    url:parsedMessege.url
                                }
                                }).then((responce:any)=>{
                                    console.log(responce);
                                SendToConnectedUser(parsedMessege,responce);
                            }).catch((err:any)=>{
                                console.log(err);
                            });
                    // Make the asynchronous db call to store the data 
                    }
                    else{//
                        // Condition for the stream is Doun in the file 
                        }
}