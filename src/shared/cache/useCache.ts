import {createStorage} from "/@/shared/cache/Storage";
import {DEFAULT_CACHE_TIME, LOCAL_CACHE_KEY, SESSION_CACHE_KEY} from "/@/shared/cache/token";
import {warn} from "/@/shared/utils/log";
import {isDevMode} from "/@/shared/utils/env";
import {isNullOrUnDef} from "/@/shared/utils/is";


const ls = createStorage({storage: localStorage});
const ss = createStorage();

interface CacheStoreItem {
    value: any;
    expire: Nullable<Number>;
}

interface CacheStore {
    local?: Recordable<CacheStoreItem>;
    session?: Recordable<CacheStoreItem>;
}

interface CacheOptions {
    expire?: Nullable<Number>;
    key?: string;
}

const cacheStore: CacheStore = {
    local: {},
    session: {}
}

export const useCache = () => {

    const initCache = () => {
        cacheStore.local = ls.get(LOCAL_CACHE_KEY) || {};
        cacheStore.session = ss.get(SESSION_CACHE_KEY) || {};
    }

    const getLocalStore = () => cacheStore.local;

    const getSessionStore = () => cacheStore.session;

    const setLocal = (key: string, value: any, expire: Nullable<Number> = DEFAULT_CACHE_TIME) => {
        cacheStore.local = cacheStore.local || {};
        cacheStore.local[key] = {
            value,
            expire: expire === null ? null : new Date().getTime() + (expire as number) * 1000
        };
    }

    const getLocal = <T>(key: string): Nullable<T> => {
        try {
            const {value, expire = null} = cacheStore.local?.[key] || {};
            if (!isNullOrUnDef(value) && (expire === null || expire >= new Date().getTime())) {
                return value as any;
            } else {
                removeLocal(key)
            }
        } catch (e) {

        }
        return null;
    }

    const removeLocal = (key: string) => {
        if (cacheStore.local) {
            Reflect.deleteProperty(cacheStore.local, key)
        }
    }

    const clearLocal = () => {
        cacheStore.local = {}
    }

    const setSession = (key: string, value: any, expire: Nullable<Number> = DEFAULT_CACHE_TIME) => {
        cacheStore.session = cacheStore.session || {};
        cacheStore.session[key] = {
            value,
            expire: expire === null ? null : new Date().getTime() + (expire as number) * 1000
        };
    }

    const getSession = <T>(key: string): Nullable<T> => {
        try {
            const {value, expire = null} = cacheStore.session?.[key] || {};
            if (!isNullOrUnDef(value) && (expire === null || expire >= new Date().getTime())) {
                return value as any;
            } else {
                removeSession(key);
            }
        } catch (e) {

        }
        return null;
    }

    const removeSession = (key: string) => {
        if (cacheStore.session) {
            Reflect.deleteProperty(cacheStore.session, key)
        }
    }

    const clearSession = () => {
        cacheStore.session = {}
    }

    const clearAll = () => {
        clearLocal();
        clearSession();
    }

    const localCache = <T = any>(callback: Function, options: CacheOptions = {}) => {
        let {expire = DEFAULT_CACHE_TIME, key} = options;
        key = key || callback.name;
        if (isDevMode() && isNullOrUnDef(key)) {
            warn('The callback must have a name! or U need to set a key');
            return () => null;
        }

        return async (query: Recordable = {}) => {
            const sn = Object.keys(query).length > 0 ? `:${JSON.stringify(query)}` : '';
            key = `${key}${sn}`;
            let result = getLocal<T>(key);
            if (isNullOrUnDef(result)) {
                result = await callback(query);
                if (!isNullOrUnDef(result)) {
                    setLocal(key, result, expire)
                }
            }
            return result;
        }
    }

    const sessionCache = <T = any>(callback: Function, options: CacheOptions = {}) => {
        let {expire = DEFAULT_CACHE_TIME, key} = options;
        key = key || callback.name;
        if (isDevMode() && isNullOrUnDef(key)) {
            warn('The callback must have a name! or U need to set a key');
            return () => null;
        }
        return async (query: Recordable = {}) => {
            const sn = Object.keys(query).length > 0 ? `:${JSON.stringify(query)}` : '';
            key = `${key}${sn}`;
            let result = getSession<T>(key);
            if (isNullOrUnDef(result)) {
                result = await callback(query);
                if (!isNullOrUnDef(result)) {
                    setSession(key, result, expire)
                }
            }
            return result;
        }
    }


    return {
        initCache,
        getLocalStore,
        getSessionStore,
        setLocal,
        getLocal,
        removeLocal,
        clearLocal,
        setSession,
        getSession,
        removeSession,
        clearSession,
        clearAll,
        localCache,
        sessionCache
    }


}