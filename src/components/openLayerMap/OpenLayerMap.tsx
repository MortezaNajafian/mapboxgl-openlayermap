import Map from 'ol/Map';
import TileJson from 'ol/source/TileJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import View from 'ol/View';
import {Vector as VectorSource} from 'ol/source';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import s from './OpenLayerMap.module.scss'
import {useMapConfiguration} from "../../hooks/useMapConfiguration";
import {toLonLat, fromLonLat} from "ol/proj";
import MapNameEnum from "../../enums/MapNameEnum";
import Draw from 'ol/interaction/Draw';
import {
    ICoords,
    removeOpenLayerCoordinateByUidAction,
    updateOpenLayerCoordinatesAction
} from "../../store/mapReducer";
import {v4 as uuidV4} from 'uuid'
import Select from 'ol/interaction/Select';
import {altKeyOnly, click} from 'ol/events/condition';
import {Fill, Stroke, Style} from "ol/style";
import {useAppSelector} from "../../app/storeHook";
import {Feature} from "ol";
import {LineString} from "ol/geom";

const OpenLayerMap = () => {

    const mapContainer = useRef(null);
    const map = useRef<null | Map>(null);
    const view = useRef<null | View>(null);

    const [activeDrawLine, setActiveDrawLine] = useState(true);
    const {lng, lat, zoom, currentMapName, updateZoom, updateData, dispatch} = useMapConfiguration();
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


    let drawObj = useMemo(() => new Draw({
        source: source,
        type: "LineString",
        freehand: true,
        freehandCondition: altKeyOnly,
    }), []);

    drawObj.on('change:active', (activate) => {
        setActiveDrawLine(!activate.oldValue)
    })

    const activeStatusInteraction = () => {
        map.current?.getInteractions().forEach((interaction) => {
            if (interaction instanceof Draw) {
                interaction.setActive(!interaction.getActive())
            }
        })
    }


    const clearSelectedFeature = (featureId: string) => {
        dispatch(removeOpenLayerCoordinateByUidAction(featureId))
    }


    const addFeature = useCallback(
        (coords: ICoords) => {
            dispatch(updateOpenLayerCoordinatesAction(coords))
        },
        [],
    );


    const selectClick = new Select({
        condition: click
    });

    const selected_polygon_style = useMemo(() => new Style({
        stroke: new Stroke({
            width: 5,
            color: "#ff0000"
        }),
        fill: new Fill({
            color: "#aa2727"
        })
    }), []);


    useEffect(() => {
        if (map?.current) return;
        view.current = new View({
            center: [lng, lat],
            zoom: zoom,
        })


        map.current = new Map({
            layers: [
                new TileLayer({
                    source: new TileJson({
                        url: "https://api.maptiler.com/maps/basic-v2/tiles.json?key=xyoYFdk7IF6sarFDG4w1",

                    }),
                }),
                vector
            ],
            target: mapContainer.current || "",
            view: view.current,
        });


        map.current?.on("pointerdrag", function () {
            const center = view.current?.getCenter();
            const lonLat = toLonLat(center as number[])
            updateData({
                lng: lonLat[0] || 0,
                lat: lonLat[1] || 0,
            }, MapNameEnum.OPEN_LAYER_MAP)

        });


        view.current?.on('change:resolution', () => {
            const newZoom = view.current?.getZoom();
            if (currZoom != newZoom) {
                updateZoom(newZoom || 14, MapNameEnum.OPEN_LAYER_MAP)
            }
        })

        source.on('addfeature', (evt) => {
            const feature = evt?.feature
            feature?.setId(uuidV4())
            feature?.setStyle(selected_polygon_style)
            const coords = feature?.getGeometry() as { getCoordinates: () => number[][] } | undefined
            if (coords?.getCoordinates())
                addFeature({uid: feature?.getId() as string, coords: coords?.getCoordinates()})

        })

        source.on('removefeature', (evt) => {
            const feature = evt?.feature;
            clearSelectedFeature(feature?.getId() as string)
        })

        map.current?.on('loadend', () => {
            map.current?.addInteraction(selectClick)
            map.current?.addInteraction(drawObj)

        })

        selectClick.on('select', (feature) => {
            source.removeFeature(feature.selected[0])
        })


    });

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


    return <div className={s.wrapper}>
        <div ref={mapContainer} className={s.openLayerMapContainer}>
        </div>
        <button onClick={activeStatusInteraction}
                className={s.activeLine}>{activeDrawLine ? "DeActive Line" : "Active Line"}</button>
    </div>
}


export default OpenLayerMap