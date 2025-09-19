import { createSlice } from "@reduxjs/toolkit"
const initialState:{
    duration:number
    id:string;
    url:string ;
    upvotes: number ;
    createdBy :string ;
    section_name:string; 
    title:string ;
    channelTitle:string;
    videoId:string ;
    upvotedBy:string[] ;
}[] =[]; 
 const QueueSlice = createSlice({
    name:"Queuearray",
    initialState,
    reducers:{
        addQueue:(state,action)=>{
            if(state.find((currentState)=>currentState.id == action.payload.id)){
                // This was created so dont add another with the same id 
                return state;
            }
            else if(state.length==0){
                return [action.payload]
            }
            else{
                return [...state,action.payload ];
            }
            }
    ,
        removefromQueue:(state,action)=>{
            return state.filter((item)=> item.id !== action.payload.id)
        },
        upvoteQueue:(state,action)=>{
            if(state.find((currentData)=>currentData.id===action.payload.id) ){
                switch(action.payload.type){
                     case "upvote":
                      const updatedMap =  state.map((currentQueue)=>{
                        if(currentQueue.id==action.payload.id){
                            if(currentQueue.upvotedBy.includes(action.payload.userid)){
                                    return currentQueue ;
                            }
                        }
                            return {
                                duration:currentQueue.duration,
                                upvotes: (currentQueue.id==action.payload.id)? currentQueue.upvotes+1:currentQueue.upvotes,
                                title:currentQueue.title,
                                url:currentQueue.url,
                                id:currentQueue.id,
                                createdBy :currentQueue.createdBy,
                                section_name:currentQueue.section_name, 
                                channelTitle:currentQueue.channelTitle,
                                videoId:currentQueue.videoId,
                                upvotedBy: [...currentQueue.upvotedBy, action.payload.userid]
                            }
                        })
                        return updatedMap;
                        case "downvote":
                        const updatedMapdownvoted =  state.map((currentQueue)=>{

                                return {
                                    duration:currentQueue.duration,
                                    upvotes: (currentQueue.id==action.payload.id)? 0:currentQueue.upvotes,
                                    title:currentQueue.url,
                                    url:currentQueue.url,
                                    id:currentQueue.id,
                                    createdBy :currentQueue.createdBy,
                                    section_name:currentQueue.section_name, 
                                    channelTitle:currentQueue.channelTitle,
                                    videoId:currentQueue.videoId,
                                    upvotedBy:currentQueue.upvotedBy.filter((useridstring)=>useridstring!=action.payload.id)

                                }
                            })
                            return updatedMapdownvoted;
                }
                return state ; 
                      
            }
        }
    }

})

export default QueueSlice.reducer;
export const {addQueue,removefromQueue,upvoteQueue}  = QueueSlice.actions;




