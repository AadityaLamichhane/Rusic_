import { streamQueue ,SectionQueueMap,sectionMap} from "../UserClass";
import axios from "axios";
import { userIdMapping } from "..";
import { Socket_Sending,Socket_Sending_type } from "../type";
let Socket_Sending_variable :Socket_Sending = {
     payload: {
        type: "res",
        commands:''
    },
    type: Socket_Sending_type.Stream_Man
}
export const  SendToConnectedUser = (parsedMessege:any,responce:any)=>{

        (!streamQueue.stream.find((stream)=>stream.url===responce.url &&
            stream.createdBy===responce.userId && 
            stream.section=== responce.sectionId
        ))?
        streamQueue.stream.push({
           url:responce.url,
            upvotes:0,
            createdBy:responce.userId,
                section:responce.sectionId
        }):console.log("not found");
SectionQueueMap.set(parsedMessege.sectionid,streamQueue);

try{
    const getSectionuser = sectionMap.get(parsedMessege.sectionid);
    if(getSectionuser!=undefined){
              axios.post("http://localhost:3000/api/stream",{url:responce.url}).then((responce)=>{
        Socket_Sending_variable= {
            ...Socket_Sending_variable,type:Socket_Sending_type.Create_Stream,
            payload:{
                type:"res",
                commands:"addQueue",
                videoInfo:{
                    title:responce.data.videoinfo.title,
                    channelTitle:responce.data.videoinfo.channel,
                    videoId:responce.data.videoinfo.id,
                    url:responce.data.videoUrl
                },
            }            ,
        }
            if(JSON.stringify(responce.status)[0] == '2'){
                
                for(let i = 0 ; i <getSectionuser.length; i++){
                    const user_idMap = userIdMapping.get(getSectionuser[i].id);
                    console.log(user_idMap)
                    if(getSectionuser[i]!=undefined && getSectionuser[i].socket!=undefined){
                        user_idMap?.socket?.send(JSON.stringify(Socket_Sending_variable));
                    }
            }
            }
        })
        console.log(SectionQueueMap.get(parsedMessege.sectionid));
    }
    // When the new Queue is added ->  redis -> ws (QueueStatus{Update , addiition , removal , }) 
    // have another function that catches the redis -> Section , payload : (Queue ) , Type :{Add , Updated , delete , upnext }
    // Add -> Queue Array i.e in the redux -> add action , Remove -> remove action , Upnext -> upnext action
    // inside the Redis catch -> Redux Application logic to handle these Event ( Remove , add , Pop and next )
    // In the frontend As soon as i am authenntcated -> redirected to the page ->
}catch(err){
    console.log(err);
}
}