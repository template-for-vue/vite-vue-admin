import type {ErrorLogInfo} from "/@/shared/error-handler/types";
import {formatToDateTime} from "/@/shared/utils/date";
import {useCache} from "/@/shared/cache/useCache";
import {ErrorTypeEnum} from "/@/shared/error-handler/enums";
import {useSetting} from "/@/shared/setting/hook/useSetting";

const {getSession, setSession} = useCache();

const ERROR_LOG_INFO_CACHE = 'ERROR_LOG_INFO_CACHE__';

const getErrorLogInfoListCache = () => {
    return getSession<ErrorLogInfo[]>(ERROR_LOG_INFO_CACHE) ?? [];
}

const setErrorLogInfoListCache = (info: ErrorLogInfo[]) => {
    setSession(ERROR_LOG_INFO_CACHE, info);
}

export const addErrorLogInfo = (info: ErrorLogInfo) => {
    const item = {...info, time: formatToDateTime(new Date())};
    const errorListCache = getErrorLogInfoListCache();
    const errorLogInfoList = [item, ...errorListCache];

    if (errorListCache.some(info => {
        const {url, message, type, detail} = info;
        let isSameRequest = false;
        if (type === ErrorTypeEnum.HTTP && item.type === ErrorTypeEnum.HTTP) {
            isSameRequest = detail === item.detail;
        }
        return isSameRequest && url === item.url && message === item.message;
    })) {
        return;
    }

    setErrorLogInfoListCache(errorLogInfoList);
}

export const addHttpErrorInfo = (error: any) => {

    const {projectSetting: {useErrorHandler}} = useSetting();
    if (useErrorHandler && error.response) {
        const errorInfo: Partial<ErrorLogInfo> = {
            type: ErrorTypeEnum.HTTP,
            message: error.message,
        }
        const {
            config,
            data = {}
        } = error.response
        errorInfo.url = config.url;
        errorInfo.name = 'Http Error!';
        errorInfo.file = '-';
        errorInfo.stack = data ? JSON.stringify(data) : '-';
        errorInfo.detail = JSON.stringify({
            params: config?.params ?? decodeURIComponent(config?.data || '') ?? '',
            method: config.method ?? 'get',
            headers: config.headers
        });
        addErrorLogInfo(errorInfo as ErrorLogInfo);
    }
}