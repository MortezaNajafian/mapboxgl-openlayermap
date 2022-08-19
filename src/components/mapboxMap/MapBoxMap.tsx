import mapboxgl, {AnySourceData, Map} from 'mapbox-gl'
import {useEffect, useMemo, useRef} from "react";
import s from './MapBoxGLMap.module.scss'
import {useMapConfiguration} from "../../hooks/useMapConfiguration";
import MapNameEnum from "../../enums/MapNameEnum";
import {useAppSelector} from "../../app/storeHook";
import {toLonLat} from 'ol/proj'
import {updateMapBoxCoordinatesAction} from "../../store/mapReducer";

const MapBoxMap = () => {
    const {lng, zoom, lat, currentMapName, updateZoom, updateData, dispatch} = useMapConfiguration();
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


    const clearLastPoint = () => {
        geojson.features = []
        const source = map.current?.getSource('geojson') as { setData: (value: any) => void }
        source?.setData(geojson);
    }


    const addCoordinateInMapBox = (coords: number[][]) => {
        dispatch(updateMapBoxCoordinatesAction({uid: String(new Date().getTime()), coords}))
    }

    useEffect(() => {
        if (map?.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current || "",
            style: "https://api.maptiler.com/maps/basic-v2/style.json?key=xyoYFdk7IF6sarFDG4w1",
            center: [lng, lat],
            zoom: zoom,
            preserveDrawingBuffer: true,


        });

        map.current?.on('drag', () => {
            const center = map.current?.getCenter()
            updateData({
                lng: center?.lng || 0,
                lat: center?.lat || 0,
            }, MapNameEnum.MAPBOX_MAP)

        })

        map.current?.on('zoomend', () => {
            updateZoom(map?.current?.getZoom() || 0, MapNameEnum.MAPBOX_MAP)
        })


        map.current?.on('load', () => {
            map.current?.addSource('geojson', {
                'type': 'geojson',
                data: geojson
            } as AnySourceData);

            map.current?.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'geojson',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#000'
                },
                filter: ['in', '$type', 'Point']
            });
            map.current?.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'geojson',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-color': '#000',
                    'line-width': 2.5
                },
                filter: ['in', '$type', 'LineString']
            });

            map.current?.on('click', (e) => {
                const features = map.current?.queryRenderedFeatures(e.point, {
                    layers: ['measure-points']
                });

                if (geojson.features.length > 1) geojson.features.pop();

                if (features?.length) {
                    const id = features[0]?.properties?.id;
                    geojson.features = geojson.features.filter(
                        (point: any) => point?.properties?.id !== id
                    );
                } else {
                    const point = {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [e.lngLat.lng, e.lngLat.lat]
                        },
                        'properties': {
                            'id': String(new Date().getTime())
                        }
                    } as never;

                    geojson.features.push(point);
                }


                if (geojson.features.length > 1) {
                    linestring.geometry.coordinates = geojson.features.map(
                        (point: any) => point.geometry.coordinates
                    );

                    addCoordinateInMapBox(linestring.geometry.coordinates)
                    geojson.features.push(linestring as never);
                }

                const source = map.current?.getSource('geojson') as { setData: (value: any) => void }
                source?.setData(geojson);

            });
        });

    }, []);

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


    return <div className={s.wrapper}>
        <div ref={mapContainer} className={s.mapboxGLContainer}></div>
        <button onClick={clearLastPoint} className={s.clearButton}>Remove Last Point</button>

    </div>
}


export default MapBoxMap