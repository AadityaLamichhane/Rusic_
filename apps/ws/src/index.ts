import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
dotenv.config();
import prisma from  "@repo/db/client"
import { pub,sub, initializeRedis } from "./redisconfig";
import { User , sectionMap ,userSectionMap} from "./UserClass";
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
                            break;
                        case Socket_Sending_type.Create_Stream:
                            // client.set(, )
                            pub.publish(messegeJson.sectionId ||"",JSON.stringify(messegeJson));
                        //   client.hSet(JSON.stringify(messegeJson.sectionId),JSON.stringify(messegeJson.url));
                        
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
    socket.on("close",()=>{
        // socket.id -> sectionid and then remove the user form the setion
        // if the user is last to teh section remove the section to 
        // unsubscribe too 
        const closingUserId = socket.id;
        console.log(closingUserId);
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
let count = 0 ; 
async function Join_the_section (sectionid:string,userid:string,userName:string,socket:WebSocket){
    const user  = new User(userName,socket);
    userIdMapping.set(userid,user);
    if(!sectionMap.get(sectionid) && !sectionsId.includes(sectionid)){
        sectionMap.set(sectionid ,[user]);
        console.log(JSON.stringify(sectionMap));
        console.log("Creating the new Section");
        const sectionCreation = await prisma.section.create({
            data:{ 
                createrId:userid,
                Sectionname:sectionid
            }
        });
        if(sectionCreation==undefined || sectionCreation==null){
            return false ; 
        }
            sub.subscribe(sectionid,async (messege:string)=>{
                const parsedMessege = await JSON.parse(messege);
                try{
                    const getSections = sectionMap.get(parsedMessege.sectionId);
                    if(getSections!=undefined){
                        for(let i = 0 ; i <getSections?.length; i++){
                       count++; 
                        }
                        console.log(count);
                    }
                }catch(err){
                    console.log(err);
                }
        })
           return true ;  
    }else{
        
        const usersarray = sectionMap.get(sectionid);
        if(usersarray!=undefined){
            console.log("Section already exist");
            sectionMap.set(sectionid ,[...usersarray,user]);
            console.log(JSON.stringify(sectionMap));
        }else{
            console.log("user array was undefined unexpected behaviour")
            return false ; 
        }
    } 
    // so the user is subscribing to the section id user:sectioon id and inside this i can do the 
    }
    // Supposed to join the Section using the id->hashed ---> mapped to the Users
    // Users Class names id and So on and so forth which will be handled by this 
    // Map<token , Users>    Whre Users<user[]> and user = {name and So on filed in the}

