import {useEffect} from 'react';
import {useAppSelector} from "../../app/storeHook";
import useUpdate from "../../hooks/useUpdate";
import defaultPosition from "../../constants/defaultPosition";
import {useSearchParams} from "react-router-dom";
import {debounce} from 'lodash'

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
    }, [searchParams]);


    const update = debounce(() => {
        window.history.replaceState(null, "", `?zoom=${zoom}&lng=${lng}&lat=${lat}&rotate=${rotate}`)
    }, 100)


    useEffect(() => {
        update()
    }, [lng, lat, zoom, rotate])

    return null
};

export default QueryUpdater;