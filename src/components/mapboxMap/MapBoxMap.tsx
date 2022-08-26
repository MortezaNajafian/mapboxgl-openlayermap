import {FC, useRef} from "react";
import s from './MapBoxGLMap.module.scss'
import useMapbox from "../../hooks/useMapbox";
import {IMapConfiguration} from "../../hooks/useMapConfiguration";


const MapBoxMap: FC<IMapConfiguration> = (config) => {

    const mapContainer = useRef(null);
    const linestringRef = useRef<any>({
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        },
        "properties": {
            "id": ''
        }
    });

    const linestring = linestringRef.current

    useMapbox({linestring, mapContainer, config})


    return (
        <div className={s.wrapper} data-test="mapbox-container">
            <div ref={mapContainer} className={s.mapboxGLContainer}></div>
        </div>
    )
}


export default MapBoxMap