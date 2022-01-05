import {unref} from 'vue';
import {isArray, isDate, isNullOrUnDef, isObject, isRegExp} from "/@/shared/utils/is";

export function getDynamicProps<T, U>(props: T): Partial<U> {
    const ret: Recordable = {};

    Object.keys(props).map((key) => {
        ret[key] = unref((props as Recordable)[key]);
    });

    return ret as Partial<U>;
}


export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key of Object.keys(target)) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

export function deepClone(target: any): any {
    if (isNullOrUnDef(target)) return target;
    if (isDate(target)) return new Date(target);
    if (isRegExp(target)) return new RegExp(target);
    let clone: any = target;
    if (isArray(target)) {
        clone = [];
        for (let i = 0; i < target.length; i++) {
            clone.push(deepClone(target[i]));
        }
    } else if (isObject(target)) {
        clone = {};
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                clone[key] = deepClone(target[key]);
            }
        }
    }
    return clone;
}

export function upperFirst(str: string): string {
    return str.length > 0 ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : str;
}

export const sleep = (time = 1000) => {
    return new Promise((resolve) => setTimeout(() => {
        resolve('wakeup');
    }, time));
};

// 比较2个简单数组是否相同
export const isEqual = (arr1: (string | number)[], arr2: (string | number)[]): Boolean => {
    let arr1Length = arr1.length;
    if (arr1Length !== arr2.length) return false;
    for (let i = 0; i < arr1Length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

/**
 * 优化JSON解析方法
 * @param str
 * @returns {*}
 */
export const jsonParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};