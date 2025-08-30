import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, ChevronUp,Play } from "lucide-react"
import { useEffect, useState } from "react"
import { QueueItem } from "./SectionType"
import { useAppSelector } from "../store/hooks"
export function QueueSection({userSocket,setCurrentPlaying}:{userSocket:WebSocket,setCurrentPlaying:any}){
// queue.lengh
// sorted Queu
// playNext
// Upvote Item
const [message , setMessage] = useState('');
  const upvoteItem = (id: string) => {
  }
//   To decide what to play next we need to make the request from the frontend but we will have the data and the order collected from the backend
const QueueSelector = useAppSelector((state)=>state.Queue);
  const sortedQueue = [...QueueSelector].sort((a, b) => b.upvotes - a.upvotes)
  const playNext = () => {
    if (sortedQueue.length === 0) return

    const nextItem = sortedQueue[0];
    if(nextItem!=null){
    setCurrentPlaying(nextItem);
    }else{
        console.log('unexpected error');
        return <></>; 
    }
  }
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
                      <img src={'http://img.youtube.com/vi/'+item.id+"/sddefault.jpg"} alt="" className="w-24" />
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">Added {item.addedAt}</p>
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