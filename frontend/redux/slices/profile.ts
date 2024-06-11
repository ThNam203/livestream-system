import { User } from "@/entities/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null as User | null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    updateStreamKey(state, action: PayloadAction<string>) {
      state.user!.channel.streamKey = action.payload;
    },
  },
});

export const { setProfile, updateStreamKey } = profileSlice.actions;
export default profileSlice.reducer;
