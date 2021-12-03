import {AppRouteRecordRaw} from "/#/router";
import {Page} from "/@/router/page";
import PAGE_LAYOUT from '/@/layout/Index.vue';
import PAGE_LOGIN from '/@/views/login/Login.vue';
import {Error404Route} from "/@/router/routes/modules/error";

let routeModuleList: AppRouteRecordRaw[] = [];
const modules = import.meta.globEager('./modules/**/*.ts');
Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
})

const RootRoute: AppRouteRecordRaw = {
    path: Page.ROOT,
    redirect: Page.LOGIN
}
const LoginRoute: AppRouteRecordRaw = {
    path: Page.LOGIN,
    component: PAGE_LOGIN
}

const pageRoute: AppRouteRecordRaw = {
    path: Page.ROOT,
    component: PAGE_LAYOUT,
    children: routeModuleList
}

const unMatchRoute: AppRouteRecordRaw = {
    path: Page.UN_MATCH,
    redirect: Error404Route
}


export const basicRoutes = [
    RootRoute,
    LoginRoute,
    pageRoute,
    unMatchRoute
];