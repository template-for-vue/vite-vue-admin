import {useCache} from "/@/shared/cache/useCache";
import {createStorage} from "/@/shared/cache/Storage";
import {LOCAL_CACHE_KEY, SESSION_CACHE_KEY} from "/@/shared/cache/token";

const ls = createStorage({storage: localStorage});
const ss = createStorage();

export const setupCache = () => {
    const {initCache, getLocalStore, getSessionStore, clearAll, clearLocal, clearSession} = useCache();

    initCache();

    const unloadHandler = () => {
        const localCache = getLocalStore();
        const sessionCache = getSessionStore();
        ls.set(LOCAL_CACHE_KEY, localCache);
        ss.set(SESSION_CACHE_KEY, sessionCache);
    }

    window.removeEventListener('beforeunload', unloadHandler);
    window.addEventListener('beforeunload', unloadHandler);

    const storageChangeHandler = (e: any) => {
        const {key, newValue, oldValue} = e || {};
        if (!key) {
            return clearAll();
        }

        if (!!newValue && !!oldValue) {
            if (LOCAL_CACHE_KEY === key) clearLocal();
            if (SESSION_CACHE_KEY === key) clearSession();
        }
    }

    window.removeEventListener('storage', storageChangeHandler);
    window.addEventListener('storage', storageChangeHandler);

}