import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { QueueItem } from "./SectionType"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { Play } from "lucide-react"
import YoutubePlayer from "youtube-player";
import { isPlaying } from "../store/slice/play";
import { useRef,useEffect } from "react";
import { Stream } from "@repo/types/tsType";
export const CurrentPlaying = ({  isOwner }: {  isOwner: boolean }) => {
    const AppDispatch = useAppDispatch();
    const isPlayingBoolean = useAppSelector((state)=>state.PlaySlice);

    if(isPlayingBoolean){
        console.log("The video is Playing");
    }else{
        console.log("The video is paused");
    }
    const currentPlayingstream = useAppSelector((state) => state.CurrentPlayingStream) as Stream | null;
    const video_Element_context = useRef(null);
    if(currentPlayingstream!=null){
    }
    useEffect(() => {
    if (currentPlayingstream && video_Element_context.current) {
        console.log("The current playing id is ",JSON.stringify(currentPlayingstream));
        let videoplayer = YoutubePlayer(video_Element_context.current, {
        videoId: currentPlayingstream?.id
        });
        videoplayer.playVideo().then(()=>{
            videoplayer.on("stateChange",(event)=>{
                if(event.data==2){
                    console.log("This is the state of the pause Video");
                    AppDispatch(isPlaying("pause"));
                }
                if(event.data==1){
                    console.log("This is the Playing data ");
                    AppDispatch(isPlaying("play"));
                }
            })
        })
        // Add other player logic here
    }
}, [currentPlayingstream, video_Element_context.current]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Now Playing   {`Paused:${isPlayingBoolean}`}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {currentPlayingstream ? (
                    <div className="flex items-center justify-between w-full">
                        <div className="w-full">
                            <div className="w-full bg-amber-900">
                                {!isOwner ? (
                              <div id="video-player" ref={video_Element_context} className="w-full h-[300px]">
                              </div>
                                // 
                                ) : (
                                    <img 
                                        src={`https://img.youtube.com/vi/${currentPlayingstream?.id}/sddefault.jpg`} 
                                        alt={currentPlayingstream.title||""}
                                        className="w-full" 
                                    />
                                )}
                            </div>
                            <h3 className="text-md font-semibold">{currentPlayingstream?.title ||"Title"}</h3>
                            <p className="text-xs text-muted-foreground">Final score: {currentPlayingstream?.upvotes} upvotes</p>
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