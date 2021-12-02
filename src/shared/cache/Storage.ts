import {DEFAULT_CACHE_PREFIX, DEFAULT_CACHE_TIME} from "/@/shared/cache/token";

export const createStorage = (
    {
        prefixKey = DEFAULT_CACHE_PREFIX,
        storage = sessionStorage,
    } = {}
) => {

    const WebStorage = class WebStorage {
        private storage: Storage;
        private prefixKey: string;

        constructor() {
            this.storage = storage;
            this.prefixKey = prefixKey;
        }

        private getKey(key: string) {
            return `${this.prefixKey}${key}`.toUpperCase();
        }

        set(key: string, value: any, expire: Nullable<number> = DEFAULT_CACHE_TIME) {
            const stringData = JSON.stringify({
                value,
                expire: expire === null ? null : new Date().getTime() + expire * 1000
            })
            this.storage.setItem(this.getKey(key), stringData)
        }

        get(key: string, def: any = null): any {
            const realKey = this.getKey(key);
            const item = this.storage.getItem(realKey);
            if (item) {
                try {
                    const {value, expire} = JSON.parse(item);
                    if (expire === null || expire >= new Date().getTime()) {
                        return value;
                    }
                    this.remove(realKey);
                } catch (e) {
                    return def
                }
            }
            return def;
        }

        remove(key: string) {
            this.storage.removeItem(this.getKey(key));
        }

        clear() {
            this.storage.clear();
        }

        setCookie(name: string, value: any, expire: Nullable<number> = DEFAULT_CACHE_TIME) {
            document.cookie = this.getKey(name) + '=' + value + '; Max-Age=' + expire;
        }

        getCookie(name: string) {
            const arr = document.cookie.split('; ');
            for (let i = 0; i < arr.length; i++) {
                const arr2 = arr[i].split('=');
                if (arr2[0] === this.getKey(name)) {
                    return arr2[1]
                }
            }
            return ''
        }

        removeCookie(name: string) {
            this.setCookie(name, 1, -1);
        }

        clearCookie() {
            const keys = document.cookie.match(/[^ =;]+(?==)/g);
            if (keys) {
                for (let i = keys.length; i--;) {
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
                }
            }
        }
    }

    return new WebStorage();
}

