import {MutableRefObject, useEffect} from "react";
import mapboxgl, {AnySourceData, Map} from "mapbox-gl";
import MapNameEnum from "../enums/MapNameEnum";
import {useMapConfiguration} from "./useMapConfiguration";
import {updateMapBoxCoordinatesAction} from "../store/mapReducer";


interface IUseMapbox {
    map: MutableRefObject<Map | null>
    mapContainer: MutableRefObject<any>
    geojson: any,
    linestring: any
}


const useMapbox = (options: IUseMapbox) => {

    const {lng, zoom, lat, currentMapName, updateZoom, updateData, dispatch} = useMapConfiguration();
    const {map, mapContainer, geojson, linestring} = options;


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


    return {currentMapName, lng, lat,zoom,dispatch}

}


export default useMapbox