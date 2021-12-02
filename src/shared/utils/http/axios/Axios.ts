import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CreateAxiosOptions, RequestOptions, Result } from '/@/shared/utils/http/axios/types';
import { isFunction } from '/@/shared/utils/is';
import { AxiosCanceler } from '/@/shared/utils/http/axios/AxiosCanceler';
import {RequestMethodEnum} from "/@/shared/utils/http/HttpEnum";
import { deepClone } from '/@/shared/utils';

export class Axios {
    private axiosInstance: AxiosInstance;
    private options: CreateAxiosOptions;

    constructor(options: CreateAxiosOptions) {
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setupInterceptors();
    }


    /**
     * 获取axios实例
     */
    public getAxios() {
        return this.axiosInstance;
    }

    /**
     * 重新配置axios
     * @param options
     */
    public configAxios(options: CreateAxiosOptions) {
        if (!this.axiosInstance) return;
        this.createAxios(options);
    }

    /**
     * 请求方法
     * @param config
     * @param options
     */
    public request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        let conf: AxiosRequestConfig = deepClone(config);
        const transform = this.getTransform();
        const { requestOptions } = this.options;
        const opt: RequestOptions = Object.assign({}, requestOptions, options);
        const { beforeRequestHook, transformRequestData, requestCatch } = transform || {};

        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (transformRequestData && isFunction(transformRequestData)) {
                        res = transformRequestData(res, opt);
                    }
                    resolve((res as unknown) as Promise<T>);
                })
                .catch((error: Error) => {
                    if (requestCatch && isFunction(requestCatch)) {
                        return reject(requestCatch(error));
                    }
                    reject(error);
                });
        });

    }

    public get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        config.method = RequestMethodEnum.GET;
        return this.request(config, options);
    }

    public post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        config.method = RequestMethodEnum.POST;
        return this.request(config, options);
    }

    /**
     * 创建axios实例
     * @param options
     */
    private createAxios(options: CreateAxiosOptions): void {
        this.axiosInstance = axios.create(options);
    }

    /**
     * 获取数据处理类
     */
    private getTransform() {
        const { transform } = this.options;
        return transform;
    }

    /**
     * 设置化拦截器
     */
    private setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) return;

        const {
            requestInterceptors,
            requestInterceptorsCatch,
            responseInterceptors,
            responseInterceptorsCatch
        } = transform;

        const axiosCanceler = new AxiosCanceler();

        //请求拦截器配置处理
        this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
            const { headers: { ignoreCancelToken } = { ignoreCancelToken: false } } = config;
            !ignoreCancelToken && axiosCanceler.addPending(config);

            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config);
            }
            return config;
        }, undefined);

        //请求拦截器错误捕获
        requestInterceptorsCatch &&
        isFunction(requestInterceptorsCatch) &&
        this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

        //响应结果拦截
        this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
            res && axiosCanceler.removePending(res.config);
            return responseInterceptors && isFunction(responseInterceptors) ? responseInterceptors(res) : res;
        }, undefined);

        //响应结果拦截器错误捕获
        responseInterceptorsCatch &&
        isFunction(responseInterceptorsCatch) &&
        this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
    }
}
