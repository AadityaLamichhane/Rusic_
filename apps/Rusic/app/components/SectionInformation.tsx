"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { youtubeRegex } from "@repo/lib"
import { AddItemToSection } from "./section/AdditemToSection"
import { QueueSection } from "./section/QueueSection"
import { Socket_Sending, Socket_Sending_type } from "@repo/types/tsType"
import { QueueItem } from "./section/SectionType"
import { CurrentPlaying } from "./section/CurrentPlaying"
import { setCurrentPlaying } from "./store/slice/CurrentPlayingSlice";
import { useAppDispatch } from "./store/hooks"
import { addQueue } from "./store/slice/QueueSlice"
import { ChangeLoading } from "./store/slice/AddButtonSlice"
import { redirect } from "next/navigation"
export default function QueueApp({ userSocket, id, userid, isOwner }: { userSocket: WebSocket, id: string, userid: string, isOwner: boolean }) {
	let socketSendingVariable: Socket_Sending = {
		payload: {
			type: "req",
			commands: "",
			videoInfo: {}
		},
		type: Socket_Sending_type.Join_Section
	}
	const queueapplication = useAppDispatch()
	const [newItemTitle, setNewItemTitle] = useState("")
	const [youtubeId, setYoutubeId] = useState('');
	const [buttonLoading, setButtonLoading] = useState<boolean>(false);
	const videocode = useRef<string>('');
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);
	const updateOnChange = (socket: WebSocket) => {
	}
	useEffect(() => {
		if (newItemTitle == "" && youtubeId != '') {
			setYoutubeId('');
		}
		if (newItemTitle != null) {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(() => {
				if (newItemTitle.length > 8) {
					const data = {
						url: newItemTitle
					}
					const isYt = newItemTitle.match(youtubeRegex)?.[1];
					console.log(isYt);
					if (isYt && newItemTitle) {
						setYoutubeId(`http://img.youtube.com/vi/` + isYt + '/sddefault.jpg')
						videocode.current = isYt;
					}
				}
			}, 500);
		}
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		}
	}, [newItemTitle]);
	useEffect(() => {
		socketSendingVariable.sectionid = id;
		userSocket?.send(JSON.stringify(socketSendingVariable));
		const socketHandler = async (message: MessageEvent) => {
			const parsedMessage = JSON.parse(message.data);
			const CurrentTime = new Date().toLocaleTimeString();
			if (parsedMessage.payload.type == "res") {

				switch (parsedMessage.type) {
					case Socket_Sending_type.Join_Section:
						if (parsedMessage.msg == "success") {  // Call the get state when you get added to the section
							const getState = () => {
								socketSendingVariable.type = Socket_Sending_type.Stream_Man;
								socketSendingVariable.sectionid = id;
								socketSendingVariable.payload.commands = "GetState"
								userSocket.send(JSON.stringify(socketSendingVariable));
							}
							const debounceCall = (getState: () => void, delay: any) => {
								let timer;
								clearTimeout(timer);
								timer = setTimeout(() => {
									getState();
								}, delay);
							}
							debounceCall(getState, 300);
						}
						break;
					case Socket_Sending_type.Initial_Call:
						if (parsedMessage.msg === "fail" || parsedMessage.includes("failed")) { //edge case for the unsuccessful attempt for the message
							if (parsedMessage.msg.includes("UNAUTHENTICATED"))
								redirect("/signin")
						}
						break;
					case Socket_Sending_type.Stream_Man:
						if (parsedMessage.payload.commands == "GetState") {
							const queue: any[] = parsedMessage.queue;
							if (parsedMessage.currentplaying) {
								queueapplication(setCurrentPlaying(parsedMessage.currentplaying))
							}
							queue.forEach((element) => {
								const setupNewStream = {
									id: element.videoId,
									title: element.title,
									upvotes: element.upvotes,
									addedAt: "",
									url: element.url
								}
								queue
								queueapplication(addQueue(setupNewStream));

								queueapplication(ChangeLoading(true));
							})
						}
						break;
					case Socket_Sending_type.Create_Section:
						console.log("responce come from the create section")
						break;
					case Socket_Sending_type.Create_Stream:
						if (parsedMessage.payload.commands == "addQueue") {
							const newStream = {
								id: parsedMessage.payload.videoInfo.videoId,
								title: parsedMessage.payload.videoInfo.title,
								upvotes: 0,
								addedAt: CurrentTime,
								url: parsedMessage.payload.videoInfo.url
							};
							console.log("While adding to the queue the type that is being obtained is ", JSON.stringify(parsedMessage.type));
							setYoutubeId('');
							setNewItemTitle('');
							queueapplication(addQueue(newStream));
						}

						break;


				}
			}
		}
		userSocket.addEventListener('message', socketHandler);
		return () => {
			userSocket.removeEventListener('message', socketHandler);
		}
	}, []);
	const shareQueue = async () => {
		try {
			await navigator.share({
				title: "Queue App",
				text: "Check out this awesome queue app!",
				url: window.location.href,
			})
		} catch (error) {
			await navigator.clipboard.writeText(window.location.href)
		}
	}
	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Queue App</h1>
					<Button onClick={shareQueue} variant="outline" size="sm">
						<Share2 className="w-4 h-4 mr-2" />
						Share
					</Button>
				</div>
				<div className="grid wrap-normal grid-cols-2 gap-8">
					{/* Now Playing Section */}
					{/* Add Item Section */}
					<div className="flex flex-col gap-8">
						<CurrentPlaying isOwner={isOwner}></CurrentPlaying>
						<AddItemToSection newItemTitle={newItemTitle} SetButtonLoading={setButtonLoading} setNewItemTitle={setNewItemTitle} userSocket={userSocket} id={id} userid={userid} urlId={videocode.current} buttonLoading={buttonLoading}>
						</AddItemToSection>
					</div>
					<div className="flex flex-col gap-8 ">
						{/* Queue Section */}
						<QueueSection userSocket={userSocket} sectionId={id} userId={userid}></QueueSection>
						<div className="flex drop-shadow-sm group  ">
							{youtubeId != "" ? <>
								<div className="flex justify-center items-center w-full rounded-xl overflow-clip group-hover:scale-105 transition-all duration-200 ease-in-out  ">
									<div className="mask-b-from-black-300 ">
									</div>
									<div className="absolute text-zinc-100 font-black opacity-0 group-hover:opacity-100 text-3xl">Adding</div>
									<img src={youtubeId} alt="" className="w-full h-fit" />
								</div>
							</> : <></>}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
