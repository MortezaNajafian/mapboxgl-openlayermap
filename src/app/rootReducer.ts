import {combineReducers} from "redux";
import mapReducer from "../store/mapReducer";

export const combinedReducers = combineReducers({
    map: mapReducer,
});


export default combinedReducers;
