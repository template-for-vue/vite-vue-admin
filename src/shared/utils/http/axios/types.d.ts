import type { AxiosRequestConfig } from 'axios';
import { AxiosTransform } from '/@/shared/utils/http/axios/AxiosTransform';

export interface RequestOptions {
    //是否处理请求结果
    isTransformRequestResult?: boolean;
    //接口地址
    apiUrl?: string;
    //接口前缀
    apiPrefix?: string;
    //是否使用接口地址前缀
    joinPrefix?: boolean;
    //错误消息提示类型
    errorMessageMode?: 'none' | 'modal';
    // 开启顶部进度条
    openNProgress?: boolean;
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
    transform?: AxiosTransform;
    requestOptions?: RequestOptions;
}


export interface Result<T = any> {
    code: string;
    message: string;
    data: T;
}
