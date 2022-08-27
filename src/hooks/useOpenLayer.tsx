import {useCallback, useEffect} from "react";
import View from "ol/View";
import Map from "ol/Map";
import TileJson from "ol/source/TileJSON";
import {toLonLat, fromLonLat} from "ol/proj";
import {IMapConfiguration} from "./useMapConfiguration";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {
    ICoords,
} from "../store/mapReducer";
import Select from "ol/interaction/Select";
import {altKeyOnly, click} from "ol/events/condition";
import Draw from "ol/interaction/Draw";
import {GeoJSONSource} from "mapbox-gl";
import {Vector as VectorSource} from "ol/source";
import {Geometry} from "ol/geom";
import {
    defaults as defaultInteractions, DragRotateAndZoom,
} from 'ol/interaction';

interface IUseOpenLayer {
    config: IMapConfiguration
}

const useOpenLayer = (options: IUseOpenLayer) => {
    const {config} = options;
    const {
        lng,
        openLayerView,
        openLayerMap,
        mapboxMap,
        lat,
        zoom,
        rotate,
        updateZoom,
        updateData,
        updateRotate,
        geoJsonRef,
        sourceRef,
        vectorRef,
        openLayerFeatureStyle,
        openLayerMapContainer,
        drawObjectRef,
        setActiveDrawLine,
        updateMapboxFeatures
    } = config

    const map = openLayerMap


    const addFeatureToMapBox = useCallback(
        (data: ICoords) => {
            const source = mapboxMap.current?.getSource('geojson') as GeoJSONSource
            const transformedCoordinates = data.coords.map((coord) => ([...toLonLat(coord)]))
            geoJsonRef.current.features.push({
                'type': 'Feature',
                'properties': {
                    "id": data.uid
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': transformedCoordinates
                }
            })
            source?.setData(geoJsonRef.current);
        },
        [],
    );


    const clearSelectedFeature = useCallback((featureId: string) => {
        if (featureId !== "mapbox-line") {
            geoJsonRef.current.features = geoJsonRef.current.features.filter((item: { properties: { id: string; }; }) => item.properties.id !== featureId)
            updateMapboxFeatures()
        }
    }, [])


    const selectClick = new Select({
        condition: click
    });


    useEffect(() => {
        if (map?.current) return;

        openLayerView.current = new View({
            center: fromLonLat([+lng, +lat]),
            zoom: +zoom,
            zoomFactor: 2.38,
            rotation: -(+rotate / 60),
            enableRotation: true,
        })

        map.current = new Map({
            interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
            layers: [
                new TileLayer({
                    source: new TileJson({
                        url: "https://api.maptiler.com/maps/basic-v2/tiles.json?key=xyoYFdk7IF6sarFDG4w1",
                        tileSize: 512,
                        imageSmoothing: true
                    }),
                }),
            ],
            target: openLayerMapContainer.current || "",
            view: openLayerView.current,
        });


        openLayerView.current?.on("change:center", function (data) {
            const center = data.target.getCenter();
            const lonLat = toLonLat(center as number[])
            updateData({
                lng: lonLat[0] || 0,
                lat: lonLat[1] || 0,
            })

            if (!mapboxMap.current?.isMoving())
                mapboxMap.current?.setCenter({
                    lng: lonLat[0] || 0,
                    lat: lonLat[1] || 0,
                })
        });


        openLayerView.current?.on('change:resolution', () => {
            const newZoom = openLayerView.current?.getZoom() || 0;
            updateZoom(newZoom || 14)
            if (!mapboxMap.current?.isZooming())
                mapboxMap.current?.setZoom(newZoom)
        })


        sourceRef.current = new VectorSource({wrapX: false})

        sourceRef.current?.on('addfeature', (evt) => {
            const feature = evt?.feature;
            feature?.setStyle(openLayerFeatureStyle)
            const id = feature?.getId();
            if (!id) {
                feature?.setId(`open-layer-line-${new Date().getTime()}`)
                const findMapboxLine = sourceRef.current?.getFeatureById('mapbox-line');
                if (findMapboxLine) {
                    sourceRef.current?.removeFeature(findMapboxLine)
                    geoJsonRef.current.features = geoJsonRef.current.features.filter((item: { properties: { id: string | string[]; }; }) => !item?.properties?.id.includes("mapbox"))
                    updateMapboxFeatures()
                }
            }
            const coords = feature?.getGeometry() as { getCoordinates: () => number[][] } | undefined
            if (coords?.getCoordinates() && id !== "mapbox-line")
                addFeatureToMapBox({uid: feature?.getId() as string, coords: coords?.getCoordinates()})
        })

        sourceRef.current?.on('removefeature', (evt) => {
            const feature = evt?.feature;
            clearSelectedFeature(feature?.getId() as string)
        })

        vectorRef.current = new VectorLayer({
            source: sourceRef.current,

        })

        map.current?.addLayer(vectorRef.current as VectorLayer<VectorSource<Geometry>>)

        drawObjectRef.current = new Draw({
            source: sourceRef.current || undefined,
            type: "LineString",
            freehand: true,
            freehandCondition: altKeyOnly,
        })


        map.current?.addInteraction(selectClick)
        map.current?.addInteraction(drawObjectRef.current as Draw)


        drawObjectRef.current?.on('change:active', (activate) => {
            setActiveDrawLine(!activate.oldValue)
        })


        selectClick.on('select', (feature) => {
            sourceRef.current?.removeFeature(feature.selected[0])
        })


        openLayerView.current.on("change:rotation", (data) => {
            updateRotate(Math.abs(data.target.getRotation() * 60))
            if (!mapboxMap.current?.isRotating())
                mapboxMap.current?.setBearing(Math.abs(data.target.getRotation() * 60))
        })

    });
}


export default useOpenLayer