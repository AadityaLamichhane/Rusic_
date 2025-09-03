import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
dotenv.config();
import { pub,sub, initializeRedis } from "./redisconfig";
import { User  } from "./UserClass";
import { Socket_Sending , Socket_Sending_type } from "./type";
import { JoinMessegeHandling } from "./JoinAuth";
import {loader , Sections} from "./sections"
import { Join_the_section } from "./sections/src/JoinSection";
export const SectionIdList:string[] =[];
export const userIdMapping= new Map<string,User>();
 let socketSendingVariable: Socket_Sending = {
    payload:{
    type:"res",
    commands:"",
    
    },
    type:Socket_Sending_type.Initial_Call,
 }
// redis
initializeRedis().then(()=>{
     ServerHandeling(); //Redis Stuff
     Sections(); //Sections Deletion after the server is re initiated
     loader();  //User Defination
})
let isJoined = false ; 
 function ServerHandeling(){
    const wss = new WebSocketServer({port:8080});
    wss.on("connection",(socket:any)=>{
        socket.on("message",async(message:string)=>{
             const messegeJson:Socket_Sending  = JSON.parse(message);
            if(messegeJson.token && messegeJson.type==Socket_Sending_type.Initial_Call){
                const data = await JoinMessegeHandling(messegeJson.token,socketSendingVariable,socket);
                if(data.status){
                    //@ts-ignore
                    socketSendingVariable = {
                        ...socketSendingVariable,
                        type:Socket_Sending_type.Initial_Call,
                        msg:"success"
                    }
                    socket.user = data.addeduser
                    // Store the Local storage for the More consistent 
                    isJoined =true  
                }else{
                    socketSendingVariable = {
                        ...socketSendingVariable,
                        type:Socket_Sending_type.Initial_Call,
                        msg:"fail"
                    }
                }
                socket.send(JSON.stringify(socketSendingVariable));
            }
            else if(messegeJson.payload.type=="req"){
                    switch(messegeJson.type){
                        case Socket_Sending_type.Join_Section:
                            // Make the redis call simoultanous
                            //@ts-ignore
                            if(!socket.user.id){
                                console.log("you are not authenticated");
                                // Send the Socket mEsseging the error trigger
                            } 
                            const sectionCreation = await Join_the_section(messegeJson.sectionid || '' ,socket.user,socket);
                            if(sectionCreation==true){
                                console.log("Added to the section");
                            }
                            else{
                                console.log("Getting the information from the Sections");
                            }
                            break;
                        case Socket_Sending_type.Create_Stream:
                            
                            //@ts-ignore
                            pub.publish(messegeJson.sectionid,JSON.stringify({...messegeJson,payload:{type:"create_section"}}));
                        //   client.hSet(JSON.stringify(messegeJson.sectionId),JSON.stringify(messegeJson.url));
                        
                            break; 
                        case Socket_Sending_type.Stream_Man:
                            console.log("You are trying to manipulate ");
                            break; 
                        case Socket_Sending_type.Create_Section:
                            console.log('You are trying to create the section');
                            break;
                            default :
                            console.log("Error But here is your messege",messegeJson);
                            return ; 
                    }
            }
    })

});
 }
