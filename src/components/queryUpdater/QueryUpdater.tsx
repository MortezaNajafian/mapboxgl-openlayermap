import  {useEffect} from 'react';
import {useAppSelector} from "../../app/storeHook";


const QueryUpdater = () => {

    const lng = useAppSelector(state => state.map.lng)
    const lat = useAppSelector(state => state.map.lat)
    const zoom = useAppSelector(state => state.map.zoom)

    useEffect(() => {
        window.history.replaceState(null, "", `?zoom=${zoom}&lng=${lng}&lat=${lat}`)
    }, [lng, lat, zoom])

    return null
};

export default QueryUpdater;