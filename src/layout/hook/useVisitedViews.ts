import {useCache} from "/@/shared/cache/useCache";
import {isNullOrUnDef} from "/@/shared/utils/is";

const VISITED_VIEW_CACHE_KEY = 'VISITED_VIEW_CACHE_KEY__';
const {getSession, setSession} = useCache();

export interface RouteInfo {
    path: string;
    query?: any;
    name?: string;
}

export const useVisitedViews = () => {

    const getVisitedViews = (): RouteInfo[] => getSession(VISITED_VIEW_CACHE_KEY) ?? [];

    const setVisitedViews = (views: RouteInfo[]) => setSession(VISITED_VIEW_CACHE_KEY, views)

    const deleteVisitedViews = ({path}: RouteInfo) => {
        let views: RouteInfo[] = getVisitedViews();
        let index;
        for (const [i, v] of views.entries()) {
            if (v.path === path) {
                index = i;
                break;
            }
        }
        !isNullOrUnDef(index) && views.splice(index, 1);
        setVisitedViews(views);
        return views;
    }

    const getVisitedViewsPath = (): string[] => {
        return getVisitedViews().map(({path}) => path);
    }

    return {
        getVisitedViews,
        setVisitedViews,
        deleteVisitedViews,
        getVisitedViewsPath
    }
}