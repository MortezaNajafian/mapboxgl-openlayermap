import {useEffect} from 'react';
import {useAppSelector} from "../../app/storeHook";


const QueryUpdater = () => {

    const lng = useAppSelector(state => state.map.lng)
    const lat = useAppSelector(state => state.map.lat)
    const zoom = useAppSelector(state => state.map.zoom)
    const rotate = useAppSelector(state => state.map.rotate)

    useEffect(() => {
        window.history.replaceState(null, "", `?zoom=${zoom}&lng=${lng}&lat=${lat}&rotate=${rotate}`)
    }, [lng, lat, zoom, rotate])

    return null
};

export default QueryUpdater;