import {GeoJSONSource, Map} from 'mapbox-gl'
import {useEffect, useRef} from "react";
import s from './MapBoxGLMap.module.scss'
import MapNameEnum from "../../enums/MapNameEnum";
import {useAppSelector} from "../../app/storeHook";
import {toLonLat} from 'ol/proj'
import useMapbox from "../../hooks/useMapbox";

const MapBoxMap = () => {

    const olCoordinates = useAppSelector(state => state.map.openLayerCoordinates);
    const mapboxCoordinates = useAppSelector(state => state.map.mapboxCoordinates);
    const mapContainer = useRef(null);
    const geojsonRef = useRef<any>({
        type: 'FeatureCollection',
        'features':
            []
    });
    const linestringRef = useRef<any>({
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        }
    });
    const map = useRef<null | Map>(null);
    const geojson = geojsonRef.current
    const linestring = linestringRef.current

    const {lng, lat, currentMapName, zoom} = useMapbox({linestring, map, mapContainer, geojson})


    useEffect(() => {
            if (currentMapName !== MapNameEnum.MAPBOX_MAP && map.current) {
                const transformedCoordinates = olCoordinates.map(item => (item.coords.map((coord) => ([...toLonLat(coord)]))));
                if (!transformedCoordinates.length) return
                const source = map.current?.getSource('geojson') as GeoJSONSource
                source?.setData({
                    'type': 'Feature',
                    'properties': {
                        "id": "openLayer-map-lines"
                    },
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
        if (currentMapName !== MapNameEnum.MAPBOX_MAP && !mapboxCoordinates.length) {
            geojson.features = []
            const source = map.current?.getSource('geojson') as GeoJSONSource
            source?.setData(geojson);
        }
    }, [mapboxCoordinates, currentMapName])


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
        </div>
    )
}


export default MapBoxMap