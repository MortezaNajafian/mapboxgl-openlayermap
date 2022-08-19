import {useAppDispatch, useAppSelector} from "../app/storeHook";
import {useCallback, useEffect} from "react";
import {MapPosition, updateCurrentMapAction, updatePositionAction, updateZoomAction} from "../store/mapReducer";
import MapNameEnum from "../enums/MapNameEnum";
import {useSearchParams} from 'react-router-dom'
import defaultPosition from "../constants/defaultPosition";

export const useMapConfiguration = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams()


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

    useEffect(() => {
        const getZoom = searchParams.get('zoom') || defaultPosition.zoom;
        const getLng = searchParams.get('lng') || defaultPosition.lng;
        const getLat = searchParams.get('lat') || defaultPosition.lat;
        if (getZoom)
            updateZoom(getZoom as number, MapNameEnum.OPEN_LAYER_MAP)
        if (getLat && getLng) updateData({lng: getLng as number, lat: getLat as number}, MapNameEnum.OPEN_LAYER_MAP)

    }, []);


    useEffect(() => {
        window.history.replaceState(null, "", `?zoom=${zoom}&lng=${lng}&lat=${lat}`)
    }, [lng, lat, zoom]);


    return {dispatch, lng, lat, zoom, currentMapName, updateZoom, updateData}
}