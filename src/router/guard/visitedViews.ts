import {isInWhiteList} from "/@/router/whiteList";
import {getAuthStore} from "/@/service/AuthRuleService";
import {useVisitedViews} from "/@/layout/hook/useVisitedViews";

export const order = 4;
export const beforeEach = async ({to, next}: any) => {
    if (isInWhiteList(to.path)) return next();
    const auths = await getAuthStore();
    const {getVisitedViews, setVisitedViews} = useVisitedViews();
    const views = getVisitedViews().filter(({path}) => !!auths[path]);
    setVisitedViews(views);
    next();
}