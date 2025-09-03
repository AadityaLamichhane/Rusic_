import { createStream } from "../stream/createStream";
import { sendStreamState } from "../stream/sendStreamState";
export async function Section_Subhandler(messege:string){
                const parsedMessege = await JSON.parse(messege);
                if(parsedMessege.payload.type=="create_section"){
                        await createStream(parsedMessege);
                }else if(parsedMessege.payload.type=="create_stream"){
                //    It create the Stream and send to all the user To the socket 
                    createStream(parsedMessege);
                    // Responsible to create One Object with the Queue assigned by the Token ( SectionId )
                }else if(parsedMessege.payload.type=="Get_Stream"){
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
