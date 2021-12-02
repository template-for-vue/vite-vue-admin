import {ADMIN_PASSWORD_SALT} from "/@/service/AdminService";
import {md5} from "/@/shared/utils/md5";
import {isLoginApi, loginApi} from "/@/api/LoginApi";
import {
    removeAuthStore,
    removeMenuStore,
    removeTicketStore,
    removeUserInfoStore,
    setAuthStore,
    setMenuStore,
    setTicketStore,
    setUserInfoStore
} from "/@/service/AuthRuleService";
import {getDictionaryValueStore} from "/@/service/DictionaryService";

/**
 * 登录并缓存相关内容
 * @param query
 */
export const login = async (query: Recordable) => {
    const password = query.password ? md5(`${query.password.toLowerCase()}${ADMIN_PASSWORD_SALT}`) : '';
    const {auth, menu, mobile, real_name, ticket} = await loginApi({...query, password});
    setMenuStore(menu);
    setAuthStore(auth);
    setUserInfoStore({mobile, real_name});
    setTicketStore(ticket);
}

/**
 * 退出登录，并清空相关内容
 */
export const logout = async () => {
    return new Promise((resolve) => {
        removeMenuStore();
        removeAuthStore();
        removeUserInfoStore();
        removeTicketStore();
        resolve(true);
    })
}

/**
 * 验证登录是否有效
 */
export const isLogin = async () => {
    const JUDGE_YES_VALUE = await getDictionaryValueStore('JUDGE', 'YES');
    return (await isLoginApi()) === JUDGE_YES_VALUE;
}