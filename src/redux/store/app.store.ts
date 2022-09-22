import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userDataReducer from "../Slices/UserDataSlice";
import redirectReducer from "../Slices/RedirectSlice";
import appDatasReducer from "../Slices/AppDatasSlice";


const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})
export const store = configureStore({
  reducer: {
    user: userDataReducer,
    redirect: redirectReducer,
    appDatas: appDatasReducer
  },
  middleware: customizedMiddleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
