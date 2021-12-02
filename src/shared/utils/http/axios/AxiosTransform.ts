import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '/@/shared/utils/http/axios/types';

export abstract class AxiosTransform {

    /**
     * 请求拦截器
     */
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;

    /**
     * 请求拦截器错误处理
     */
    requestInterceptorsCatch?: (error: Error) => void;

    /**
     * 响应拦截器
     */
    responseInterceptors?: (response: AxiosResponse<any>) => AxiosResponse<any>;

    /**
     * 响应拦截器错误处理
     */
    responseInterceptorsCatch?: (error: Error) => void;

    /**
     * 请求前配置处理
     */
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

    /**
     * 请求成功数据处理
     */
    transformRequestData?: (response: AxiosResponse<Result>, options: RequestOptions) => any;

    /**
     * 请求失败处理
     */
    requestCatch?: (error: Error) => Promise<any>;
}

