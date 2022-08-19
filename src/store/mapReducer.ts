import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import MapNameEnum from "../enums/MapNameEnum";

export interface ICoords {
    uid: string | number,
    coords: number[][]
}


export interface MapState {
    lng: number,
    lat: number,
    zoom: number,
    currentMapName: MapNameEnum,
    openLayerCoordinates: ICoords[],
    mapboxCoordinates: ICoords[]
}

export type MapPosition = Omit<MapState, 'currentMapName' | 'zoom' | 'openLayerCoordinates' | 'mapboxCoordinates'>;

const initialState: MapState = {
    lng: 20.56934502726,
    lat: -22.35,
    zoom: 4,
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
        updateMapBoxCoordinatesAction: (state, action: PayloadAction<ICoords>) => {
            state.mapboxCoordinates.push(action.payload)
        },
        removeOpenLayerCoordinateByUidAction: (state, action: PayloadAction<string>) => {
            const findEl = state.openLayerCoordinates.findIndex(item => item.uid === action.payload)
            if (findEl >= 0)
                state.openLayerCoordinates.splice(findEl, 1)
        },
        removeMapBoxCoordinateByUidAction: (state, action: PayloadAction<string>) => {
            const findEl = state.openLayerCoordinates.findIndex(item => item.uid === action.payload)
            if (findEl >= 0)
                state.mapboxCoordinates.splice(findEl, 1)
        }
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
    removeMapBoxCoordinateByUidAction
} = mapSlice.actions

export default mapSlice.reducer