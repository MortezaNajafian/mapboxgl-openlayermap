import {FC} from "react";
import s from './OpenLayerMap.module.scss'
import useOpenLayer from "../../hooks/useOpenLayer";
import {IMapConfiguration} from "../../hooks/useMapConfiguration";
import DrawLineButton from "./DrawLineButton";

const OpenLayerMap: FC<IMapConfiguration> = (config) => {

    const {openLayerMapContainer, drawObjectRef} = config

    useOpenLayer({
        config
    })


    return (
        <div className={s.wrapper}>
            <div ref={openLayerMapContainer} className={s.openLayerMapContainer}>
            </div>
            <DrawLineButton drawObjectRef={drawObjectRef}/>
        </div>
    )
}


export default OpenLayerMap