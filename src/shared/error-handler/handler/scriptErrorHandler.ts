import {ErrorLogInfo} from "/@/shared/error-handler/types";
import {addErrorLogInfo} from "/@/service/ErrorLogService";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";
import {isDevMode} from "/@/shared/utils/env";

export const scriptErrorHandler = (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
) => {
    if (event === 'Script error.' && !source) {
        return false;
    }
    if (isDevMode()) console.error(error);
    const errorInfo: Partial<ErrorLogInfo> = {};
    colno = colno || (window.event && (window.event as any).errorCharacter) || 0;
    errorInfo.message = event as string;
    errorInfo.stack = error?.stack ? error.stack : ''
    const name = source ? source.substr(source.lastIndexOf('/') + 1) : 'script';
    addErrorLogInfo({
        type: ErrorTypeEnum.SCRIPT,
        name,
        file: source as string,
        detail: `lineno:${lineno},colno:${colno}`,
        url: window.location.href,
        ...(errorInfo as Pick<ErrorLogInfo, 'message' | 'stack'>)
    })
    return true;
}