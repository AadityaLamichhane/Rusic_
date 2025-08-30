import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { QueueItem } from "./SectionType"
import { Socket_Sending ,Socket_Sending_type } from "@repo/lib/socketContext"
let socketVariable :Socket_Sending = {
  payload:{
    type:"req",
    commands:""
  },
    type:Socket_Sending_type.Create_Stream,
    url:""
}
export  function AddItemToSection  ({newItemTitle , setNewItemTitle ,userSocket,id,userid,urlId,SetButtonLoading,buttonLoading}:{newItemTitle:string , setNewItemTitle:(params:string)=>void ,userSocket:WebSocket,id:string,userid:string,urlId:string,SetButtonLoading:(varriable:boolean)=>void,buttonLoading:boolean}){
// when clicked you can have the loader while having to feth the api 
  const addItem =() => {
    //   @ts-ignore
    socketVariable ={...socketVariable,url:newItemTitle,sectionid:id,userid:userid,urlid:urlId}
    userSocket.send(JSON.stringify(socketVariable));
    if (!newItemTitle.trim()) return
    const newItem: QueueItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      upvotes: 0,
      addedAt:  new Date().toLocaleTimeString(),
      url:""
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
                placeholder="Enter link..."
                value={newItemTitle}
                onChange={(e) => {
                  // have the logic to debounce the input of the User 
                  setNewItemTitle(e.target.value)}}
                className="flex-1"
              />
              <Button onClick={()=>{
                addItem();
                SetButtonLoading(true);
                }} >
                <Plus className="w-4 h-4 mr-2" />
                Add 
              </Button>
            </div>
          </CardContent>
        </Card>

  </>)
}