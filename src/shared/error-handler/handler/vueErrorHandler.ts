import {addErrorLogInfo} from "/@/service/ErrorLogService";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";
import {processStackMessage} from "/@/shared/error-handler/utils";
import {isDevMode} from "/@/shared/utils/env";
import {isString} from "/@/shared/utils/is";

function formatComponentName(vm: any) {
    if (vm.$root === vm) {
        return {
            name: 'root',
            path: 'root'
        }
    }
    const options = vm.$options as any;
    if (!options) {
        return {
            name: 'anonymous',
            path: 'anonymous'
        }
    }
    const name = options.name || options._componentTag;

    return {
        name,
        path: options.__file
    }
}

export function vueErrorHandler(err: Error, vm: any, info: string) {
    if(isString(err)) return;
    const {name, path} = formatComponentName(vm);
    if(isDevMode()){
        console.error(err);
    }
    addErrorLogInfo({
        type: ErrorTypeEnum.VUE,
        name,
        file: path,
        message: err.message ?? err,
        stack: processStackMessage(err),
        detail: info,
        url: window.location.href
    })
}