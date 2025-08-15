import { createClient, RedisClientType} from "redis";
const redisConfig = {
    host:process.env.REDIS_HOST|| 'localhost',
    port:parseInt(process.env.REDIS_PORT || "6379"),
    password:process.env.REDIS_PASSWORD,
    username:process.env.REDIS_USERNAME,
    database:parseInt(process.env.REDIS_DB ||"0")
}
 let  client :RedisClientType ; 
export async function initializeRedis(){
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
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client.quit();
    process.exit(0);
});