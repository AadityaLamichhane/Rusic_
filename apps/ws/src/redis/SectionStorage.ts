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
	async UpdateQueue(sectionId: string, QueueItem: Stream, isIncr: boolean) {
		const QueueId = QueueItem.id;
		isIncr ? await this.redis.zIncrBy(`section:${sectionId}:sortedItems`, 1, QueueId) : await this.redis.zIncrBy(`section:${sectionId}:sortedItems`, -1, QueueId)

	}
	async deleteQueue(sectionId: string, QueueId: string) {
		await Promise.all([
			this.redis.hDel(`section:${sectionId}:queueItems`, QueueId),
			this.redis.hDel(`section:${sectionId}:sortedItems`, QueueId),
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
		console.log(`The redis is storing the information of the stream${streamInformation}`);
		const hset = await this.redis.hSet(`section:${sectionname}:currentPlaying`, sectionname, JSON.stringify(streamInformation));
		return true;
	}
	async getcurrentPlaying(sectionname: string) {
		const getCurrentdata = await this.redis.hGet(`section:${sectionname}:currentPlaying`, sectionname);
		console.log('Geting the current playing item', getCurrentdata);
		return getCurrentdata;
	}

}
