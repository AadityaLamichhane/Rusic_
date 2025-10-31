import {configureStore} from "@reduxjs/toolkit"
import QueueSlice from './slice/QueueSlice'
import LoadingForStoreSlice from "./slice/WaitingForWs"
import AddLoacingSlice from "./slice/AddButtonSlice"
import CurrentPlayingSlice from "./slice/CurrentPlayingSlice"

export const store = configureStore({
    reducer:{
        queue: QueueSlice,
        LoadingWs: LoadingForStoreSlice,
        LoadingAdd: AddLoacingSlice,
        currentPlaying: CurrentPlayingSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch; 