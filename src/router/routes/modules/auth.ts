import {Page} from "/@/router/page";
import {AppRouteRecordRaw} from "/#/router";


export const PAGE_AUTH_ADMIN_LIST = () => import('/@/views/auth/admin/AdminList.vue');


export default [
    {
        path: Page.AUTH_ADMIN_LIST,
        component: PAGE_AUTH_ADMIN_LIST
    }
] as AppRouteRecordRaw[]