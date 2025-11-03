import { Socket_Sending_type, Socket_Sending } from "../../type";
import { sendsocketVariable } from "../../useraction/Sendtoconnected";
import { StorageController } from "../Storage"
import { Stream } from "../../UserClass";
export const playnext = async (sectionname: string) => {
	const Tos_of_Queue: Stream[] = await StorageController.getQueue(sectionname)// Section name is the section id in the redis config so this make sencs
	if (Tos_of_Queue.length > 0) {
		const topSong = Tos_of_Queue[0];
		await StorageController.setCurrentPlaying(topSong, sectionname);
		await StorageController.deleteQueue(sectionname, topSong.id)
		const messege: Socket_Sending = {
			type: Socket_Sending_type.Stream_Man,
			payload: {
				type: "res",
				commands: "playpayload",
			},
			currentplaying: topSong
		}
		sendsocketVariable(sectionname, messege);
	} else {
		await StorageController.redis.hDel(`section:${sectionname}:currentPlaying`, sectionname);
	}


	console.log(`This is the top of the stack `, Tos_of_Queue);
	console.log(`The top of the stack is ${JSON.stringify(Tos_of_Queue[0])}`);
	return;
} 
