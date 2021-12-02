import {useLayout} from "/@/layout/hook/useLayout";
import {isInWhiteList} from "/@/router/whiteList";


const {getPageLoadingState, setPageLoadingState} = useLayout();

export const order = 1;
export const beforeEach = ({to, next}: any) => {
    const {path} = to;
    if (!isInWhiteList(path) && !getPageLoadingState()) {
        setPageLoadingState(true)
    }
    next();
}