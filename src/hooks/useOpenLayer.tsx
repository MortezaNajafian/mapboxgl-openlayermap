import {MutableRefObject, useCallback, useEffect, useMemo} from "react";
import View from "ol/View";
import Map from "ol/Map";
import TileJson from "ol/source/TileJSON";
import {toLonLat} from "ol/proj";
import MapNameEnum from "../enums/MapNameEnum";
import {v4 as uuidV4} from "uuid";
import {Geometry} from "ol/geom";
import {useMapConfiguration} from "./useMapConfiguration";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {
    clearMapBoxCoordinatesAction,
    ICoords,
    removeOpenLayerCoordinateByUidAction,
    updateCurrentMapAction,
    updateOpenLayerCoordinatesAction
} from "../store/mapReducer";
import Select from "ol/interaction/Select";
import {altKeyOnly, click} from "ol/events/condition";
import {Fill, Stroke, Style} from "ol/style";
import Draw from "ol/interaction/Draw";


interface IUseOpenLayer {
    map: MutableRefObject<Map | null>
    source: VectorSource<Geometry>
    vector: VectorLayer<VectorSource<Geometry>>
    mapContainer: MutableRefObject<any>
    view: MutableRefObject<View | null>
    currZoom: number | undefined
    setActiveDrawLine: (value: boolean) => void
}

const useOpenLayer = (options: IUseOpenLayer) => {

    const {source, vector, mapContainer, view, currZoom, setActiveDrawLine, map} = options;
    const {lng, lat, zoom, currentMapName, updateZoom, updateData, dispatch} = useMapConfiguration();

    const addFeature = useCallback(
        (coords: ICoords) => {
            dispatch(updateOpenLayerCoordinatesAction(coords))
        },
        [],
    );

    const clearSelectedFeature = (featureId: string) => {
        if (featureId !== "mapbox-line") {
            dispatch(removeOpenLayerCoordinateByUidAction(featureId))
        }
    }


    const clearMapBoxCoordinates = () => {
        dispatch(updateCurrentMapAction(MapNameEnum.OPEN_LAYER_MAP))
        dispatch(clearMapBoxCoordinatesAction())
    }

    const selectClick = new Select({
        condition: click
    });

    const selected_polygon_style = new Style({
        stroke: new Stroke({
            width: 5,
            color: "#ff0000"
        }),
        fill: new Fill({
            color: "#aa2727"
        })
    })

    const drawObj = useMemo(() => new Draw({
        source: source,
        type: "LineString",
        freehand: true,
        freehandCondition: altKeyOnly,
    }), []);


    useEffect(() => {
        if (map?.current) return;
        view.current = new View({
            center: [lng, lat],
            zoom: zoom,
            zoomFactor: 2.38
        })

        map.current = new Map({
            layers: [
                new TileLayer({
                    source: new TileJson({
                        url: "https://api.maptiler.com/maps/basic-v2/tiles.json?key=xyoYFdk7IF6sarFDG4w1",
                        tileSize: 512
                    }),
                }),
                vector
            ],
            target: mapContainer.current || "",
            view: view.current,
        });


        map.current?.on("pointerdrag", function () {
            const mapboxLine = source.getFeatureById('mapbox-line');
            if (mapboxLine) {
                source.removeFeature(mapboxLine)
                clearMapBoxCoordinates()
            }
            const center = view.current?.getCenter();
            const lonLat = toLonLat(center as number[])
            updateData({
                lng: lonLat[0] || 0,
                lat: lonLat[1] || 0,
            }, MapNameEnum.OPEN_LAYER_MAP)

        });


        view.current?.on('change:resolution', () => {
            const newZoom = view.current?.getZoom();
            if (currZoom !== newZoom) {
                updateZoom(newZoom || 14, MapNameEnum.OPEN_LAYER_MAP)
            }
        })

        source.on('addfeature', (evt) => {
            const feature = evt?.feature;
            const id = feature?.getId();
            if (!id)
                feature?.setId(uuidV4())
            feature?.setStyle(selected_polygon_style)
            const coords = feature?.getGeometry() as { getCoordinates: () => number[][] } | undefined
            if (coords?.getCoordinates() && id !== "mapbox-line")
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

        drawObj.on('change:active', (activate) => {
            setActiveDrawLine(!activate.oldValue)
        })


    });


    return {lng, lat, zoom, currentMapName, selected_polygon_style, drawObj}
}


export default useOpenLayer