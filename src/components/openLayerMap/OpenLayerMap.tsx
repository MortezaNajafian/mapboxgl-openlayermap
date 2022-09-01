import {FC} from "react";
import s from './OpenLayerMap.module.scss'
import useOpenLayer from "../../hooks/useOpenLayer";
import {IMapConfiguration} from "../../hooks/useMapConfiguration";
import DrawLineButton from "./DrawLineButton";
import React from 'react'
const OpenLayerMap: FC<IMapConfiguration> = (config) => {

    const {openLayerMapContainer, drawObjectRef} = config

    useOpenLayer({
        config
    })


    return (
        <div className={s.wrapper} data-test="open-layer-container">
            <div ref={openLayerMapContainer} className={s.openLayerMapContainer}>
            </div>
            <DrawLineButton drawObjectRef={drawObjectRef}/>
        </div>
    )
}


export default OpenLayerMap