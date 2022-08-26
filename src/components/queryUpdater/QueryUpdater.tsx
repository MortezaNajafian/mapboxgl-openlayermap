import {useEffect} from 'react';
import {useAppSelector} from "../../app/storeHook";
import useUpdate from "../../hooks/useUpdate";
import defaultPosition from "../../constants/defaultPosition";
import {useSearchParams} from "react-router-dom";


const QueryUpdater = () => {

    const [searchParams] = useSearchParams()

    const lng = useAppSelector(state => state.map.lng)
    const lat = useAppSelector(state => state.map.lat)
    const zoom = useAppSelector(state => state.map.zoom)
    const rotate = useAppSelector(state => state.map.rotate)


    const getLng = searchParams?.get('lng') || defaultPosition.lng;
    const getLat = searchParams?.get('lat') || defaultPosition.lat;
    const getZoom = searchParams?.get('zoom') || defaultPosition.zoom;
    const getRotate = searchParams?.get('rotate') || defaultPosition.rotate;


    const {updateRotate, updateData, updateZoom} = useUpdate()


    useEffect(() => {
        updateZoom(+getZoom)
        updateData({lng: +getLng, lat: +getLat})
        updateRotate(+getRotate)
    }, []);


    useEffect(() => {
        window.history.replaceState(null, "", `?zoom=${zoom}&lng=${lng}&lat=${lat}&rotate=${rotate}`)
    }, [lng, lat, zoom, rotate])

    return null
};

export default QueryUpdater;