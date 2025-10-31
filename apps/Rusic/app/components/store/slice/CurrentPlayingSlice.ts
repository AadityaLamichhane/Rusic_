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
      console.log('REDUCER: setCurrentPayload called with:', action.payload);
      console.log('REDUCER: Previous state:', state.stream);
      state.stream = action.payload;
      console.log('REDUCER: New state:', state.stream);
    },
    // Clear current playing
    clearCurrentPlaying: (state) => {
      console.log('REDUCER: clearCurrentPlaying called');
      state.stream = null;
    },
  },
});

export default CurrentPlayingSlice.reducer;
export const { setCurrentPayload, clearCurrentPlaying } = CurrentPlayingSlice.actions;

// Thunk: set current playing from a stream item
// Usage: dispatch(setCurrentPlaying(streamItem))
export const setCurrentPlaying = (stream: Stream) => (dispatch: any) => {
  console.log('THUNK: setCurrentPlaying called with:', stream);
  const result = dispatch(setCurrentPayload(stream));
  console.log('THUNK: Dispatched setCurrentPayload, result:', result);
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
