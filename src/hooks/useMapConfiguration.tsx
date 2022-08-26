import {ThunkAppDispatch, useAppDispatch} from "../app/storeHook";
import {MutableRefObject, useCallback, useRef, useState} from "react";
import {MapPosition, updatePositionAction, updateRotateAction, updateZoomAction} from "../store/mapReducer";
import {useSearchParams} from 'react-router-dom'
import defaultPosition from "../constants/defaultPosition";
import {GeoJSONSource, Map as MapBoxType} from "mapbox-gl";
import Map from "ol/Map";
import View from "ol/View";
import Draw from "ol/interaction/Draw";
import {Vector as VectorSource} from "ol/source";
import {Geometry, LineString} from "ol/geom";
import {Vector as VectorLayer} from "ol/layer";
import {Fill, Stroke, Style} from "ol/style";
import {Coordinate} from "ol/coordinate";
import {fromLonLat} from "ol/proj";
import {Feature} from "ol";


export interface IMapConfiguration {
    dispatch: ThunkAppDispatch
    lng: number | string
    lat: number | string
    zoom: number | string
    rotate: number | string
    updateData: (data: MapPosition) => void
    updateZoom: (zoom: number) => void
    updateRotate: (rotate: number) => void
    mapboxMap: MutableRefObject<null | MapBoxType>
    openLayerMap: MutableRefObject<null | Map>
    openLayerView: MutableRefObject<null | View>,
    geoJsonRef: MutableRefObject<any>
    sourceRef: MutableRefObject<VectorSource<Geometry> | null>
    vectorRef: MutableRefObject<VectorLayer<VectorSource<Geometry>> | null>
    openLayerFeatureStyle: Style
    openLayerMapContainer: MutableRefObject<any>
    drawObjectRef: MutableRefObject<Draw | null>
    activeDrawLine: boolean
    setActiveDrawLine: (value: boolean) => void
    activeStatusInteraction: (value: boolean) => void
    addLinePointsInOpenLayer: () => void
    updateMapboxFeatures: (data?: any) => void
}


export const useMapConfiguration: () => IMapConfiguration = () => {
    const dispatch = useAppDispatch();
    const [activeDrawLine, setActiveDrawLine] = useState(true);
    const [searchParams] = useSearchParams()
    const mapboxMap = useRef<null | MapBoxType>(null);
    const openLayerMap = useRef<null | Map>(null);
    const openLayerView = useRef<null | View>(null);
    const geoJsonRef = useRef<any>({
        type: 'FeatureCollection',
        'features':
            []
    });
    const sourceRef = useRef<VectorSource<Geometry> | null>(null)
    const vectorRef = useRef<VectorLayer<VectorSource<Geometry>> | null>(null)
    const openLayerMapContainer = useRef(null);
    const drawObjectRef = useRef<Draw | null>(null)


    const lng = searchParams?.get('lng') || defaultPosition.lng;
    const lat = searchParams?.get('lat') || defaultPosition.lat;
    const zoom = searchParams?.get('zoom') || defaultPosition.zoom;
    const rotate = searchParams?.get('rotate') || defaultPosition.rotate;


    const openLayerFeatureStyle = new Style({
        stroke: new Stroke({
            width: 5,
            color: "#ff0000"
        }),
        fill: new Fill({
            color: "#aa2727"
        })
    })

    const activeStatusInteraction = useCallback((value: boolean) => {
        drawObjectRef.current?.setActive(value)
    }, []);


    const updateData = useCallback((data: MapPosition) => {
            dispatch(updatePositionAction(data))
        }
        , []);


    const updateZoom = useCallback((zoom: number) => {
            dispatch(updateZoomAction(zoom))
        }
        , []);

    const updateRotate = useCallback((rotate: number) => {
            dispatch(updateRotateAction(rotate))
        }
        , []);


    const updateMapboxFeatures = useCallback((data?: any) => {
        const source = mapboxMap.current?.getSource('geojson') as GeoJSONSource
        source?.setData(data || geoJsonRef.current);
    }, [])


    const addLinePointsInOpenLayer = useCallback(() => {
        const oldFeature =
            sourceRef?.current?.getFeatureById('mapbox-line')

        const selectLine = geoJsonRef.current.features?.find((item: { geometry: { type: string; }; }) => item?.geometry?.type === "LineString");

        if (selectLine) {
            const transformedCoordinates = selectLine.geometry.coordinates.map((item: Coordinate) => ([...fromLonLat(item)]))
            const feature = new Feature(new LineString(transformedCoordinates))
            feature.setId('mapbox-line')
            feature.setStyle(openLayerFeatureStyle)
            if (!oldFeature) {
                sourceRef.current?.addFeature(feature)
            } else {
                oldFeature?.setGeometry(feature.getGeometry())
            }
        } else {
            if (oldFeature)
                sourceRef.current?.removeFeature(oldFeature)
        }

    }, [])

    return {
        dispatch,
        lng,
        lat,
        zoom,
        rotate,
        updateData,
        updateZoom,
        updateRotate,
        mapboxMap,
        openLayerMap,
        openLayerView,
        geoJsonRef,
        sourceRef,
        vectorRef,
        openLayerFeatureStyle,
        openLayerMapContainer,
        drawObjectRef,
        activeDrawLine,
        setActiveDrawLine,
        activeStatusInteraction,
        addLinePointsInOpenLayer,
        updateMapboxFeatures,
    }
}