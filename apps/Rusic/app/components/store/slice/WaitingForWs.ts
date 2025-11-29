import { createSlice } from "@reduxjs/toolkit";
const waitingForwsSlice = createSlice({
	name: "waitingforws",
	initialState: false,
	reducers: {
		change: (state) => !state
	}
})
export default waitingForwsSlice.reducer;
export const { change } = waitingForwsSlice.actions;
