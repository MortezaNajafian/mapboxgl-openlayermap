import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppDispatch = () => useDispatch<ThunkAppDispatch>();
