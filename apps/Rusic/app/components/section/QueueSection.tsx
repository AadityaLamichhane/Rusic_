import { Button } from "@/components/ui/button"
import { ObservserType } from "../SectionInformation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, ChevronUp, Play } from "lucide-react"
import { useEffect, useState } from "react"
import { QueueItem } from "./SectionType"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setCurrentPlaying, selectCurrentPlaying } from "../store/slice/CurrentPlayingSlice"
import { Stream } from "@repo/types/tsType"
import { removefromQueue } from "../store/slice/QueueSlice"

export function QueueSection({ userSocket, sectionId, userId, setObserver }: { userSocket: WebSocket, sectionId: string, userId: string, setObserver: (content: any) => void }) {
	const [message, setMessage] = useState('');
	const dispatch = useAppDispatch();
	const currentPlaying = useAppSelector(selectCurrentPlaying);
	const upvoteItem = (id: string) => {
	}

	//   To decide what to play next we need to make the request from the frontend but we will have the data and the order collected from the backend
	const QueueSelector = useAppSelector((state) => state.queue);
	const sortedQueue = [...QueueSelector].sort((a, b) => b.upvotes - a.upvotes)
	const playNext = () => {
		if (sortedQueue.length === 0) {
			console.log('Queue is empty');
			return;
		}
		const nextItem = sortedQueue[0];
		if (!nextItem) {
			console.log('No valid next item');
			return;
		}
		// Convert queue item to Stream object with all required fields
		const streamItem: Stream = {
			id: nextItem.id,
			url: nextItem.url,
			upvotes: nextItem.upvotes || 0,
			createdBy: userId,
			section_name: sectionId,
			title: nextItem.title,
			channelTitle: '', // Not available in queue item, set empty or add to queue type
			videoId: nextItem.id
		};
		// Dispatch the thunk to set current playing
		dispatch(setCurrentPlaying(streamItem));
		setObserver((getState: ObservserType) => { return { ...getState, LoadPlayNext: true } }); // Trigger the observer to observe for the get state queue
		// Remove from queue - must pass object with id property
		dispatch(removefromQueue({ id: nextItem.id }));

		console.log('AFTER DISPATCH - Item should be removed from queue');
	}	// Auto-play: if nothing is playing and queue has items, play the first one
	useEffect(() => {
		if (!currentPlaying && sortedQueue.length > 0) {
			console.log('Auto-playing first item in queue');
			playNext();
		}
	}, [currentPlaying, sortedQueue.length]);

	return <>
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Queue ({QueueSelector.length} items)</CardTitle>
				{sortedQueue.length > 0 && (
					<Button onClick={playNext} size="sm">
						<Play className="w-4 h-4 mr-2" />
						Play Next
					</Button>
				)}
			</CardHeader>
			<CardContent>
				{sortedQueue.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<div className="w-12 h-12 mx-auto mb-2 opacity-50 bg-muted rounded-lg flex items-center justify-center">
							<ChevronUp className="w-6 h-6" />
						</div>
						<p>Queue is empty {message}</p>
						<p className="text-sm">Add some items to get started!</p>
					</div>
				) : (
					<div className="space-y-3">
						{QueueSelector.map((item, index) => (
							<div
								key={index}

								className="relative flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-3">
									{/* //@ts-ignore */}
									<img src={'http://img.youtube.com/vi/' + item.id + "/sddefault.jpg"} alt="" className="w-24" />
									<div>
										<h4 className="font-medium">{item.title}</h4>
										{/* <p className="text-sm text-muted-foreground">Added {item.addedAt}</p> */}
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">{item.upvotes}</span>
									<Button size="sm" variant="outline" onClick={() => upvoteItem(item.id)}>
										<ChevronUp className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>

	</>
}
