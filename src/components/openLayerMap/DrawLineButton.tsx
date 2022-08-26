import React, {FC, MutableRefObject, useEffect, useState} from 'react';
import s from "./OpenLayerMap.module.scss";
import Draw from "ol/interaction/Draw";

interface IDrawLineButtonProps {
    drawObjectRef: MutableRefObject<Draw | null>

}

const DrawLineButton: FC<IDrawLineButtonProps> = ({drawObjectRef}) => {

    const [active, setActive] = useState(true);

    useEffect(() => {
        drawObjectRef.current?.setActive(active)
    }, [active]);


    return (
        <button onClick={() => setActive(prevState => !prevState)}
                className={s.activeLine}>{active ? "DeActive Line" : "Active Line"}</button>
    );
};

export default DrawLineButton;