import {addErrorLogInfo} from "/@/service/ErrorLogService";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";

export const setupPromiseErrorHandler = () => {
    window.addEventListener(
        'unhandledrejection',
        function (event) {
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