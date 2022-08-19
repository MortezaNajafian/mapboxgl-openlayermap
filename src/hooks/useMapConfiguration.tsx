import {useAppDispatch, useAppSelector} from "../app/storeHook";
import {useCallback} from "react";
import {MapPosition, updateCurrentMapAction, updatePositionAction, updateZoomAction} from "../store/mapReducer";
import MapNameEnum from "../enums/MapNameEnum";


export const useMapConfiguration = () => {
    const dispatch = useAppDispatch();
    const lng = useAppSelector(state => state.map.lng);
    const lat = useAppSelector(state => state.map.lat);
    const zoom = useAppSelector(state => state.map.zoom);
    const currentMapName = useAppSelector(state => state.map.currentMapName);


    const updateZoom = useCallback(
        (zoom: number, currentMap: MapNameEnum) => {
            dispatch(updateCurrentMapAction(currentMap))
            dispatch(updateZoomAction(zoom))
        },
        [],
    );

    const updateData = useCallback((data: MapPosition, currentMap: MapNameEnum) => {
            dispatch(updateCurrentMapAction(currentMap))
            dispatch(updatePositionAction(data))
        }
        , []);


    return {dispatch, lng, lat, zoom, currentMapName, updateZoom, updateData}
}