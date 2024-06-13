import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import profileReducer from "./slices/profile";
import channelReducer from "./slices/channel";
import { channel } from "diagnostics_channel";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    channel: channelReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
