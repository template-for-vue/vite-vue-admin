import { Page } from '/@/router/page';
import {AppRouteRecordRaw} from "/#/router";

const PAGE_ERROR_404 = () => import('/@/views/exception/Err404.vue');

export const Error404Route = {
    name: 'ERROR404',
    path: Page.ERROR404,
    component: PAGE_ERROR_404,
    meta: { title: '404' }
};
export default [Error404Route] as AppRouteRecordRaw [];
