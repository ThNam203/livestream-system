import { Channel } from "@/entities/channel";
import { User } from "@/entities/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null as Channel | null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannel(state, action: PayloadAction<Channel>) {
      state.value = action.payload;
    },
    updateStreamKey(state, action: PayloadAction<string>) {
      if (state.value) state.value.streamKey = action.payload;
    },
  },
});

export const { setChannel, updateStreamKey } = channelSlice.actions;
export default channelSlice.reducer;
