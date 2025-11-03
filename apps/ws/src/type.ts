// Any Unique Type only needing in the Backend
import { Stream } from "./UserClass"
export enum Socket_Sending_type {
	Stream_Man,
	Join_Section,
	Create_Stream,
	Initial_Call,
	Create_Section
}
export type Socket_Sending = {
	payload: {
		type: "req" | "res",

		commands: "addQueue" | "updateQueue" | "" | "GetState" | "playnext" | "playpayload";
		videoInfo?: VideoInformation
	},
	type: Socket_Sending_type,
	url?: string,
	token?: string,
	sectionid?: string
	msg?: String
	userid?: string
	queue?: Stream[]
	currentplaying?: VideoInformation
}
export type VideoInformation = {
	urlId?: string
	title?: string,
	channelTitle?: string,
	videoId?: string,
	url?: string
}


