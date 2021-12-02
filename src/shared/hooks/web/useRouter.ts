import type { RouteLocationNormalized } from 'vue-router';
import { getCurrentInstance } from 'vue';
import { isEmpty, isNotEmpty, isOutLink, isString } from '/@/shared/utils/is';
import { useRoute, useRouter as _useRouter } from 'vue-router';

export const useRouter = () => {
    const instance = getCurrentInstance();
    const route = instance ? useRoute() : {} as any;
    const router = instance ? _useRouter() : {} as any;

    const getNavigator = () => {

        const withRouter = isNotEmpty(router);
        const path = withRouter ? route.path : window.location.pathname;
        const query = withRouter ? route.query : window.location.search.slice(1).split('&').reduce((res:any, item) => {
            const temp = item.split('=');
            if (temp[0]) res[temp[0]] = temp[1];
            return res;
        }, {});

        const go = withRouter ? router.push : (to: RouteLocationNormalized) => {
            const { path, query } = to;
            let params = query ? '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&') : '';
            window.location.href = `${path}${params}`;
        };

        const back = withRouter ? router.go : window.history.back;

        const replace = withRouter ? router.replace : (to: RouteLocationNormalized) => {
            const { path, query } = to;
            let params = query ? '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&') : '';
            window.location.replace(`${path}${params}`);
        };
        return { path, query, go, back, replace };
    };

    const navigateTo = (to: any | string) => {
        if (isString(to)) to = { path: to } as RouteLocationNormalized;
        const { path } = to as RouteLocationNormalized;
        if (isEmpty(path)) return;
        const navigator = getNavigator();
        const isReplace = path === navigator?.path;
        if (isOutLink(path)) return window.open(path);
        return isReplace ? navigator.replace(to as any) : navigator.go(to as any);
    };

    const navigateBack = () => {
        const { back } = getNavigator();
        back(-1);
    };

    /**
     * 获取域名
     */
    const getOrigin = () => window.location.origin;

    /**
     * 获取重定向地址
     */
    const getRedirect = () => {
        const { query } = getNavigator();
        const { redirect } = query;
        return redirect ? decodeURIComponent(redirect as string) : '';
    };

    const getQuery = () => {
        const { query } = getNavigator();
        return query;
    };

    return {
        route,
        router,
        navigateTo,
        navigateBack,
        getQuery,
        getOrigin,
        getRedirect
    };
};
