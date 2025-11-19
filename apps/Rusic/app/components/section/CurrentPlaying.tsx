import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"
import { QueueItem } from "./SectionType"
import { useAppSelector } from "../store/hooks"
import { selectCurrentPlaying } from "../store/slice/CurrentPlayingSlice"

export const CurrentPlaying = ({ isOwner }: { isOwner: boolean }) => {
	// Read current playing from Redux store
	const currentPlaying = useAppSelector(selectCurrentPlaying);
	isOwner ? console.log("This i sthe owner ") : console.log("This is not the owner")
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Play className="w-5 h-5" />
					Now Playing
				</CardTitle>
			</CardHeader>
			<CardContent>
				{currentPlaying ? (
					<div className="flex items-center justify-between w-full">
						<div className="w-full">
							<div className="w-full bg-amber-900">
								{isOwner ? (
									<iframe
										loading="lazy"
										className="w-full h-[300px]"
										style={{ border: 'none', outline: 'none' }}
										src={`https://www.youtube.com/embed/${currentPlaying.id}?modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&autoplay=1`}
										allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen={true}
										title={currentPlaying.title}
									/>
								) : (
									<img
										src={`https://img.youtube.com/vi/${currentPlaying.id}/sddefault.jpg`}
										alt={currentPlaying.title}
										className="w-full"
									/>
								)}
							</div>
							<h3 className="text-md font-semibold">{currentPlaying.title}</h3>
							<p className="text-xs text-muted-foreground">Final score: {currentPlaying.upvotes} upvotes</p>
						</div>
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>Nothing playing yet</p>
						<p className="text-sm">Add items to the queue and play the next one!</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
