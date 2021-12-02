import type {MockMethod} from 'vite-plugin-mock';
import {resultSuccess} from "../utils";
import {auth, menu} from "../data";

export default [
    {
        url: '/selectAuth',
        method: 'get',
        response: () => {
            return resultSuccess(auth)
        }
    },
    {
        url: '/selectAuthMenu',
        method: 'get',
        response: () => {
            return resultSuccess(menu)
        }
    }
] as MockMethod[];