"use client"

import { useEffect,  useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, Play, Share2, Plus, Loader } from "lucide-react"
import { youtubeRegex } from "@repo/lib"
import { AddItemToSection } from "./section/AdditemToSection"
import { QueueSection } from "./section/QueueSection"
import { Socket_Sending, Socket_Sending_type } from "@repo/lib/socketContext"
interface QueueItem {
  id: string
  title: string
  upvotes: number
  addedAt: Date
}
const socketSendingVariable:Socket_Sending={type:Socket_Sending_type.Join_Section};
export default function QueueApp({userSocket,id}:{userSocket:WebSocket,id:string}) {
  useEffect(()=>{
      socketSendingVariable.sectionId = id;
      userSocket?.send(JSON.stringify(socketSendingVariable));
  },[])
      // if(socket){
        // @ts-ignore
      // }
  const [currentPlaying, setCurrentPlaying] = useState<QueueItem | null>(null)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [youtubeId,setYoutubeId ]= useState('');

  const debounceTimer = useRef<NodeJS.Timeout| null>(null);
    useEffect(()=>{
      if(newItemTitle=="" && youtubeId!=''){
        setYoutubeId('');
      }
      if(newItemTitle!=null){
        if(debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current =  setTimeout(()=>{
          if(newItemTitle.length>8){
            const data = {
              url:newItemTitle
            }
          const isYt = newItemTitle.match(youtubeRegex)?.[1];
          console.log(isYt);
          (isYt && newItemTitle)? setYoutubeId(`http://img.youtube.com/vi/`+isYt+'/sddefault.jpg'):console.log("Nothing");
        }
        },500);
        }
        return ()=>{
          if(debounceTimer.current){
            clearTimeout(debounceTimer.current);
          }
        }
    },[newItemTitle])
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPlaying ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentPlaying.title}</h3>
                  <p className="text-sm text-muted-foreground">Final score: {currentPlaying.upvotes} upvotes</p>
                </div>
                <Badge variant="secondary">Playing</Badge>
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
        <AddItemToSection newItemTitle = {newItemTitle} setNewItemTitle = {setNewItemTitle} userSocket={userSocket} id={id}>
        </AddItemToSection>
        </div>
        <div className="flex flex-col gap-8 ">
        {/* Queue Section */}
        {/* @ts-ignore */}
        <QueueSection usersocket={userSocket} setCurrentPlaying={setCurrentPlaying}></QueueSection>
        <div className="flex drop-shadow-sm group  ">
          {youtubeId!=""?<>
              <div className="flex justify-center items-center w-full rounded-xl overflow-clip group-hover:scale-105 transition-all duration-200 ease-in-out  ">
                <div className="mask-b-from-black-300 ">

                </div>
                <div className="absolute text-zinc-100 font-black opacity-0 group-hover:opacity-100 text-3xl">Adding</div>
                <img src={youtubeId} alt="" className="w-full h-fit" />
              </div>
            </>:<></>}
        </div>
        </div>
        </div>
      </div>
    </div>
  )

    }



