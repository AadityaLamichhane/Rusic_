import { Section_Id_To_QueueMap, sectionMap } from "../UserClass";
import axios from "axios";
import { Stream } from "../UserClass";
import { userIdMapping } from "..";
import { Socket_Sending, Socket_Sending_type } from "./../type";
import { StorageController } from "../redis/Storage";
import { current_playing_stream } from "../sections/src/utils/helper";
import { send } from "process";
export const SendToConnectedUser = (dbResponce: any) => {
	let Socket_Sending_variable: Socket_Sending = {
		payload: {
			type: "res",
			commands: ''
		},
		type: Socket_Sending_type.Stream_Man
	}
	try {
		const getSectionuser = sectionMap.get(dbResponce.sectionname);
		if (getSectionuser != undefined) {
			axios.post("http://localhost:3000/api/stream", { url: dbResponce.url }).then((axiosresponce) => {
				if (!Section_Id_To_QueueMap.has(dbResponce.sectionId)) {
					Section_Id_To_QueueMap.set(dbResponce.sectionId, []);
				}
				const queue_In_SectionId = Section_Id_To_QueueMap.get(dbResponce.sectionId);
				if (queue_In_SectionId == undefined) {
					return new Error();
				}
				if (queue_In_SectionId.find((stream) => stream.url === dbResponce.url &&
					stream.createdBy === dbResponce.userId &&
					stream.section_name === dbResponce.sectionname
				)) {
					console.log('Already in the session');
					return;
				}
				const newStream: Stream = {
					id: dbResponce.id,
					upvotes: 0,
					createdBy: dbResponce.userId,
					section_name: dbResponce.sectionname,
					title: axiosresponce.data.videoinfo.title,
					channelTitle: axiosresponce.data.videoinfo.channel,
					videoId: axiosresponce.data.videoinfo.id,
					url: axiosresponce.data.videoUrl
				}
				const current_playing = StorageController.getcurrentPlaying(dbResponce.sectionname).then((data) => {
					console.log('getting the current playing while sending to the connected user ', data);
					if (data == null || data?.length == 0 || data == undefined) { // basically in absence of current playing information it should just add to the current playing this 
						//Pop the top of the queue and then play next or play next and skip the rest 
						StorageController.setCurrentPlaying(newStream, dbResponce.sectionname); // set this to the playing is there is nothing in the playing thing 
						// Todo req the frontend to play this stream 
						Socket_Sending_variable = {
							...Socket_Sending_variable, type: Socket_Sending_type.Stream_Man,
							payload: {
								type: "res",
								commands: "playpayload",
								videoInfo: {
									title: axiosresponce.data.videoinfo.title,
									channelTitle: axiosresponce.data.videoinfo.channel,
									videoId: axiosresponce.data.videoinfo.id,
									url: axiosresponce.data.videoUrl
								},
							}
						}
						sendsocketVariable(dbResponce.sectionname, Socket_Sending_variable); //sending the socket frontend to play the given play load i.e ( added ->> no any stream--> ok cool play this payload)
					} else {
						queue_In_SectionId.push(newStream); // db in memory storage for the server
						StorageController.addToQueue(dbResponce.sectionname, newStream).then((data) => {
							console.log('the data is stored', data);
						}); //Calling the db for the responce
					}
				})
				Section_Id_To_QueueMap.set(dbResponce.sectionId, queue_In_SectionId); // now this will create the already existing thing in the line no 27 
				Socket_Sending_variable = {
					...Socket_Sending_variable, type: Socket_Sending_type.Create_Stream,
					payload: {
						type: "res",
						commands: "addQueue",
						videoInfo: {
							title: axiosresponce.data.videoinfo.title,
							channelTitle: axiosresponce.data.videoinfo.channel,
							videoId: axiosresponce.data.videoinfo.id,
							url: axiosresponce.data.videoUrl
						},
					}
				}
				// for the section user length iterate to the length and the socket of the susern nand then send the user the responce 
				sendsocketVariable(dbResponce.sectionname, Socket_Sending_variable);
			})
		}
		// When the new Queue is added ->  redis -> ws (QueueStatus{Update , addiition , removal , }) 
		// have another function that catches the redis -> Section , payload : (Queue ) , Type :{Add , Updated , delete , upnext }
		// Add -> Queue Array i.e in the redux -> add action , Remove -> remove action , Upnext -> upnext action
		// inside the Redis catch -> Redux Application logic to handle these Event ( Remove , add , Pop and next )
		// In the frontend As soon as i am authenntcated -> redirected to the page ->
	} catch (err) {
		console.log(err);
	}
}
export const sendsocketVariable = (sectionname: string, socketSendingVariable: Socket_Sending) => {
	const getSectionuser = sectionMap.get(sectionname);
	if (getSectionuser != undefined || getSectionuser != null) {
		for (let i = 0; i < getSectionuser.length; i++) {
			const idMappedUser = userIdMapping.get(getSectionuser[i].id);
			if (getSectionuser[i] != undefined && getSectionuser[i].socket != undefined) {
				idMappedUser?.socket?.send(JSON.stringify(socketSendingVariable));
			}
		}
	}
}
