import Map from 'ol/Map';
import {Vector as VectorLayer} from 'ol/layer';
import View from 'ol/View';
import {Vector as VectorSource} from 'ol/source';
import {useEffect, useMemo, useRef, useState} from "react";
import s from './OpenLayerMap.module.scss'
import {fromLonLat} from "ol/proj";
import MapNameEnum from "../../enums/MapNameEnum";
import {useAppSelector} from "../../app/storeHook";
import {Feature} from "ol";
import {LineString} from "ol/geom";
import useOpenLayer from "../../hooks/useOpenLayer";

const OpenLayerMap = () => {

    const mapContainer = useRef(null);
    const map = useRef<null | Map>(null);
    const view = useRef<null | View>(null);

    const [activeDrawLine, setActiveDrawLine] = useState(true);
    const mapBoxCoordinates = useAppSelector(state => state.map.mapboxCoordinates);


    const transformedCoordinates = useMemo(() => mapBoxCoordinates.map(item => ({
        ...item,
        coords: item.coords.map((coord) => ([...fromLonLat(coord)]))
    })), [mapBoxCoordinates]);

    const currZoom = view.current?.getZoom();

    const source = useMemo(() => new VectorSource({wrapX: false}), []);
    const vector = useMemo(() => new VectorLayer({
        source: source,
    }), []);


    const {lng, zoom, lat, currentMapName, selected_polygon_style, drawObj} = useOpenLayer({
        setActiveDrawLine,
        view,
        currZoom,
        source,
        vector,
        mapContainer,
        map
    })

    const activeStatusInteraction = () => {
        drawObj.setActive(!drawObj.getActive())
    }


    useEffect(() => {
        if (currentMapName !== MapNameEnum.OPEN_LAYER_MAP && view.current) {
            view.current?.setCenter(fromLonLat([lng, lat]))
        }
    }, [currentMapName, lat, lng, view?.current]);


    useEffect(() => {
        if (currentMapName !== MapNameEnum.OPEN_LAYER_MAP && view.current) {
            view.current?.setZoom(zoom)
        }
    }, [currentMapName, zoom])

    useEffect(() => {

        const features = transformedCoordinates?.map(item => {
            const feature = new Feature(new LineString(item.coords))
            feature.setId(item.uid)
            feature.setStyle(selected_polygon_style)
            return feature
        })

        source.addFeatures(features)

    }, [transformedCoordinates]);


    return (
        <div className={s.wrapper}>
            <div ref={mapContainer} className={s.openLayerMapContainer}>
            </div>
            <button onClick={activeStatusInteraction}
                    className={s.activeLine}>{activeDrawLine ? "DeActive Line" : "Active Line"}</button>
        </div>
    )
}


export default OpenLayerMap