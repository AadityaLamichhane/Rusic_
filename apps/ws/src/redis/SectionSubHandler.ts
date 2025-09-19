import { userIdMapping } from "..";
import { createStream } from "../stream/createStream";
import { Socket_Sending, Socket_Sending_type } from "../type";
import { playnext } from "./functions/playnext";
import { StorageController } from "./Storage";
import { sendToSocket } from "../useraction/SendToSocket";
export async function Section_Subhandler(messege:string){
                const parsedMessege = await JSON.parse(messege);
                if(parsedMessege.payload.commands=="addQueue"){
                   const status =  await createStream(parsedMessege);
                   if(status?.success){
                    const getCurrentPlaying = await StorageController.getcurrentPlaying(parsedMessege.sectionid);

                    if(!getCurrentPlaying){
                        playnext(parsedMessege.sectionid); 
                    }
                   }
                }else if(parsedMessege.payload.commands=="GetState"){
                   const value =  await StorageController.getQueue(parsedMessege.sectionid??"");
                   
                    const userTOSend = userIdMapping.get(parsedMessege.userId);
                    const sendDetail:Socket_Sending= {
                        type:Socket_Sending_type.Stream_Man,
                        payload:{
                            type:"res",
                            commands:"GetState"
                        },
                        queue:value

                }
                if(userTOSend?.socket!=undefined){
                    sendToSocket(userTOSend?.socket,JSON.stringify(sendDetail))
                }else{
                    console.log("User Socket is not setted");
                }
    
}
}
