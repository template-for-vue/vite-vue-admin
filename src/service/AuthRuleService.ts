import {useCache} from "/@/shared/cache/useCache";
import {selectAuthApi, selectAuthMenuApi} from "/@/api/AuthRuleApi";

export interface MenuItem {
    id: number;
    pid: number;
    rule_title: string;
    rule_code: string;
    rule_icon?: string;
    children?: MenuItem[];
    parent?: MenuItem[];
    link?: string
    is_active?: any;
    is_expand?: any;
}

export const USER_CACHE_KEY = 'USER_CACHE_KEY__';
export const TICKET_CACHE_KEY = 'TICKET_CACHE_KEY__';

const {sessionCache, setSession, removeSession, getSession} = useCache();


// +----------------------------------------------------------------------
// | 菜单缓存操作
// +----------------------------------------------------------------------

export const getMenuStore = async () => {
    return (await sessionCache(selectAuthMenuApi)())
}
export const setMenuStore = (menu: MenuItem[]) => {
    setSession('selectAuthMenuApi', menu)
}

export const removeMenuStore = () => {
    removeSession('selectAuthMenuApi')
}

export const getMenuCache = <T>() => {
    return getSession<T>('selectAuthMenuApi');
}


// +----------------------------------------------------------------------
// | 权限缓存操作
// +----------------------------------------------------------------------

export const getAuthStore = async () => {
    return (await sessionCache(selectAuthApi)())
}

export const setAuthStore = (auth: string[]) => {
    setSession('selectAuthApi', auth)
}

export const removeAuthStore = () => {
    removeSession('selectAuthApi')
}

export const getAuthCache = <T>() => {
    return getSession<T>('selectAuthApi');
}

// +----------------------------------------------------------------------
// | 用户信息缓存操作
// +----------------------------------------------------------------------

export const getUserInfoStore = (key: string) => {
    const user: Recordable = getSession(USER_CACHE_KEY) || {};
    return key ? user[key] || '' : user;
}

export const setUserInfoStore = (info: any) => {
    setSession(USER_CACHE_KEY, info);
};

export const removeUserInfoStore = () => {
    return removeSession(USER_CACHE_KEY);
};

// +----------------------------------------------------------------------
// | ticket缓存操作
// +----------------------------------------------------------------------
export const setTicketStore = (ticket: string) => {
    ticket && setSession(TICKET_CACHE_KEY, ticket);
};

export const getTicketStore = () => {
    return getSession(TICKET_CACHE_KEY) as string;
};

export const removeTicketStore = () => {
    return removeSession(TICKET_CACHE_KEY);
};