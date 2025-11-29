import { Socket_Sending_type, Socket_Sending } from "../../type";
import { sendsocketVariable } from "../../useraction/Sendtoconnected";
import { StorageController } from "../Storage"
import { Stream } from "../../UserClass";
export const playnext = async (sectionname: string) => {
	const Tos_of_Queue: Stream[] = await StorageController.getQueue(sectionname)// Section name is the section id in the redis config so this make sencs
	if (Tos_of_Queue.length > 0) {
		const topSong = Tos_of_Queue[0];
		console.log("The top of the queue is ", topSong)
		await StorageController.setCurrentPlaying(topSong, sectionname);
		console.log("This is working currecctly ");
		await StorageController.deleteQueue(sectionname, topSong.id)
		const messege: Socket_Sending = { //Get the top of the stack and play that what is playing in the top of stack 
			type: Socket_Sending_type.Stream_Man,
			payload: {
				type: "res",
				commands: "playpayload",
			},
			currentplaying: topSong
		}
		sendsocketVariable(sectionname, messege);
	} else {
		await StorageController.redis.del(`section:${sectionname}:currentPlaying`);
	}
	return;
} 
