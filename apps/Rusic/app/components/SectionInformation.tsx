"use client"
import { useEffect,  useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {  Share2 } from "lucide-react"
import { youtubeRegex } from "@repo/lib"
import { AddItemToSection } from "./section/AdditemToSection"
import { QueueSection } from "./section/QueueSection"
import { Socket_Sending, Socket_Sending_type } from "@repo/lib/socketContext"
import { QueueItem } from "./section/SectionType"
import { CurrentPlaying } from "./section/CurrentPlaying"
import { useDispatch } from "react-redux"
import { useAppDispatch } from "./store/hooks"
import { addQueue } from "./store/slice/QueueSlice"
const socketSendingVariable:Socket_Sending = {
  payload:{
    type:"req",
    commands:"",
    videoinfo:{}
  },
    type:Socket_Sending_type.Join_Section
}
export default function QueueApp({userSocket,id,userid,isOwner}:{userSocket:WebSocket,id:string,userid:string,isOwner:boolean}) {
  const [currentPlaying, setCurrentPlaying] = useState<QueueItem | null>(null);
  /**
   If No one is playing any song on queue get the top and play 
   pseudo code if(currentPlaying==null && Quuee.length >0 ){
    //  Play the Front of qeueue 
    // Have one variable storing the current timeline and on the Diff of Total video length and te timeline <= 0 then PlayNext is Triggered
    // In  the play next get the top of the queue and then push it to the playing component (if Streamer Play the embedded video Automatically and if Not just show them the thumnaoil with playing Emoji on thi s
    // Have the socket operation on the queue Implementation
    // if i were to use redux ( Store , Actions (do what ---> Add music == Store .push music Information , On Click the button get the Input value -> store and then Get Access to it using the socket and then Wala, onNext->Update the current playing player to the top of the Quee), Slice(Addmusic , MaintainQueue , GettheInputString* , PlayNext , Delete  )  )
   }
   */ 
const queueapplication = useAppDispatch()
  const [newItemTitle, setNewItemTitle] = useState("")
  const [youtubeId,setYoutubeId ]= useState('');
  const [buttonLoading , setButtonLoading] = useState<boolean>(false);
  const [queue,setQueue]= useState<QueueItem[]>([]);
  console.log(queue);
  const videocode = useRef<string>('');
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
          if(isYt && newItemTitle){
          setYoutubeId(`http://img.youtube.com/vi/`+isYt+'/sddefault.jpg')
          videocode.current = isYt;
          }
        }
        },500);
        }
        return ()=>{
          if(debounceTimer.current){
            clearTimeout(debounceTimer.current);
          }
        }
    },[newItemTitle]);
    // Ws Application
  useEffect(()=>{
      socketSendingVariable.sectionid = id;
      userSocket?.send(JSON.stringify(socketSendingVariable));
      const socketHandler = async(message:MessageEvent)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message.data);
        const CurrentTime = new Date().toLocaleTimeString()
        if(parsedMessage.payload.type=="res"){
              if(parsedMessage.payload.commands=="addQueue"){
                    const newStream = {
                      id: parsedMessage.payload.videoInfo.videoId,
                      title: parsedMessage.payload.videoInfo.title,
                      upvotes:0,
                      addedAt:CurrentTime,
                      url:parsedMessage.payload.videoInfo.url
                    };
                setYoutubeId('')
                setNewItemTitle('')
                queueapplication(addQueue(newStream));
                setQueue((prevQueue)=>{
                setButtonLoading(false);
                  if(prevQueue.length==0){
                    return [newStream]
                  }else{
                    if(prevQueue.find((pastQueue)=>newStream.id==pastQueue.id)){
                     return prevQueue 
                    }
                    return [...prevQueue,newStream]
                  }
      
                })
              
                console.log(parsedMessage.url)
              }
        }
      }
      userSocket.addEventListener('message',socketHandler);
  },[]);
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
        <CurrentPlaying currentPlaying={currentPlaying} isOwner={isOwner}></CurrentPlaying>
        <AddItemToSection newItemTitle = {newItemTitle} SetButtonLoading={setButtonLoading} setNewItemTitle = {setNewItemTitle} userSocket={userSocket} id={id} userid={userid} urlId={videocode.current}  buttonLoading={buttonLoading}>
        </AddItemToSection>
        </div>
        <div className="flex flex-col gap-8 ">
        {/* Queue Section */}
        <QueueSection userSocket={userSocket} setCurrentPlaying={setCurrentPlaying} queue={queue} setQueue={setQueue}></QueueSection>
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



