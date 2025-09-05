import { pub } from "../redisconfig";
import { RedisClientType } from "redis";
import {  Stream } from "../UserClass";
export class StorageClass {
    redis:RedisClientType; 
    constructor(redisClient:RedisClientType){
        this.redis = redisClient; 
    }
    async addToQueue(sectionId:string , QueueItem:Stream){
        const upvotes = QueueItem.upvotes??0;
        const QueueId = QueueItem.url;
        await this.redis.hSet(`section:${sectionId}:queueItems`,QueueId ,JSON.stringify(QueueItem));
        await this.redis.zAdd(`section:${sectionId}:sortedItems`,[{score:upvotes,value:QueueId}]);
    }
    async UpdateQueue(sectionId:string , QueueItem:Stream){
        const QueueId = QueueItem.url;
        await this.redis.zIncrBy(`section:${sectionId}:sortedItems`,1,QueueId);
    }
    async deleteQueue(sectionId:string , QueueId:string ){
        await Promise.all([
         this.redis.hDel(`section:${sectionId}:queueItems`,QueueId),
         this.redis.hDel(`section:${sectionId}:sortedItems`,QueueId),
        ])
        console.log("item Deleted in the server");

    }
    async getQueue(sectionId:string){
        const index_idPair  = await  this.redis.zRangeByScore(`section:${sectionId}:sortedItems`,0,1);
        const items: Stream[]=[];
        for(const index of index_idPair){
            const Item = await this.redis.hGet(`section:${sectionId}:queueItems`,index);
            items.push(JSON.parse(Item??""));
        }
        return items;

    }
}
