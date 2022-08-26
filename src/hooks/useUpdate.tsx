import {useCallback} from "react";
import {MapPosition, updatePositionAction, updateRotateAction, updateZoomAction} from "../store/mapReducer";
import {useAppDispatch} from "../app/storeHook";


const useUpdate = () => {
    const dispatch = useAppDispatch()

    const updateData = useCallback((data: MapPosition) => {
            dispatch(updatePositionAction(data))
        }
        , []);

    const updateZoom = useCallback((zoom: number) => {
            dispatch(updateZoomAction(zoom))
        }
        , []);

    const updateRotate = useCallback((rotate: number) => {
            dispatch(updateRotateAction(rotate))
        }
        , []);

    return {updateRotate, updateData, updateZoom}
}


export default useUpdate