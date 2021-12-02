import type {App} from 'vue';
import type {Router, RouteRecordRaw} from 'vue-router';
import {createRouter, createWebHistory} from 'vue-router';
import {basicRoutes} from "/@/router/routes";
import {isFunction} from "/@/shared/utils/is";

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH as string),
    routes: basicRoutes as unknown as RouteRecordRaw[],
    strict: true,
    scrollBehavior: () => ({left: 0, top: 0})
})

//路由守卫
const guards = import.meta.globEager('./guard/**/*.ts');
const beforeGuards: any[] = [];
const afterGuards: any[] = [];
Object.keys(guards).forEach((key) => {
    const {beforeEach, afterEach, order} = guards[key];
    isFunction(beforeEach) && beforeGuards.push({order, beforeEach});
    isFunction(afterEach) && afterGuards.push({order, afterEach});
})

const createGuard = (router: Router) => {
    beforeGuards.sort((x, y) => x.order - y.order).forEach(({beforeEach}) => {
        router.beforeEach(async (to: any, from: any, next: any) => {
            await beforeEach({to, from, next})
        })
    })
    afterGuards.sort((x, y) => y.order - x.order).forEach((({afterEach}) => {
        router.afterEach(async (to: any, from: any) => {
            await afterEach({to, from});
        });
    }));
}


export const setupRouter = (app: App<Element>) => {
    app.use(router);
    createGuard(router)
}

export default router;