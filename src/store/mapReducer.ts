import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import MapNameEnum from "../enums/MapNameEnum";
import defaultPosition, {IDefaultPosition} from "../constants/defaultPosition";

export interface ICoords {
    uid?: string | number,
    coords: number[][]
}


export interface MapState {
    lng: number,
    lat: number,
    zoom: number,
    currentMapName: MapNameEnum,
    openLayerCoordinates: ICoords[],
    mapboxCoordinates: number[][]
}

export type MapPosition = Omit<IDefaultPosition, 'zoom'>;

const initialState: MapState = {
    ...defaultPosition,
    currentMapName: MapNameEnum.NONE,
    openLayerCoordinates: [],
    mapboxCoordinates: []
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
        updateCurrentMapAction: (state, action: PayloadAction<MapNameEnum>) => {
            state.currentMapName = action.payload
        },
        updateOpenLayerCoordinatesAction: (state, action: PayloadAction<ICoords>) => {
            state.openLayerCoordinates.push(action.payload)
        },
        updateMapBoxCoordinatesAction: (state, action: PayloadAction<number[][]>) => {
            state.mapboxCoordinates = action.payload
        },
        removeOpenLayerCoordinateByUidAction: (state, action: PayloadAction<string>) => {
            const findEl = state.openLayerCoordinates.findIndex(item => item.uid === action.payload)
            if (findEl >= 0)
                state.openLayerCoordinates.splice(findEl, 1)
        },
        clearMapBoxCoordinatesAction: (state) => {
            state.mapboxCoordinates = []
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    updatePositionAction,
    updateCurrentMapAction,
    updateZoomAction,
    updateOpenLayerCoordinatesAction,
    removeOpenLayerCoordinateByUidAction,
    updateMapBoxCoordinatesAction,
    clearMapBoxCoordinatesAction
} = mapSlice.actions

export default mapSlice.reducer