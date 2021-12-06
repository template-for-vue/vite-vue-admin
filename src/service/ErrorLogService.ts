import type {ErrorLogInfo} from "/@/shared/error-handler/types";
import {formatToDateTime} from "/@/shared/utils/date";
import {useCache} from "/@/shared/cache/useCache";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";

const {getLocal, setLocal} = useCache();

const ERROR_LOG_INFO_LIST_CACHE = 'ERROR_LOG_INFO_LIST_CACHE__';
const ERROR_LOG_INFO_COUNT_CACHE = 'EERROR_LOG_INFO_COUNT_CACHE__';

const getErrorLogInfoListCache = () => {
    return getLocal<ErrorLogInfo[]>(ERROR_LOG_INFO_LIST_CACHE) ?? [];
}

const setErrorLogInfoListCache = (info: ErrorLogInfo[]) => {
    setLocal(ERROR_LOG_INFO_LIST_CACHE, info);
}

const getErrorLogInfoCountCache = () => {
    return getLocal<number>(ERROR_LOG_INFO_COUNT_CACHE) ?? 0;
}

const setErrorLogInfoCountCache = (count: number) => {
    setLocal(ERROR_LOG_INFO_COUNT_CACHE, count);
}

const setErrorLogCountInc = () => {
    const count = getErrorLogInfoCountCache();
    setErrorLogInfoCountCache(count + 1);
}

export const addErrorLogInfo = (info: ErrorLogInfo) => {
    const item = {...info, time: formatToDateTime(new Date())};
    const errorLogInfoList = [item, ...getErrorLogInfoListCache()];
    setErrorLogInfoListCache(errorLogInfoList);
    setErrorLogCountInc();
}

export const setErrorLogInfoCount = (count: number) => {
    setErrorLogInfoCountCache(count);
}

export const addHttpErrorInfo = (error: any) => {
    const errorInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX
    }
    if (error.response) {
        const {
            config: {url = '', data: params = '', method = 'get', headers = {}} = {},
            data = {}
        } = error.response
        errorInfo.url = url;
        errorInfo.name = 'Ajax Error!';
        errorInfo.file = '-';
        errorInfo.stack = JSON.stringify(data);
        errorInfo.detail = JSON.stringify({params, method, headers})
    }
    addErrorLogInfo(errorInfo as ErrorLogInfo);
}