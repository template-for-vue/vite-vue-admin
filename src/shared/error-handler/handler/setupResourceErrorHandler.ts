import {addErrorLogInfo} from "/@/service/ErrorLogService";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";

export const setupResourceErrorHandler = () => {
    window.addEventListener(
        'error',
        function (event: Event) {

            const target = event.target ? event.target : (event.srcElement as any);
            addErrorLogInfo({
                type: ErrorTypeEnum.RESOURCE,
                name: 'Resource Error!',
                file: (event.target || ({} as any)).currentSrc,
                detail: JSON.stringify({
                    tagName: target.localName,
                    html: target.outerHTML,
                    type: event.type
                }),
                url: window.location.href,
                stack: 'resource is not found!',
                message: (event.target || ({} as any)).localName + ' is load error'
            })
        },
        true
    )
}