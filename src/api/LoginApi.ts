import {http} from '/@/shared/utils/http/axios';

/**
 * 获取管理员列表
 */
export const captchaApi = async () => {
    return await http.get({
        url: '/captcha'
    });
};


/**
 * 验证是否已登陆
 */
export const isLoginApi = async () => {
    return await http.get({
        url: '/isLogin'
    });
};

/**
 * 登陆
 */
export const loginApi = async (query: Recordable) => {
    return await http.post({
        url: '/login',
        data: query
    });
};

/**
 * 微信登陆
 */
export const wxLoginApi = async (query:Recordable) => {
    return await http.post({
        url: '/wxLogin',
        data: query
    });
};


