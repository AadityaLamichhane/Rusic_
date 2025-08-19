import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { QueueItem } from "./SectionType"
import { Socket_Sending ,Socket_Sending_type } from "@repo/lib/socketContext"
let socketVariable :Socket_Sending = {
    type:Socket_Sending_type.Create_Stream,

}
export const AddItemToSection = ({newItemTitle , setNewItemTitle ,userSocket,id}:{newItemTitle:string , setNewItemTitle:(params:string)=>void ,userSocket:WebSocket,id:string})=>{
// when clicked you can have the loader while having to feth the api 
  const addItem = () => {
    //   @ts-ignore
    console.log(`this is id ${id}`);
    socketVariable ={...socketVariable,url:newItemTitle}
    userSocket.send(JSON.stringify(socketVariable));

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
                placeholder="Enter link..."
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