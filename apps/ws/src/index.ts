import { createClient, RedisClientType} from "redis";
import { SessionType }  from  "@repo/lib/wsenvsetup"
import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
import jwt from 'jsonwebtoken'
dotenv.config();
const redisConfig = {
    host:process.env.REDIS_HOST|| 'localhost',
    port:parseInt(process.env.REDIS_PORT || "6379"),
    password:process.env.REDIS_PASSWORD,
    username:process.env.REDIS_USERNAME,
    database:parseInt(process.env.REDIS_DB ||"0")
}

 enum Socket_Sending_type{
    Stream_Man, 
    Join_Section,
    Create_Stream
 }
 type Socket_Sending= {
    type : Socket_Sending_type,
    url: String  ,
    token?: String,
    sectionId?: String
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


 function ServerHandeling(){
    const wss = new WebSocketServer({port:8080});
    let isJoined = false ;
    
    wss.on("connection",(socket:any)=>{
        //handle the socket Connection with the id given to join the section as soon as user enter the room
         
        socket.on("messege",(messege:string)=>{
        
             const messegeJson:Socket_Sending  = JSON.parse(messege);
             if(messegeJson.type==Socket_Sending_type.Join_Section){

                const decryptedToken = jwt.decode( messegeJson.token as string || "");
                if(decryptedToken){
                  JoinMessegeHandling(messegeJson,decryptedToken).then(async()=>{
                    switch(messegeJson.type){
                        case Socket_Sending_type.Create_Stream:
                            console.log("You are trying to create the stream");
                            // Todo make the change in redis first and then asynchronously do the db call 

                        case Socket_Sending_type.Stream_Man:
                            // Connect to the function that checks the user and then return the 
                            console.log("You are trying to manipulate ")
                    }
                  } );
                }
             }

            //  Hadnle the user to join and only run the switch case if the user is inside the room
            if(messegeJson.type==Socket_Sending_type.Join_Section){
                console.log("You are Trying to join the room with the Roomid ");


            }
    })
    //  client.lPush("submission",JSON.stringify({problemid , code , language , userId })) 
});
 }
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client.quit();
    process.exit(0);
});


 const JoinMessegeHandling = async (jsonData:Socket_Sending,decryptedToken:any)=>{
    console.log("You are handing the messgee");
                switch(jsonData.type){
                    case Socket_Sending_type.Create_Stream:
                        await client.lPush("stream",JSON.stringify({
                            type:Socket_Sending_type.Create_Stream,
                            url:jsonData.url,
                            userId:decryptedToken.id
                        }))
             }

}