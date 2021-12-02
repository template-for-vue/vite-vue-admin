declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'virtual:*' {
    const result: any;
    export default result;
}

declare module 'qs';
declare module 'element-plus/*';
declare module 'unplugin-vue-components';
declare module 'element-plus/theme-chalk/src/common/var.scss';
