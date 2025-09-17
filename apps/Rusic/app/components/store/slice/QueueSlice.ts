import { createSlice } from "@reduxjs/toolkit"
import { QueueItem } from "../../section/SectionType"
import { Stream } from "@repo/types/tsType"
const initialState:Stream[] =[]; 
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
        }
    }

})

export default QueueSlice.reducer;
export const {addQueue,removefromQueue}  = QueueSlice.actions;




