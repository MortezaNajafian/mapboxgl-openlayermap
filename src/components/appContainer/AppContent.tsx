import s from './AppContent.module.scss'
import MapBoxMap from "../mapboxMap/MapBoxMap";
import OpenLayerMap from "../openLayerMap/OpenLayerMap";


const AppContent = () => {

    return <div className={s.appContent}>
        <div className={s.panel}>
            <MapBoxMap/>
        </div>
        <div className={s.panel}>
            <OpenLayerMap/>
        </div>
    </div>
}


export default AppContent