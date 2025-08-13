import { createClient, RedisClientType} from "redis";
import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
import prisma from  "@repo/db/client"
import jwt from 'jsonwebtoken'
import { url } from "inspector";
dotenv.config();
const redisConfig = {
    host:process.env.REDIS_HOST|| 'localhost',
    port:parseInt(process.env.REDIS_PORT || "6379"),
    password:process.env.REDIS_PASSWORD,
    username:process.env.REDIS_USERNAME,
    database:parseInt(process.env.REDIS_DB ||"0")
}

 export enum Socket_Sending_type{
    Stream_Man, 
    Join_Section,
    Create_Stream,
    Initial_Call
 }
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
let client :RedisClientType ; 
async function initializeRedis(){
    try{
        client = createClient({
            socket:{
                host:redisConfig.host,
                port:redisConfig.port,
            },
            password:redisConfig.password,
            username:redisConfig.username,
            database:redisConfig.database

        })
        client.on("connect",()=>{
            console.log('The client is Connectedt to the Redis Application');

        });
        client.on("messege",async(raw)=>{
        })
    await client.connect();
    }
    catch(err){
        console.log(err);
    }
}
initializeRedis().then(()=>{
     ServerHandeling(); 
})
isJoined = false ; 
 function ServerHandeling(){
    const wss = new WebSocketServer({port:8080});
    wss.on("connection",(socket:any)=>{
        socket.on("message",async(message:string)=>{
          console.log(message);
             const messegeJson:Socket_Sending  = JSON.parse(message);
            if(messegeJson.token && messegeJson.type==Socket_Sending_type.Initial_Call){
                const data = await JoinMessegeHandling(messegeJson.token);
                if(data){
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
                            console.log("You are trying to join the session");
                            break;
                        case Socket_Sending_type.Create_Stream:
                            console.log("You are trying to create the stream");
                        case Socket_Sending_type.Stream_Man:
                            console.log("You are trying to manipulate ")
                    }
            }
            if(messegeJson.type==Socket_Sending_type.Join_Section){
                console.log("You are Trying to join the room with the Roomid ");
            }
    })
});
 }
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client.quit();
    process.exit(0);
});
 const JoinMessegeHandling= async(token:string)=>{
    try{
            const decryptedToken = jwt.verify(token,process.env.AUTH_SECRET as string);
            if(decryptedToken!=null){
                //@ts-ignore
            }
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
                return false ; 
            }
            console.log("Hey you are legit user");
            return true ; 
            }
    }catch(err){
            console.log(err);
            console.log("you are handing the messege");
            return false ; 
    }
            return true ; 
}