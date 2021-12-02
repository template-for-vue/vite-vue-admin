import type {App} from 'vue';

export const setupElementPlus = (app: App<Element>) => {
    app.config.globalProperties.$ELEMENT = { size: 'small' }
}