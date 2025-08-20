import { createClient, RedisClientType} from "redis";
const redisConfig = {
    host:process.env.REDIS_HOST|| 'localhost',
    port:parseInt(process.env.REDIS_PORT || "6379"),
    password:process.env.REDIS_PASSWORD,
    username:process.env.REDIS_USERNAME,
    database:parseInt(process.env.REDIS_DB ||"0")
}
export let pub  :RedisClientType ; 
export let sub : RedisClientType ;
export async function initializeRedis(){
    try{
         pub = createClient(redisConfig);
        pub.on("connect",()=>{
            console.log('Publisher is in this container ');
        });
    await pub.connect();
    sub = createClient(redisConfig);
    sub.on("connect",()=>{
        console.log("Sub is on the way ");
    });
  
    await sub.connect();
    }
    catch(err){
        console.log(err);
    }
}
 
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pub.quit();
    process.exit(0);
});