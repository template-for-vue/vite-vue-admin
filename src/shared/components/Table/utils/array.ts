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
    const _map: any = {};
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
export const duplicateRemove = (array: any[], key: string) => {
    const hash: any = {};
    return array.reduce((item, next) => {
        if (!hash[next[key]]) {
            hash[next[key]] = true;
            item.push(next);
        }
        return item;
    }, []);
};

/**
 * 二元笛卡尔 数组
 * @param arr1
 * @param arr2
 */
export const combineArr = (arr1: any[], arr2: any[]) => {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        let item1 = arr1[i];
        for (let j = 0; j < arr2.length; j++) {
            let temp = Array.isArray(item1) ? [...item1] : [item1];
            temp.push(arr2[j]);
            result.push(temp);
        }
    }
    return result;
};


/**
 * 多元笛卡尔 数组
 * @returns {*}
 */
export const cartesian = (...list: any[]) => {
    const length = list.length;
    let result = [];
    if (length === 0) {
        return [];
    } else if (length === 1) {
        for (let i = 0; i < list[0].length; i++) {
            result.push([list[0][i]]);
        }
    } else {
        result = list[0];
        for (let i = 1; i < length; i++) {
            result = combineArr(result, list[i]);
        }
    }
    return result;
};

