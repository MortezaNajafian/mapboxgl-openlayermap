import {MutableRefObject, useEffect} from "react";
import mapboxgl, {AnySourceData} from "mapbox-gl";
import {IMapConfiguration} from "./useMapConfiguration";
import {fromLonLat} from "ol/proj";


interface IUseMapbox {
    config: IMapConfiguration
    mapContainer: MutableRefObject<any>
    linestring: any
}


const useMapbox = (options: IUseMapbox) => {
    const {mapContainer, linestring, config} = options;
    const {
        lng,
        lat,
        mapboxMap,
        updateZoom,
        openLayerView,
        zoom,
        rotate,
        updateData,
        geoJsonRef,
        addLinePointsInOpenLayer,
        sourceRef,
        updateMapboxFeatures
    } = config
    const map = mapboxMap


    useEffect(() => {
            if (map?.current) return;
            map.current = new mapboxgl.Map({
                container: mapContainer.current || "",
                style: "https://api.maptiler.com/maps/basic-v2/style.json?key=xyoYFdk7IF6sarFDG4w1",
                center: [+lng, +lat],
                zoom: +zoom,
                bearing: +rotate,
                pitchWithRotate: false,

            });
            map.current?.addControl(new mapboxgl.NavigationControl());

            map.current?.on('drag', () => {
                const center = map.current?.getCenter()
                updateData({
                    lng: center?.lng || 0,
                    lat: center?.lat || 0,
                })

            })

            map.current?.on('zoomend', () => {
                updateZoom(map?.current?.getZoom() || 0)
            })


            map.current?.on('load', () => {

                map.current?.addSource('geojson', {
                    'type': 'geojson',
                    data: geoJsonRef.current,

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
                    filter: ['in', '$type', 'LineString'],
                });

                map.current?.on('click', (e) => {
                    const features = map.current?.queryRenderedFeatures(e.point, {
                        layers: ['measure-points']
                    });
                    // remove open layer map lines when we are drawing line in mapbox gl
                    geoJsonRef.current.features.forEach((item: { properties?: { id?: string; }; }) => {
                        if (item?.properties?.id?.match(/^openLayer-map-lines-/)) {
                            geoJsonRef.current.features = []
                        }
                    })

                    sourceRef.current?.clear()

                    if (geoJsonRef.current.features.length > 1) geoJsonRef.current.features.pop();

                    if (features?.length) {
                        const id = features[0]?.properties?.id;
                        geoJsonRef.current.features = geoJsonRef.current.features.filter(
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
                                'id': `mapbox-point-${new Date().getTime()}`
                            }
                        } as never;

                        geoJsonRef.current.features.push(point);
                    }


                    if (geoJsonRef.current.features.length > 1) {
                        linestring.properties.id = `mapbox-line-${new Date().getTime()}`
                        linestring.geometry.coordinates = geoJsonRef.current.features.map(
                            (point: any) => point.geometry.coordinates
                        );

                        geoJsonRef.current.features.push(linestring as never);
                    }

                    addLinePointsInOpenLayer()
                    updateMapboxFeatures()

                });


                map.current?.on('mousemove', (e) => {
                    const features = map.current?.queryRenderedFeatures(e.point, {
                        layers: ['measure-points']
                    });

                    if (map.current)
                        map.current.getCanvas().style.cursor = features?.length
                            ? 'pointer'
                            : 'grab';
                });


                map.current?.on('move', (data) => {
                    const center = data.target.getCenter()
                    openLayerView.current?.setCenter(fromLonLat([center.lng, center.lat]))
                })

                map.current?.on('rotate', (data) => {
                    const bearing = data.target.getBearing()
                    openLayerView.current?.setRotation(-(bearing / 60))
                })

                map.current?.on('zoom', (data) => {
                    const zoom = data.target.getZoom()
                    openLayerView.current?.setZoom(zoom)
                })
            });

        }
    )
    ;

}


export default useMapbox