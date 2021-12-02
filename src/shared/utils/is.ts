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

export function isEmpty(v: any): boolean {
    if (v && typeof v === 'object') {
        return Object.keys(v).length === 0;
    } else if (Array.isArray(v)) {
        return v.length === 0;
    }
    return !v;
}

export const isNotEmpty = (v: any) => !isEmpty(v);

export const isZero = (val:any) => {
    return val === 0 || val === '0';
};

/**
 * 是否外链
 * @param str
 */
export const isOutLink = (str: string): boolean => {
    return str.indexOf('http://') > -1 || str.indexOf('https://') > -1;
};