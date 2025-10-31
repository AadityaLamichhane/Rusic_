import { createSlice } from "@reduxjs/toolkit"
import { Stream } from "@repo/types/tsType"
const initialState:Stream[] =[]; 
 const QueueSlice = createSlice({
    name:"Queuearray",
    initialState,
    reducers:{
        addQueue:(state,action)=>{
            if(state.find((currentState)=>currentState.id == action.payload.id)){
                return state; //Dont include the same string 
            }
            else if(state.length==0){

                return [action.payload] // Make the one and only item in the state 
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




