import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
dotenv.config();
import prisma from  "@repo/db/client"
import { initializeRedis } from "./redisconfig";
import { User , sectionMap } from "./UserClass";
import jwt from 'jsonwebtoken'
 export enum Socket_Sending_type{
    Stream_Man, 
    Join_Section,
    Create_Stream,
    Initial_Call,
    Create_Section
 }
const users :User[] = [];
const sectionsId:string[] =[];
const userIdMapping= new Map<string,User>();
 export type Socket_Sending= {
    type : Socket_Sending_type,
    url?: string  ,
    token?: string,
    sectionId?: string
    msg?:String
 }
 let socketSendingVariable: Socket_Sending = {
    type:Socket_Sending_type.Initial_Call,
 }
initializeRedis().then(()=>{
     ServerHandeling(); 
})
let isJoined = false ; 
 function ServerHandeling(){
    const wss = new WebSocketServer({port:8080});
    wss.on("connection",(socket:any)=>{
        socket.on("message",async(message:string)=>{
             const messegeJson:Socket_Sending  = JSON.parse(message);
            if(messegeJson.token && messegeJson.type==Socket_Sending_type.Initial_Call){
                
                const data = await JoinMessegeHandling(messegeJson.token);
                if(data.status){
                    //@ts-ignore
                    socket.id = data.id;
                    socket.name = data.name;
                    socketSendingVariable = {
                        type:Socket_Sending_type.Initial_Call,
                        msg:"success"
                    }
                    isJoined =true  
                }else{
                    socketSendingVariable = {
                        type:Socket_Sending_type.Initial_Call,
                        msg:"fail"
                    }
                }
                socket.send(JSON.stringify(socketSendingVariable));
            }
            else{
                    switch(messegeJson.type){
                        case Socket_Sending_type.Join_Section:
                            // Make the redis call simoultanous
                            //@ts-ignore
                            if(!socket.id){
                                console.log("you are not authenticated");
                            } 
                            const sectionCreation = await Join_the_section(messegeJson.sectionId || '' ,socket.id,socket.name,socket);
                            if(sectionCreation==true){
                                console.log("Your section is Added to the section");
                            }
                            else{
                                console.log("Getting the information from the Sections");
                            }
                            console.log("Person has joined the section");
                            
                            break;
                        case Socket_Sending_type.Create_Stream:
                            console.log("You are trying to create the stream");
                            break; 
                        case Socket_Sending_type.Stream_Man:
                            console.log("You are trying to manipulate ");
                            break; 
                        case Socket_Sending_type.Create_Section:
                            console.log('You are trying to create the section');
                            break;
                    }
            }
    })
});
 }
 const JoinMessegeHandling= async(token:string)=>{
    try{
        // @ts-ignore
            const decryptedToken = jwt.verify(token,process.env.AUTH_SECRET_WS);
            if(decryptedToken!=null){
                const prismaUser = await prisma.user.findFirst({
                    where:{
                        //@ts-ignore
                        id:decryptedToken.id 
                    }
                });
                if(prismaUser==null){
                    console.log("No such user was found");
                    socketSendingVariable= {...socketSendingVariable,msg:"fail"}
                    return {status:false,id:"",name:"Anonymous"} ; 
                }
                //@ts-ignore
                console.log('user confirmed');
                return {status:true , id:prismaUser.id , name:prismaUser.name} ; 
            }
            return {status:false , id:'',name:"Anonymous"};
    }catch(err){
            console.log("you are handing the messege");
            return {status:false , id:'',name:"Anonymous"}; 
    }
}

async function Join_the_section (sectionid:string,userid:string,userName:string,socket:WebSocket){
// Create the user 
    const user  = new User(userName,socket);
    userIdMapping.set(userid,user);
// Check if the sectioon is there yes -> just add the user , non -> make one and add user 
// condition  2 
    console.log(sectionid);

    if(!sectionsId.includes(sectionid)){
        sectionsId.push(sectionid);
        sectionMap.set(sectionid ,[user] );
        console.log("Creatingg the sEction");
        const sectionCreation = await prisma.section.create({
            data:{ 
                createrId:userid,
                Sectionname:sectionid
            }
        });
        if(sectionCreation==undefined || sectionCreation==null){
            return false ; 

        }
        return true
    }else{
        //condition 1
        // get the user from the usrs 
        const usersarray = sectionMap.get(sectionid);
        console.log("Section already exist");
        if(usersarray!=undefined){
            sectionMap.set(sectionid ,[...usersarray,user])
        }else{
            console.log("user array was undefined unexpected behaviour")
            return false ; 
        }
    } 
    }
    // Supposed to join the Section using the id->hashed ---> mapped to the Users
    // Users Class names id and So on and so forth which will be handled by this 
    // Map<token , Users>    Whre Users<user[]> and user = {name and So on filed in the}


