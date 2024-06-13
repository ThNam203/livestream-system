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
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
