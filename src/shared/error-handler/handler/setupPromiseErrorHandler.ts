import {addErrorLogInfo} from "/@/service/ErrorLogService";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";
import {isDevMode} from "/@/shared/utils/env";

export const setupPromiseErrorHandler = () => {
    window.addEventListener(
        'unhandledrejection',
        function (event) {
            if(isDevMode()) {
                console.error(event);
            }
            addErrorLogInfo({
                type: ErrorTypeEnum.PROMISE,
                name: 'Promise Error!',
                file: '-',
                detail: '-',
                url: window.location.href,
                stack: '-',
                message: event.reason
            })
        },
        true
    )
}