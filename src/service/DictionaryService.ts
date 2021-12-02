import {useCache} from "/@/shared/cache/useCache";
import {selectDictionaryKeyApi} from "/@/api/DictionaryApi";
import {isNullOrUnDef} from "/@/shared/utils/is";

type TDictionaryKey =
    | 'AUTH_TYPE'
    | 'JUDGE'
    | 'LOG_TYPE'
    | 'STATE'
    | 'ORDER_STATUS'
    | 'BARCODE_ORDER_TYPE'
    | 'VERIFY_STATE'

export interface IDictionary {
    name: string;
    value: string | number;
    status: 'primary' | 'success' | 'danger' | 'info' | 'warning'
}

export type IDictionaryItem = Record<string | number, IDictionary>;
export type IDictionaryList = Record<string | number, IDictionaryItem>;

const {sessionCache} = useCache()


/**
 * 根据code获取常量列表，不传code获取所有常量
 * {
 *     CODE:{
 *         CODE:{name,value,status}
 *     }
 * }
 * 或者
 * {
 *    CODE:{name,value,status}
 * }
 * @param code
 */
export const getDictionaryCodeMapStore = async (code?: TDictionaryKey) => {
    const result: IDictionaryList = await (sessionCache(selectDictionaryKeyApi)());
    return (code ? result[code] : result) || {}
}

/**
 * 根据code 或者 code + value 获取常量列表
 * {
 *     1:{name,value,status},
 *     2:{name,value,status},
 * } 或者
 * { name,value,state }
 * @param code
 * @param value
 */
export const getDictionaryValueMapStore = async (code: TDictionaryKey, value?: string | number) => {
    const dictionary = await getDictionaryCodeMapStore(code);
    const result: IDictionaryItem = {};
    Object.values(dictionary).forEach((item: any) => {
        result[item.value] = item
    });
    return isNullOrUnDef(value) ? result : result[value]
}

/**
 * 获取变量文字描述
 * @param code
 * @param key
 */
export const getDictionaryNameStore = async (code: TDictionaryKey, key: string) => {
    const dictionary = await getDictionaryCodeMapStore(code);
    return dictionary[key] ? dictionary[key]['name'] || '' : ''
}

/**
 * 获取变量值
 * @param code
 * @param key
 */
export const getDictionaryValueStore = async (code: TDictionaryKey, key: string) => {
    const dictionary = await getDictionaryCodeMapStore(code);
    return dictionary[key] ? dictionary[key]['value'] || '' : ''
}