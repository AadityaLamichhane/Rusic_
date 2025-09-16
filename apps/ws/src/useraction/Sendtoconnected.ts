import { Section_Id_To_QueueMap,sectionMap} from "../UserClass";
import axios from "axios";
import { Stream } from "../UserClass";
import { userIdMapping } from "..";
import { Socket_Sending,Socket_Sending_type } from "./../type";
import { StorageController } from "../redis/Storage";

export const  SendToConnectedUser = (dbResponce:any)=>{
let Socket_Sending_variable :Socket_Sending = {
     payload: {
        type: "res",
        commands:''
    },
    type: Socket_Sending_type.Stream_Man
}
try{
    console.log('this is the send to user');
    const getSectionuser = sectionMap.get(dbResponce.sectionname);
    if(getSectionuser!=undefined){
              axios.post("http://localhost:3000/api/stream",{url:dbResponce.url}).then((axiosresponce)=>{

            if(!Section_Id_To_QueueMap.has(dbResponce.sectionId)){
                Section_Id_To_QueueMap.set(dbResponce.sectionId,[]);
            }
            const queue_In_SectionId=Section_Id_To_QueueMap.get(dbResponce.sectionId);
            if(queue_In_SectionId==undefined){
                return new Error();
            }
            if(queue_In_SectionId.find((stream)=>stream.url===dbResponce.url &&
                stream.createdBy===dbResponce.userId && 
                stream.section_name=== dbResponce.sectionname
            )){
                console.log('Already in the session');
                return ; 
            } 
            console.log("This is creating the new stream on LIne ");
            const newStream:Stream = {
                id:dbResponce.id,
                upvotes:0,
                createdBy:dbResponce.userId,
                section_name:dbResponce.sectionname,
                title:axiosresponce.data.videoinfo.title,
                channelTitle:axiosresponce.data.videoinfo.channel,
                videoId:axiosresponce.data.videoinfo.id,
                url:axiosresponce.data.videoUrl
            }
            queue_In_SectionId.push(newStream);
        StorageController.addToQueue(dbResponce.sectionname, newStream).then(()=>{
            console.log('the data is stored');
        }); //Calling the db for the responce
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
            console.log('Seding to the user');
                for(let i = 0 ; i <getSectionuser.length; i++){
                    const idMappedUser= userIdMapping.get(getSectionuser[i].id);
                    if(getSectionuser[i]!=undefined && getSectionuser[i].socket!=undefined){
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