import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { isFunction } from '/@/shared/utils/is';

//存储每个请求标识和取消函数
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

export class AxiosCanceler {
    /**
     * 添加请求
     * @param config
     */
    addPending(config: AxiosRequestConfig) {
        this.removePending(config);
        const url = getPendingUrl(config);
        config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => !pendingMap.has(url) && pendingMap.set(url, cancel));
    }

    /**
     * 移除请求
     * @param config
     */
    removePending(config: AxiosRequestConfig): void {
        const url = getPendingUrl(config);
        if (pendingMap.has(url)) {
            const cancel = pendingMap.get(url);
            cancel && cancel(url);
            pendingMap.delete(url);
        }
    }

    /**
     * 清空所有请求
     */
    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && isFunction(cancel) && cancel();
        });
        pendingMap.clear();
    }

    /**
     * 重置
     */
    reset(): void {
        pendingMap = new Map<string, Canceler>();
    }
}
