import { RedisClientType } from "redis";
import { Stream } from "../UserClass";
export class StorageClass {
	redis: RedisClientType;
	constructor(redisClient: RedisClientType) {
		this.redis = redisClient;
	}
	async addToQueue(sectionname: string, QueueItem: Stream) {
		const upvotes = QueueItem.upvotes ?? 0;
		const QueueId = QueueItem.id;
		await Promise.all([
			this.redis.hSet(`section:${sectionname}:queueItems`, QueueId, JSON.stringify(QueueItem)),
			this.redis.zAdd(`section:${sectionname}:sortedItems`, [{ score: upvotes, value: QueueId }]) //store the index of the sorted index number of queue-> for i get the sorted queue kinda approach   
		]);
		console.log('The data is stored in the queue');
		return true;
	}
	async UpdateQueue(sectionId: string, QueueId: string, isIncr: boolean) {
		try {

			isIncr ? await this.redis.zIncrBy(`section:${sectionId}:sortedItems`, 1, QueueId) : await this.redis.zIncrBy(`section:${sectionId}:sortedItems`, -1, QueueId) // This willl increase the section Uvote or the queue with the 1  number
			console.log("Updted the zindex of the section using the redis queue indeex");
			return true;
		} catch (err) {
			console.error("Error while updating the status of the applicaion");
			return false;
		}
		return true;
	}
	async deleteQueue(sectionId: string, QueueId: string) {
		console.log(`The tope element in the ${sectionId} and the queue song with the qeueue Id ${QueueId} is deleted`);
		await Promise.all([
			this.redis.hDel(`section:${sectionId}:queueItems`, QueueId),
			this.redis.zRem(`section:${sectionId}:sortedItems`, QueueId),
		])
		console.log("item Deleted in the server");

	}
	async getQueue(sectionname: string) {
		const index_idPair = await this.redis.zRange(`section:${sectionname}:sortedItems`, 0, -1);
		const items: Stream[] = [];
		for (const index of index_idPair) {
			const Item = await this.redis.hGet(`section:${sectionname}:queueItems`, index);
			if (Item) {
				items.push(JSON.parse(Item));
			}
		}
		return items;
	}
	async setCurrentPlaying(streamInformation: Stream, sectionname: string) {
		await this.redis.hSet(`section:${sectionname}:currentPlaying`, sectionname, JSON.stringify(streamInformation));
		return true;
	}
	async getcurrentPlaying(sectionname: string) {
		const getCurrentdata = await this.redis.hGet(`section:${sectionname}:currentPlaying`, sectionname);
		return getCurrentdata;
	}

}
