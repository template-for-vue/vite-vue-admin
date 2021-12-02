import {Page} from "/@/router/page";
import {AppRouteRecordRaw} from "/#/router";

const PAGE_DASHBOARD_WELCOME = () => import('/@/views/dashboard/Welcome.vue');
export default [
    {
        path: Page.DASHBOARD_WELCOME,
        component: PAGE_DASHBOARD_WELCOME,
        meta: {ignoreAuth: true}
    }
] as AppRouteRecordRaw[]