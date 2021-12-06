import type {AxiosResponse} from 'axios';
import type {CreateAxiosOptions, RequestOptions, Result} from '/@/shared/utils/http/axios/types';
import {AxiosTransform} from '/@/shared/utils/http/axios/AxiosTransform';
import qs from 'qs';
import {isString} from '/@/shared/utils/is';
import {ContentTypeEnum, ResponseEnum} from '/@/shared/utils/http/HttpEnum';
import {useSetting} from "/@/shared/setting/hook/useSetting";
import {Axios} from '/@/shared/utils/http/axios/Axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '/@/assets/style/nprogress.scss';
import {useRouter} from '/@/shared/hooks/web/useRouter';
import {Page} from '/@/router/page';
import {getTicketStore} from "/@/service/AuthRuleService";
import {useAlert} from "/@/shared/components/hook/alert/useAlert";
import {useMessage} from "/@/shared/components/hook/useMessage/useMessage";
import {addHttpErrorInfo} from "/@/service/ErrorLogService";

const {createAlert} = useAlert();
const {createErrorMessage, createSuccessMessage} = useMessage();
const {navigateTo} = useRouter();
const {globSetting} = useSetting();

const transform: AxiosTransform = {

    /**
     * 请求前处理配置
     * @param config
     * @param options
     */
    beforeRequestHook: (config, options) => {
        const {joinPrefix, apiUrl, apiPrefix} = options;
        if (joinPrefix && apiPrefix && isString(apiPrefix)) config.url = `${apiPrefix}${config.url}`;
        if (apiUrl && isString(apiUrl)) config.url = `${apiUrl}${config.url}`;

        const ticket = getTicketStore();
        if (ticket) {
            if (config.method === 'GET') config.params = Object.assign({}, config.params, {ticket});
            if (config.method === 'POST') config.data = Object.assign({}, config.data, {ticket});
        }
        if (config.data) {
            config.data = qs.stringify({params: JSON.stringify(config.data)});
        }
        if (config.params) {
            config.params = {params: JSON.stringify(config.params)};
        }
        return config;
    },

    /**
     * 请求拦截
     * @param config
     */
    requestInterceptors: (config: CreateAxiosOptions) => {
        const {requestOptions} = config;
        if (requestOptions?.openNProgress && !NProgress.isStarted()) NProgress.start();
        return config;
    },

    /**
     * 响应拦截
     * @param response
     */
    responseInterceptors: (response) => {
        if (NProgress.isStarted()) NProgress.done();
        return response;
    },

    /**
     * 响应数据处理
     * @param response
     * @param options
     */
    transformRequestData: async (response: AxiosResponse<Result>, options: RequestOptions) => {
        const {isTransformRequestResult, errorMessageMode} = options;
        if (!isTransformRequestResult) return response.data;
        const {data} = response;
        if (!data) return {};

        const {code, message, data: result} = data;

        //请求成功
        if (code === ResponseEnum.SUCCESS) {
            if (response.config.method === 'post') {
                createSuccessMessage();
            }
            return result;
        }

        //请求错误
        switch (code) {
            case ResponseEnum.UN_PASS:
                createErrorMessage('登陆已过期,请重新登陆!');
                navigateTo(Page.LOGIN);
                break;
            case ResponseEnum.UN_AUTHORIZED:
                createErrorMessage('没有访问权限!');
                navigateTo(Page.LOGIN);
                break;
            case ResponseEnum.ERROR:
                if (errorMessageMode === 'modal') {
                    await createAlert({message});
                } else {
                    createErrorMessage(message);
                }
        }
        return Promise.reject(false);
    },

    /**
     * 响应错误捕获
     * @param error
     */
    responseInterceptorsCatch: (error: any) => {
        const {code, message} = error || {};
        const err: string = error.toString();
        addHttpErrorInfo(error);
        try {
            if (code === 'ECONNABORTED' && ~message.indexOf('timeout')) {
                createErrorMessage('请求超时,请刷新重试!');
            }
            if (err && err.includes('Network Error')) {
                return createAlert({ message: '请检查您的网络连接是否正常' });
            }
        } catch (e) {
            throw new Error(error);
        }
        if (NProgress.isStarted()) NProgress.done();
        createErrorMessage(message || '操作失败');
        return Promise.reject(message);
    }
};

function createAxios() {
    return new Axios({
        timeout: 10000,
        headers: {'Content-Type': ContentTypeEnum.FORM_URLENCODED},
        transform,
        requestOptions: {
            joinPrefix: true,
            isTransformRequestResult: true,
            errorMessageMode: 'none',
            apiUrl: globSetting.apiUrl,
            apiPrefix: globSetting.apiPrefix,
            openNProgress: true
        }
    });
}

export const http = createAxios();
