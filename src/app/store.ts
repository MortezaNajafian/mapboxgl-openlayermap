import {configureStore} from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import combinedReducers from "./rootReducer";

export const store = configureStore({
    reducer: combinedReducers,
    middleware: [thunkMiddleware],
    devTools: process.env.NODE_ENV !== "production",
});


export type RootState = ReturnType<typeof combinedReducers>;
