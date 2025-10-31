import prisma from "@repo/db/client";
import { SendToConnectedUser } from "../useraction/Sendtoconnected";
import { Socket_Sending } from "./../type";
export async function createStream(parsedMessege: Socket_Sending) {
	// call the publiser to publish the Stream and with the payload added
	if (parsedMessege.payload.videoInfo != undefined) {
		const findPrisma = await prisma.stream.findFirst({
			where: {
				url: parsedMessege.url,
				sectionname: parsedMessege.sectionid,
			}
		});
		if (findPrisma == undefined || findPrisma == null) {
			await prisma.stream.create({
				data: {
					sectionname: parsedMessege.sectionid,
					userId: parsedMessege.userid,
					urlId: parsedMessege.payload.videoInfo.urlId,
					url: parsedMessege.url
				}

			}).then((responce: any) => {
				SendToConnectedUser(responce);
				return { success: true, responce: responce }
			}).catch((err: any) => {
				console.log(err);
				return { success: false, responce: null };
			});
			return { success: true, data: {} };
		}
		else {//
			// Condition for the stream is Doun in the file
			console.log('This already exist in the Section');
			return { success: false, message: "exist" }
		}
	}
}
