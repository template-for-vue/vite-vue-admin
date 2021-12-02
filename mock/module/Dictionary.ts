import type {MockMethod} from 'vite-plugin-mock';
import {resultSuccess} from "../utils";
import {dictionary} from "../data";

export default [
    {
        url: '/selectDictionaryKey',
        method: 'get',
        response: () => {
            return resultSuccess(dictionary)
        }
    }
] as MockMethod[];