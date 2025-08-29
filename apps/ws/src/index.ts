import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
dotenv.config();
import prisma from  "@repo/db/client"
import { pub,sub, initializeRedis } from "./redisconfig";
import { User , sectionMap ,userSectionMap , Queue , SectionQueueMap ,createUser,streamQueue } from "./UserClass";
import { Socket_Sending , Socket_Sending_type } from "./type";
import { JoinMessegeHandling } from "./JoinAuth";
import axios from "axios"
import { title } from "process";
// Declaring the variable for the server to hande the users 
// Todo Make this more clean  
const users :User[] = [];
const sectionsId:string[] =[];
const userIdMapping= new Map<string,User>();
// For the consistent sending type and clean error handeling 
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
                const data = await JoinMessegeHandling(messegeJson.token,socketSendingVariable);
                if(data.status){
                    //@ts-ignore
                    socket.id = data.id;
                    socket.name = data.name;
                    socketSendingVariable = {
                        ...socketSendingVariable,
                        type:Socket_Sending_type.Initial_Call,
                        msg:"success"
                    }
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
                            if(!socket.id){
                                console.log("you are not authenticated");
                            } 
                            const sectionCreation = await Join_the_section(messegeJson.sectionid || '' ,socket.id,socket.name,socket);
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
    socket.on("close",()=>{
        // socket.id -> sectionid and then remove the user form the setion
        // if the user is last to teh section remove the section to 
        // unsubscribe too 
        const closingUserId = socket.id;
        console.log(closingUserId);
    })
});
 }

async function Join_the_section (sectionid:string,userid:string,userName:string,socket:WebSocket){
    // Make the object while joining the  any section
    const user  = new User(userName,userid,socket);
    userIdMapping.set(userid,user);
    if(!sectionMap.get(sectionid) && !sectionsId.includes(sectionid)){
        sectionMap.set(sectionid ,[user]);
        try{
        const sectionCreation = await prisma.section.create({
            data:{ 
                createrId:userid,
                Sectionname:sectionid
            }
        });
        if(sectionCreation==undefined || sectionCreation==null){
            return false ; 
        }
        }catch(err){
            console.log('Error while joining the section');
            console.log(err);
            }
            sub.subscribe(sectionid,async (messege:string)=>{
                const parsedMessege = await JSON.parse(messege);
                if(parsedMessege.payload.type=="create_section"){
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
                                    urlId:parsedMessege.urlid,
                                    url:parsedMessege.url
                                }
                                }).then((responce:any)=>{
                                    console.log(responce);
                                SendToConnectedUser(parsedMessege,responce);
                            }).catch((err:any)=>{
                                console.log(err);
                            });
                    // Make the asynchronous db call to store the data 
                    }
                    else{//
                        // Condition for the stream is Doun in the file 
                        }
                         }
            })

    }else{
        const usersarray = sectionMap.get(sectionid);
        if(usersarray!=undefined){
            // know if the user is already if this user 
            const isGivenUser = sectionMap.get(sectionid)?.filter((user:User)=>user.id==userid);
            if(!isGivenUser){
                sectionMap.set(sectionid ,[...usersarray,user]);
            }
        }else{
            console.log("unexpected behaviour");
            return false ; 
        }
    } 
           return true ;  
    }
    function loader(){
    prisma.user.findMany({}).then((cal:any[])=>{
        for(let i = 0 ; i <cal.length; i++){
        const induser  = (createUser(cal[i].name,cal[i].id));
            userIdMapping.set(cal[i].id,induser);
           
        }
    }).catch((err:Error)=>{
        console.log(err);
    });
}
function Sections(){
    prisma.stream.deleteMany({}).then((responce:{count:string}|any)=>{
        console.log('count of the stream Deleted',responce);
        prisma.section.deleteMany({}).then((callback:any)=>{
            console.log(`Total of ${callback.count} is being deleted `);
        });
    })
}
const  SendToConnectedUser = (parsedMessege:any,responce:any)=>{
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
        console.log("total setcion user is ",getSectionuser.length);

        axios.post("http://localhost:3000/api/stream",{url:responce.url}).then((responce)=>{
console.log(JSON.stringify(responce.data));
        socketSendingVariable= {
            ...socketSendingVariable,type:Socket_Sending_type.Create_Stream,
            payload:{
                type:"res",
                commands:"addQueue",
                videoInfo:{
                    title:responce.data.videoinfo.title,
                    channelTitle:responce.data.videoinfo.channel,
                    videoId:responce.data.videoinfo.id
                }
            }            ,
        }
            if(JSON.stringify(responce.status)[0] == '2'){
                for(let i = 0 ; i <getSectionuser.length; i++){
                    const socket = userIdMapping.get(getSectionuser[i].id);
                    if(getSectionuser[i]!=undefined && getSectionuser[i].socket!=undefined){
                        socket?.socket?.send(JSON.stringify(socketSendingVariable));
                    }
            }
            }
        })
        console.log(SectionQueueMap.get(parsedMessege.sectionid));
    }
}catch(err){
    console.log(err);
}
}