/**
 * 扁平化多维数组
 */
export const arrayFlat = (arr: []) => {
    return arr.reduce((prev: never, cur: never, _index: number, _arr: never[]): never => {
        return (prev as any).concat(Array.isArray(cur) ? arrayFlat(cur) : cur) as never;
    });
};

/**
 * 扁平化二维数组
 * @param arr
 */
export const arrayFlat2 = (arr: any[][]) => {
    return arr.reduce((prev: never, cur: never, _index: number, _arr: never[]) => (prev as any).concat(cur), []);
};

/**
 * 根据指定key将数组转成map
 * @param arr
 * @param key
 */
export const listToMap = (arr: any[], key: string) => {
    const _map:any = {};
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let _key: any = item[key];
        _map[_key] = _map[_key] ? [].concat(_map[_key]).concat(arr[i] as any) : arr[i];
    }
    return _map;
};

/**
 * 对象数组根据key去重
 * @param array
 * @param key
 */
export const duplicateRemove = (array:any[], key:string) => {
    const hash:any = {};
    return array.reduce((item, next) => {
        if (!hash[next[key]]) {
            hash[next[key]] = true;
            item.push(next);
        }
        return item;
    }, []);
};

