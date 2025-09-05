import prisma from "@repo/db/client";
import { SendToConnectedUser } from "../useraction/Sendtoconnected";
import { Socket_Sending } from "./../type";
import { Section_Id_To_QueueMap, Stream } from "../UserClass";
import { SectionStorage } from "../redis/SectionSubHandler";
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
                                    //Update the inmemory 
                                    // const streamQueue = Section_Id_To_QueueMap.get(parsedMessege.sectionid??"default");
                                    // if(streamQueue==undefined ){
                                    //     console.log("The stream Queue is Undefined");
                                    //     return {status:"failed"} ; 
                                    // }
                                    // streamQueue.stream.push(newStream)
                                    // Section_Id_To_QueueMap.set(parsedMessege.sectionid??"default",streamQueue);
                                    //Update the redis Memory 
                                   
                                    SendToConnectedUser(parsedMessege.sectionid,responce);
                                return {status:"success"}
                            }).catch((err:any)=>{
                                console.log(err);
                                return {status:"failed",data:{} }; 
                            });
                            return {status:"failed",data:{}} ; 
                    // Make the asynchronous db call to store the data 
                    }
                    else{//
                        // Condition for the stream is Doun in the file 
                        console.log("This was already in the Section Try Recaching it ");
                        return false ; 
                        }
}
}