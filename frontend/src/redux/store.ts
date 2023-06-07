import { configureStore } from "@reduxjs/toolkit";
import listenerMiddleware from "./listeners";
import authSlice from "./slices/auth";
import calcAppSlice from "./slices/calculatorApp";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calcApp: calcAppSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //    Ignore these action types
        ignoredActions: [
          "user/update/fulfilled",
          "user/update/pending",
          "user/update/rejected",
        ],
        //    Ignore these field paths in all actions
        ignoredActionPaths: [],
        //    Ignore these paths in the state
        ignoredPaths: [""],
      },
    }).prepend(listenerMiddleware.middleware),
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
