import type {RouteRecordRaw, RouteMeta} from 'vue-router';

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name?: string;
    meta?: RouteMeta;
    component?: Component | string;
    components?: Component;
    children?: AppRouteRecordRaw[];
    props?: Recordable;
    fullPath?: string
}


export type AppRouteModule = AppRouteRecordRaw;