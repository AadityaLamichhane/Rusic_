import { StorageController } from "./redis/Storage"
import { sendToSocket } from "./useraction/SendToSocket";
import { sendsocketVariable } from "./useraction/Sendtoconnected";
import { Socket_Sending, Socket_Sending_type } from "./type"
type VideoInfo = {
	id: string,
}
export const upvote = async (sectionname: string, videoInfo: VideoInfo) => {
	const updatedInformation = await StorageController.UpdateQueue(sectionname, videoInfo.id, true);
	const latestQueue = await StorageController.getQueue(sectionname);

	const messege: Socket_Sending = { //Get the top of the stack and play that what is playing in the top of stack 
		type: Socket_Sending_type.Stream_Man,
		payload: {
			type: "res",
			commands: "updateQueue",
		},
		queue: latestQueue
	}
	sendsocketVariable(sectionname, messege);
}
