import s from './AppContent.module.scss'
import MapBoxMap from "../mapboxMap/MapBoxMap";
import OpenLayerMap from "../openLayerMap/OpenLayerMap";
import {useMapConfiguration} from "../../hooks/useMapConfiguration";
import QueryUpdater from "../queryUpdater/QueryUpdater";


const AppContent = () => {
    const config = useMapConfiguration();
    return <div className={s.appContent}>
        <QueryUpdater/>
        <div className={s.panel}>
            <MapBoxMap {...config}/>
        </div>
        <div className={s.panel}>
            <OpenLayerMap {...config}/>
        </div>
    </div>
}


export default AppContent