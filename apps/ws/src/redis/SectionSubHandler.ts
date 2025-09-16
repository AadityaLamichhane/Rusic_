import { pub } from "../redisconfig";
import { createStream } from "../stream/createStream";
import { Socket_Sending } from "../type";
import { StorageController } from "./Storage";
export async function Section_Subhandler(messege:string){

                const parsedMessege:Socket_Sending = await JSON.parse(messege);
                if(parsedMessege.payload.commands=="addQueue"){
                    await createStream(parsedMessege);
                }else if(parsedMessege.payload.commands=="GetState"){
                   const value =  await StorageController.getQueue(parsedMessege.sectionid??"";
                    console.log(value);
                    //If the value is there then populate the frontend by sending the information about the data 
                   );
                }
    
}
