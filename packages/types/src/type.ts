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
		msg?: string,
		commands: "addQueue" | "updateQueue" | "" | "GetState" | "playnext" | "playpayload";
		videoInfo?: {
			urlId?: string
			title?: string,
			channelTitle?: string,
			videoId?: string,
			url?: string
		}
	},
	type: Socket_Sending_type,
	url?: string,
	token?: string,
	sectionid?: string,
	msg?: String,
	userid?: string,
	queue?: Stream[]
}
export class Stream {
	id: string;
	url: string;
	upvotes: number;
	createdBy: string;
	section_name: string;
	title: string;
	channelTitle: string;
	videoId: string;
	constructor(id: string, url: string, upvotes: number, createdBy: string, section_name: string, title: string, channelTitle: string, videoId: string) {
		this.id = id;
		this.title = title;
		this.channelTitle = channelTitle;
		this.videoId = videoId;
		this.url = url;
		this.upvotes = upvotes;
		this.createdBy = createdBy;
		this.section_name = section_name;
	}
}
