import { createSlice } from "@reduxjs/toolkit";
import { Stream } from "@repo/types/tsType";
const initializer:Stream|null=null; 
const currentPlayingSlice =createSlice({
        name:"currentplayingSlice",
        initialState:initializer,
        reducers:{
            setCurrentPlaying:(state,action)=>{
                            return action.payload ;
            }
        }
    })
export default currentPlayingSlice.reducer;
export const {setCurrentPlaying}  = currentPlayingSlice.actions;