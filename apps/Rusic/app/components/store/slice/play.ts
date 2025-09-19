import { createSlice } from "@reduxjs/toolkit";
const initialState = false ; 
const playSlice = createSlice({
    name:"playSlice",
    initialState:initialState, 
    reducers:{
        isPlaying :(state,action)=>{
            if(action.payload=="play"){
             return true ; 
            }else{
                return false ; 
            }
        }
    }
    }
)
 
export default playSlice.reducer;
export const {isPlaying}  = playSlice.actions;


