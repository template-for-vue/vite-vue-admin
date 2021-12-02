import {getAuthStore, getMenuStore, getTicketStore} from "/@/service/AuthRuleService";
import {Page} from "/@/router/page";
import {isEmpty, isNotEmpty} from "/@/shared/utils/is";
import {isLogin} from "/@/service/LoginService";
import {isInWhiteList} from "/@/router/whiteList";

export const order = 3;
export const beforeEach = async ({to, next}: any) => {
    const ticket = getTicketStore();

    /**
     * 如果是登陆页面，且存在ticket
     * 则先验证是否已登陆，如果已登陆，直接跳转到欢迎页
     */
    if (to.path === Page.LOGIN && isNotEmpty(ticket)) {
        if (await isLogin()) return next(Page.DASHBOARD_WELCOME);
    }

    //白名单中，直接进入
    if (isInWhiteList(to.path)) return next();
    //不验证权限
    if (to.meta?.ignoreAuth) return next();
    //如果未登录，跳转到登录页面
    if (isEmpty(ticket)) {
        const redirect = to.fullPath;
        return next({path: Page.LOGIN, query: {redirect}})
    }

    //验证页面权限
    const [auth] = await Promise.all([
        getAuthStore(),
        getMenuStore()
    ])
    if (isEmpty(auth) || isEmpty(auth[to.path])) {
        return next({path: Page.ERROR404})
    }

    next();

}