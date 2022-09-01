import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import defaultPosition, {IDefaultPosition} from "../constants/defaultPosition";

export interface ICoords {
    uid?: string | number,
    coords: number[][]
}


export interface MapState {
    lng: number,
    lat: number,
    zoom: number,
    rotate: number,
}

export type MapPosition = Omit<IDefaultPosition, 'zoom' | 'rotate'>;

const initialState: MapState = {
    ...defaultPosition,
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        updatePositionAction: (state, action: PayloadAction<MapPosition>) => {
            state.lat = +action.payload.lat
            state.lng = +action.payload.lng
        },
        updateZoomAction: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload
        },
        updateRotateAction: (state, action: PayloadAction<number>) => {
            state.rotate = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    updatePositionAction,
    updateZoomAction,
    updateRotateAction
} = mapSlice.actions

export default mapSlice.reducer