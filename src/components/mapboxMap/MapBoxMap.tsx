import {Map} from 'mapbox-gl'
import {useEffect, useMemo, useRef} from "react";
import s from './MapBoxGLMap.module.scss'
import MapNameEnum from "../../enums/MapNameEnum";
import {useAppSelector} from "../../app/storeHook";
import {toLonLat} from 'ol/proj'
import useMapbox from "../../hooks/useMapbox";
import {removeMapBoxCoordinatesAction} from "../../store/mapReducer";

const MapBoxMap = () => {

    const olCoordinates = useAppSelector(state => state.map.openLayerCoordinates);
    const mapContainer = useRef(null);
    const map = useRef<null | Map>(null);

    const geojson = useMemo(() => ({
        type: 'FeatureCollection',
        'features':
            []
    }), []);

    const linestring: any = useMemo(() => ({
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        }
    }), []);

    const {lng, lat, currentMapName, zoom,dispatch} = useMapbox({linestring, map, mapContainer, geojson})


    const removeLinesFromStore = ()=>{
        dispatch(removeMapBoxCoordinatesAction())
    }


    const removeLines = () => {
        geojson.features = [];
        linestring.geometry.coordinates = []
        const source = map.current?.getSource('geojson') as { setData: (value: any) => void }
        source?.setData(geojson);
        removeLinesFromStore()
    }


    useEffect(() => {
            if (currentMapName !== MapNameEnum.MAPBOX_MAP && map.current) {
                const transformedCoordinates = olCoordinates.map(item => (item.coords.map((coord) => ([...toLonLat(coord)]))));
                const source = map.current?.getSource('geojson') as { setData: (value: any) => void }
                source?.setData({
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'MultiLineString',
                        'coordinates': transformedCoordinates
                    }
                });
            }
        }
        ,
        [olCoordinates]
    )


    useEffect(() => {
        if (currentMapName !== MapNameEnum.MAPBOX_MAP && map.current) {
            map.current?.setCenter({lat, lng})
        }
    }, [currentMapName, lat, lng]);

    useEffect(() => {
        if (currentMapName !== MapNameEnum.MAPBOX_MAP && map.current) {
            map.current?.setZoom(zoom)
        }
    }, [currentMapName, zoom])


    return (
        <div className={s.wrapper}>
            <div ref={mapContainer} className={s.mapboxGLContainer}></div>
            <button onClick={removeLines} className={s.clearButton}>Remove Lines</button>
        </div>
    )
}


export default MapBoxMap