import { createStream } from "../stream/createStream";
import { sendStreamState } from "../stream/sendStreamState";
import { Socket_Sending } from "../type";
export async function Section_Subhandler(messege:string){
  
                const parsedMessege:Socket_Sending = await JSON.parse(messege);
                if(parsedMessege.payload.commands=="addQueue"){
                        console.log(`The string messege is ${JSON.stringify(parsedMessege)}`);
                        await createStream(parsedMessege);
                }else if(parsedMessege.payload.commands=="GetState"){
                    sendStreamState(parsedMessege);
                    // Get the stream information from the map object of the queue 
                    // Get the stream and then populatr to the user 
                    // Get From the local storeage / assigned Id   / payload 
                    // Get the Section => Queue Stream Vector   , -> pass it to the
                    // And give it to the user as the Pub or Ws or 

                    // Core logic -> get all the Redis Queue .
                    // Fetch from the db and then Get All the queueu . 
                    // how to know When is the redis 
                }
    
}
