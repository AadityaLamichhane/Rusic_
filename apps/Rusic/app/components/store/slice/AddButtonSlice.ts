import { createSlice } from "@reduxjs/toolkit"
const initialState = false ; 
 const AddLoadingSlice = createSlice({
    name:"AddLoading",
    initialState,
    reducers:{
        ChangeLoading:(state,action)=>{
            return !state ; 
}}})

export default AddLoadingSlice.reducer;
export const { ChangeLoading }  = AddLoadingSlice.actions;
