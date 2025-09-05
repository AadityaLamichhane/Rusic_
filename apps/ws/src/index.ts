import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
dotenv.config();
import { pub,sub, initializeRedis } from "./redisconfig";
import { User  } from "./UserClass";
import { Socket_Sending,Socket_Sending_type } from "./type";
import { sectionMap } from "./UserClass";
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
                console.log(messegeJson.type);
                    switch(messegeJson.type){
                        
                        case Socket_Sending_type.Join_Section:
                            // Make the redis call simoultanous
                            //@ts-ignore
                            if(!socket.user.id){
                                console.log("you are not authenticated");
                                // Send the Socket mEsseging the error trigger
                            } 
                            
                            const sectionCreation = await Join_the_section(messegeJson.sectionid || '' ,socket);
                            if(sectionCreation==true){
                                socketSendingVariable = {
                                    payload:{
                                        commands:"GetState",
                                        type:"req"
                                    },sectionid:messegeJson.sectionid,
                                    type:Socket_Sending_type.Stream_Man
                                }
                                socket.send(JSON.stringify(socketSendingVariable));
                            }
                            else{
                                console.log("Getting the information from the Sections");
                            }
                            break;
                        case Socket_Sending_type.Create_Stream:
                            
                            messegeJson.payload.commands="addQueue"
                            pub.publish(messegeJson.sectionid||'',JSON.stringify(messegeJson));
                        //   client.hSet(JSON.stringify(messegeJson.sectionId),JSON.stringify(messegeJson.url));
                        
                            break; 
                        case Socket_Sending_type.Stream_Man:
                            
                            if(messegeJson.payload.commands=="GetState"){
                                console.log('Send User from the redis');
                            }
                            // take the Stream man functiona and either upvote downvote or get the current state from the redis application
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
    socket.on("close",(socket:any)=>{
        // remove the user From the array
           if (socket.user && socket.user.id) {
        userIdMapping.delete(socket.user.id);
        for (const [sections, users] of sectionMap) {
            sectionMap.set(sections, users.filter(u => u.id !== socket.user.id));
        }
    }
    })

});
 }
