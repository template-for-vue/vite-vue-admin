import type {App} from 'vue';
import {useSetting} from "/@/shared/setting/hook/useSetting";
import {vueErrorHandler} from "/@/shared/error-handler/handler/vueErrorHandler";
import {scriptErrorHandler} from "/@/shared/error-handler/handler/scriptErrorHandler";
import {setupPromiseErrorHandler} from "/@/shared/error-handler/handler/setupPromiseErrorHandler";
import {setupResourceErrorHandler} from "/@/shared/error-handler/handler/setupResourceErrorHandler";


export const setupErrorHandler = (app: App<Element>) => {

    const {projectSetting: {useErrorHandler}} = useSetting();
    if (!useErrorHandler) return;

    // Vue exception monitoring;
    app.config.errorHandler = vueErrorHandler;

    // script error
    window.onerror = scriptErrorHandler

    // promise exception
    setupPromiseErrorHandler()

    // static resource exception
    setupResourceErrorHandler()


    //可以定时将错误上传至服务器
}