import { userIdMapping } from "..";
import { sendToSocket } from "../useraction/SendToSocket";
import { createStream } from "../stream/createStream";
import { Socket_Sending, Socket_Sending_type } from "../type";
import { playnext } from "./functions/playnext";
import { StorageController } from "./Storage";
export async function Section_Subhandler(messege: string) {
	const parsedMessege = await JSON.parse(messege);
	if (parsedMessege.payload.commands == "addQueue") {
		const status = await createStream(parsedMessege); // create the stream in the db + redis client  // also make the play next and all the thing to make ths current 
		if (status?.success) {
			const getCurrentPlaying = await StorageController.getcurrentPlaying(parsedMessege.sectionid); // Store the stored data in tteh client of thed at 
			if (!getCurrentPlaying) {
				playnext(parsedMessege.sectionid);
			}
		}
	} else if (parsedMessege.payload.commands == "GetState") {
		const sectionId = parsedMessege.sectionid ?? "";
		let currentPlaying = await StorageController.getcurrentPlaying(sectionId);
		const queue = await StorageController.getQueue(sectionId);
		if (!currentPlaying && queue.length > 0) {
			await playnext(sectionId);
			currentPlaying = await StorageController.getcurrentPlaying(sectionId);
		}
		const userSocket = userIdMapping.get(parsedMessege.userId);
		const sendDetail: Socket_Sending = {
			type: Socket_Sending_type.Stream_Man,
			payload: {
				type: "res",
				commands: "GetState"
			},
			queue: queue,
			//@ts-ignore
			currentplaying: currentPlaying ? JSON.parse(currentPlaying) : null
		}
		if (userSocket && userSocket.socket) {
			sendToSocket(userSocket.socket, JSON.stringify(sendDetail));
		}
	}
}
