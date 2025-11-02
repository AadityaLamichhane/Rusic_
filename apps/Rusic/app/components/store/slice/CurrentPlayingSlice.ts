import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Stream } from "@repo/types/tsType";
// Wrapper to satisfy RTK's type requirements
type CurrentPlayingState = { stream: Stream | null };
const initialState: CurrentPlayingState = { stream: null };
const CurrentPlayingSlice = createSlice({
	name: "currentPlaying",
	initialState,
	reducers: {
		// Set current playing stream (payload from backend or queue)
		setCurrentPayload: (state, action: PayloadAction<Stream>) => {
			state.stream = action.payload;
		},
		// Clear current playing
		clearCurrentPlaying: (state) => {
			state.stream = null;
		},
	},
});
export default CurrentPlayingSlice.reducer;
export const { setCurrentPayload, clearCurrentPlaying } = CurrentPlayingSlice.actions;
// Thunk: set current playing from a stream item
// Usage: dispatch(setCurrentPlaying(streamItem))
export const setCurrentPlaying = (stream: Stream) => (dispatch: any) => {
	const result = dispatch(setCurrentPayload(stream));
	return stream;
};
// Thunk: play next item from queue (reads queue from state and sets first item)
// Usage: dispatch(playNext())
export const playNext = () => (dispatch: any, getState: any) => {
	const state = getState();
	const queue: Stream[] = state.queue || [];
	if (queue.length === 0) {
		dispatch(clearCurrentPlaying());
		return null;
	}
	const nextStream = queue[0];
	if (!nextStream) {
		dispatch(clearCurrentPlaying());
		return null;
	}
	dispatch(setCurrentPayload(nextStream));
	return nextStream;
};
// Selector: get current playing stream
export const selectCurrentPlaying = (state: any): Stream | null => {
	return state.currentPlaying?.stream ?? null;
};
