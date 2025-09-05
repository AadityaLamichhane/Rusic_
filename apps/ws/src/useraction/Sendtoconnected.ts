import { Section_Id_To_QueueMap,sectionMap} from "../UserClass";
import axios from "axios";
import { userIdMapping } from "..";
import { Socket_Sending,Socket_Sending_type } from "./../type";
import type {Stream} from "@prisma/client"
let Socket_Sending_variable :Socket_Sending = {
     payload: {
        type: "res",
        commands:''
    },
    type: Socket_Sending_type.Stream_Man
}
export const  SendToConnectedUser = (dbResponce:any)=>{
    console.log("Sending To Each User");
try{
    const getSectionuser = sectionMap.get(dbResponce.sectionId);
    if(getSectionuser!=undefined){
              axios.post("http://localhost:3000/api/stream",{url:dbResponce.url}).then((axiosresponce)=>{

            const queue_In_SectionId =Section_Id_To_QueueMap.get(dbResponce.sectionId);
            if(queue_In_SectionId==undefined){
                return false; 
            }
            (!queue_In_SectionId.find((stream)=>stream.url===dbResponce.url &&
                stream.createdBy===dbResponce.userId && 
                stream.section=== dbResponce.sectionId
            ))?
            queue_In_SectionId.push({
                id:axiosresponce.data.data,
                upvotes:0,
                createdBy:dbResponce.userId,
                section:dbResponce.sectionId,
                title:axiosresponce.data.videoinfo.title,
                channelTitle:axiosresponce.data.videoinfo.channel,
                videoId:axiosresponce.data.videoinfo.id,
                url:axiosresponce.data.videoUrl
                }):console.log("not found");
                Section_Id_To_QueueMap.set(dbResponce.sectionId,queue_In_SectionId);

// 
            Socket_Sending_variable= {
                ...Socket_Sending_variable,type:Socket_Sending_type.Create_Stream,
                payload:{
                    type:"res",
                    commands:"addQueue",
                    videoInfo:{
                        title:axiosresponce.data.videoinfo.title,
                        channelTitle:axiosresponce.data.videoinfo.channel,
                        videoId:axiosresponce.data.videoinfo.id,
                        url:axiosresponce.data.videoUrl
                    },
                }
            }
                console.log(`This is the length of the user in the section : ${getSectionuser.length}`);
                for(let i = 0 ; i <getSectionuser.length; i++){
                    const idMappedUser= userIdMapping.get(getSectionuser[i].id);
                    if(getSectionuser[i]!=undefined && getSectionuser[i].socket!=undefined){
                        console.log(idMappedUser?.socket?.readyState)
                        idMappedUser?.socket?.send(JSON.stringify(Socket_Sending_variable));
                    }
            }
            
        })
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