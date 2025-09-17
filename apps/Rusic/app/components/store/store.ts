import {configureStore} from "@reduxjs/toolkit"
import QueueSlice from './slice/QueueSlice'
import LoadingForStoreSlice from "./slice/WaitingForWs"
import AddLoacingSlice from "./slice/AddButtonSlice"
export const store = configureStore({
    reducer:{
        Queue:QueueSlice,
        LoadingWs:LoadingForStoreSlice,
        LoadingAdd:AddLoacingSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch; 