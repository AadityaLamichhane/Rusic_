"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, Play, Share2, Plus } from "lucide-react"
import { youtubeRegex } from "@repo/lib"
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import axios from "axios"
interface QueueItem {
  id: string
  title: string
  upvotes: number
  addedAt: Date
}

export default function QueueApp({userSocket}:{userSocket:WebSocket}) {
  const [currentPlaying, setCurrentPlaying] = useState<QueueItem | null>(null)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [youtubeId,setYoutubeId ]= useState('');
  const debounceTimer = useRef<NodeJS.Timeout| null>(null);
  console.log(newItemTitle);
  // Section to check for the youtube thumbnail and validation
  useEffect(()=>{
    if(newItemTitle!=null){
      if(debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current =  setTimeout(()=>{
        if(newItemTitle.length>8){
          const data = {
            url:newItemTitle
          }
        const isYt = newItemTitle.match(youtubeRegex)?.[1];
        console.log(isYt);
        (isYt && newItemTitle)? setYoutubeId(`http://img.youtube.com/vi/`+isYt+'/mqdefault.jpg'):console.log("Nothing");
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
      
            {youtubeId!=""?<>
            
              <div>
                <img src={youtubeId} alt="" />
              </div>
            </>:<></>}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Queue App</h1>
          <Button onClick={shareQueue} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Now Playing Section */}
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

        {/* Add Item Section */}
        <AddItemToSection newItemTitle = {newItemTitle} setNewItemTitle = {setNewItemTitle} >
        </AddItemToSection>
        {/* Queue Section */}
        <QueueSection socket={socket} setCurrentPlaying={setCurrentPlaying}></QueueSection>
      </div>
    </div>
  )
}

const AddItemToSection = ({newItemTitle , setNewItemTitle }:any)=>{
  const addItem = () => {
    if (!newItemTitle.trim()) return
    const newItem: QueueItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      upvotes: 0,
      addedAt: new Date(),
    }
  }
  return( <>
        <Card>
          <CardHeader>
            <CardTitle>Add to Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter item title..."
                value={newItemTitle}
                onChange={(e) => {
                  // have the logic to debounce the input of the User 
                  setNewItemTitle(e.target.value)}}
                className="flex-1"
              />
              <Button onClick={addItem} disabled={!newItemTitle.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

  </>)
}


export function QueueSection({socket,setCurrentPlaying}:{socket:WebSocket,setCurrentPlaying:any}){
// queue.lengh
// sorted Queu
// playNext
// Upvote Item
  const [queue, setQueue] = useState<QueueItem[]>([])
  const upvoteItem = (id: string) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)))
  }
  const sortedQueue = [...queue].sort((a, b) => b.upvotes - a.upvotes)
  const playNext = () => {
    if (sortedQueue.length === 0) return

    const nextItem = sortedQueue[0];
    if(nextItem!=null){
    setCurrentPlaying(nextItem)
    setQueue((prev) => prev.filter((item) => item.id !== nextItem.id))
    }else{
        console.log('unexpected error');
        return <></>; 
    }
  }
return <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Queue ({queue.length} items)</CardTitle>
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
                <p>Queue is empty</p>
                <p className="text-sm">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedQueue.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">Added {item.addedAt.toLocaleTimeString()}</p>
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