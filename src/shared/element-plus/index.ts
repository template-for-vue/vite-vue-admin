import type {App} from 'vue';
import {ElButton, ElDivider} from 'element-plus';

export const setupElementPlus = (app: App<Element>) => {
    app.use(ElButton).use(ElDivider);
    app.config.globalProperties.$ELEMENT = {size: 'small'}
}