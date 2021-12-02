import {AppRouteRecordRaw} from "/#/router";
import {Page} from "/@/router/page";
import PAGE_LAYOUT from '/@/layout/Index.vue';
import PAGE_LOGIN from '/@/views/login/Login.vue';

let routeModuleList: AppRouteRecordRaw[] = [];
const modules = import.meta.globEager('./modules/**/*.ts');
Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
})

const RootRoute: AppRouteRecordRaw = {
    path: Page.ROOT,
    redirect: Page.DASHBOARD_WELCOME
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

// const unMatchRoute: AppRouteRecordRaw = {
//     path: Page.UN_MATCH,
//     redirect: ''
// }


export const basicRoutes = [
    RootRoute,
    LoginRoute,
    pageRoute,
    // unMatchRoute
];