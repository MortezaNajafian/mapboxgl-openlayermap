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
    const [currentMapBoxCoords, setCurrentMapBoxCoords] = useState<number[][]>([])
    const [activeDrawLine, setActiveDrawLine] = useState(true);
    const mapBoxCoordinates = useAppSelector(state => state.map.mapboxCoordinates);


    const transformedCoordinates = useMemo(() => mapBoxCoordinates.map(item => ([...fromLonLat(item)])), [mapBoxCoordinates]);

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
    }, [currentMapName, lat, lng]);


    useEffect(() => {
        if (currentMapName !== MapNameEnum.OPEN_LAYER_MAP && view.current) {
            view.current?.setZoom(zoom)
        }
    }, [currentMapName, zoom])

    useEffect(() => {
        if (currentMapName !== MapNameEnum.OPEN_LAYER_MAP) {
            let temp = [...currentMapBoxCoords]
            transformedCoordinates.forEach(item => {
                const findInCurrentCoordinates = temp.find(subItem => subItem[0].toString() === item[0].toString() && subItem[1].toString() === item[1].toString());
                if (!findInCurrentCoordinates) {
                    temp.push(item)
                }
            })
            temp.forEach((item) => {
                const findInTransformed = transformedCoordinates.findIndex(subItem => subItem[0].toString() === item[0].toString() && subItem[1].toString() === item[1].toString());
                if (findInTransformed === -1) {
                    const findIndexInTemp = temp.findIndex(subItem => subItem[0].toString() === item[0].toString() && subItem[1].toString() === item[1].toString());
                    temp.splice(findIndexInTemp, 1)
                }
            })
            setCurrentMapBoxCoords(temp)
        }
    }, [transformedCoordinates, currentMapName]);


    useEffect(() => {
        if (currentMapName !== MapNameEnum.OPEN_LAYER_MAP) {
            source.clear()
            const oldFeature = source.getFeatureById('mapbox-line')
            const feature = new Feature(new LineString(currentMapBoxCoords))
            feature.setId('mapbox-line')
            feature.setStyle(selected_polygon_style)
            if (!oldFeature) {
                source.addFeature(feature)
            } else {
                oldFeature?.setGeometry(feature.getGeometry())
            }

        }

    }, [currentMapBoxCoords, currentMapName])


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