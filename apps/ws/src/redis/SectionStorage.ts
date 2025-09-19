import { RedisClientType } from "redis";
import {  Stream } from "../UserClass";
export class StorageClass {
    redis:RedisClientType; 
    constructor(redisClient:RedisClientType){
        this.redis = redisClient; 
    }
    async addToQueue(sectionname:string , QueueItem:Stream){
        const upvotes = QueueItem.upvotes??0;
         const QueueId =  QueueItem.id;
         console.log("The queue that is going to be stored is ",QueueItem);
        await Promise.all([
         this.redis.hSet(`section:${sectionname}:queueItems`,QueueId ,JSON.stringify(QueueItem)),
         this.redis.zAdd(`section:${sectionname}:sortedItems`,[{score:upvotes,value:QueueId}]) //store the index of the sorted index number of queue-> for i get the sorted queue kinda approach   
        ]);
        console.log('The data is stored in the queue');
        return true; 
    }
    async UpdateQueue(sectionId:string , QueueItem:Stream,isIncr:boolean){
        const QueueId = QueueItem.id;
        isIncr? await this.redis.zIncrBy(`section:${sectionId}:sortedItems`,1,QueueId):await this.redis.zIncrBy(`section:${sectionId}:sortedItems`,-1,QueueId)
    }
    async deleteQueue(sectionId:string , QueueId:string ){
        await Promise.all([
         this.redis.hDel(`section:${sectionId}:queueItems`,QueueId),
         this.redis.hDel(`section:${sectionId}:sortedItems`,QueueId),
        ])
        console.log("item Deleted in the server");

    }
    async getQueue(sectionname:string){
        const index_idPair  = await  this.redis.zRange(`section:${sectionname}:sortedItems`,0,-1);
        const items: Stream[]=[];
        console.log("Sending the get data to the user");
        console.log("the data is being sent for the infomration of the data in the ",sectionname);
        for(const index of index_idPair){
            const Item = await this.redis.hGet(`section:${sectionname}:queueItems`,index);
            items.push(JSON.parse(Item??""));
        }
        console.log(items);
        
        return items;
    }
    async setCurrentPlaying(streamInformation:Stream ,sectionname:string){
        const hset = await this.redis.hSet(`section:${sectionname}:currentPlaying`,sectionname , JSON.stringify(streamInformation));
        console.log('Current playing is Changed');
        return true; 
    }
    async getcurrentPlaying (sectionname:string){
        const getCurrentdata = await this.redis.hGet(`section:${sectionname}:currentPlaying`,sectionname);
        console.log(`The current data information is ${getCurrentdata}`);
        return getCurrentdata ; 
    }

}
