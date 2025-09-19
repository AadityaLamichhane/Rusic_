import {configureStore} from "@reduxjs/toolkit"
import QueueSlice from './slice/QueueSlice'
import LoadingForStoreSlice from "./slice/WaitingForWs"
import AddLoacingSlice from "./slice/AddButtonSlice"
import PlaySlice from './slice/play'
import CurrentPlayingSlice  from "./slice/Currentplaying"
export const store = configureStore({
    reducer:{
        Queue:QueueSlice,
        LoadingWs:LoadingForStoreSlice,
        LoadingAdd:AddLoacingSlice,
        PlaySlice:PlaySlice,
        CurrentPlayingStream:CurrentPlayingSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch; 