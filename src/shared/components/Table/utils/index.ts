import {unref} from 'vue';

export function getDynamicProps<T, U>(props: T): Partial<U> {
    const ret: Recordable = {};

    Object.keys(props).map((key) => {
        ret[key] = unref((props as Recordable)[key]);
    });

    return ret as Partial<U>;
}

const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isObject(val: any): val is Record<any, any> {
    return val !== null && is(val, 'Object');
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
    return is(val, 'Number');
}

export function isString(val: unknown): val is string {
    return is(val, 'String');
}

export function isBoolean(val: unknown): val is boolean {
    return is(val, 'Boolean');
}

export function isDate(val: unknown): val is Date {
    return is(val, 'Date');
}

export function isRegExp(val: unknown): val is RegExp {
    return is(val, 'RegExp');
}

export function isFunction(val: unknown): val is Function {
    return typeof val === 'function';
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