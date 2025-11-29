import { WebSocketServer } from "ws";
import { pub, initializeRedis } from "./redisconfig";
import { User } from "./UserClass";
import { Socket_Sending, Socket_Sending_type } from "./type";
import { sectionMap } from "./UserClass";
import { JoinMessegeHandling } from "./JoinAuth";
import { loader, Sections } from "./sections"
import { Join_the_section } from "./sections/src/JoinSection";
import { StorageController, StorageInit } from "./redis/Storage";
import { sendToSocket } from "./useraction/SendToSocket";
import { playnext } from "./redis/functions/playnext";
export const SectionIdList: string[] = [];
export const userIdMapping = new Map<string, User>();
// redis
(async () => {
	await initializeRedis()
	StorageInit();
	ServerHandeling(); //Redis Stuff
	Sections(); //Sections Deletion after the server is re initiated
	loader();  //User Defination
})(); //Making the callback function call to the redis

let isJoined = false;
function ServerHandeling() {
	const wss = new WebSocketServer({ port: 8080 });
	wss.on("connection", (socket: any) => {
		socket.on("message", async (message: string) => {
			let socketSendingVariable: Socket_Sending = {
				payload: {
					type: "res",
					commands: "",
				},
				type: Socket_Sending_type.Initial_Call,
			}
			const messegeJson: Socket_Sending = JSON.parse(message);

			if (messegeJson.token && messegeJson.type == Socket_Sending_type.Initial_Call) {
				const data = await JoinMessegeHandling(messegeJson.token, socketSendingVariable, socket);
				if (data.status) {
					socketSendingVariable.type = Socket_Sending_type.Initial_Call;
					socketSendingVariable.msg = "success"
					socket.user = data.addeduser

				} else {
					socketSendingVariable.type = Socket_Sending_type.Initial_Call;
					socketSendingVariable.msg = "fail"
				}
				console.log('sending the responce of the Auth to the user'); // After the authentcii"
				socket.send(JSON.stringify(socketSendingVariable));
			}
			else if (messegeJson.payload.type == "req") {
				switch (messegeJson.type) {
					case Socket_Sending_type.Join_Section:
						// Make the redis call simoultanous
						//@ts-ignore
						if (!socket.user || !socket.user.id || socket.user == undefined) {
							// Todo better auth handeling with the dedicated erroe handeling method
							socketSendingVariable.type = Socket_Sending_type.Join_Section;
							socketSendingVariable.msg = "failed: UNAUTHENTICATED"
							socket.send(JSON.stringify(socketSendingVariable));

							// Send the Socket mEsseging the error trigger
						}
						const sectionCreation = await Join_the_section(messegeJson.sectionid || '', socket);
						if (sectionCreation == true) {
							socketSendingVariable.type = Socket_Sending_type.Join_Section;
							socketSendingVariable.msg = "success"
							socket.send(JSON.stringify(socketSendingVariable));
						}
						else {
							console.log('Error : Section Operation');
						}
						break;
					case Socket_Sending_type.Create_Stream:
						messegeJson.payload.commands = "addQueue"
						pub.publish(messegeJson.sectionid || '', JSON.stringify(messegeJson));
						break;
					case Socket_Sending_type.Stream_Man:
						if (messegeJson.payload.commands == "GetState") {
							const userId = socket.user.id;
							console.log(messegeJson.sectionid);
							pub.publish(messegeJson.sectionid || "", JSON.stringify({ ...messegeJson, userId }));
						}
						if (messegeJson.payload.commands == "playnext") {
							playnext(messegeJson.sectionid ?? "");
						}
						if (messegeJson.payload.commands == "updateQueue") {

						}
						// take the Stream man functiona and either upvote downvote or get the current state from the redis application
						break;
					case Socket_Sending_type.Create_Section:
						console.log('You are trying to create the section');
						break;
					default:
						console.log("Error But here is your messege", messegeJson);
						return;
				}
			}
		})
		socket.on("close", (socket: any) => {
			console.log(`before:${sectionMap.size}`);
			// remove the user From the array
			if (socket.user && socket.user.id) {
				userIdMapping.delete(socket.user.id);
				for (const [sections, users] of sectionMap) {
					sectionMap.set(sections, users.filter(u => u.id !== socket.user.id));
				}
			}
			console.log(sectionMap.size);
		})
	});
}
const getStream = (socket: WebSocket, section_name: string) => {
	console.log('You are trying to get the information of the sectionname ', section_name);
	StorageController.getQueue(section_name).then((queueInformation) => {
		console.log("the section information user is trying to get is the ", queueInformation);
	});
}
