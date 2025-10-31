import { userIdMapping } from "..";
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
		const value = await StorageController.getQueue(parsedMessege.sectionid ?? "");
		const userSocket = userIdMapping.get(parsedMessege.userId);
		const sendDetail: Socket_Sending = {
			type: Socket_Sending_type.Stream_Man,
			payload: {
				type: "res",
				commands: "GetState"
			},
			queue: value

		}

	}
}
