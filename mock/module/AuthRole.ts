import type {MockMethod} from 'vite-plugin-mock';
import {resultSuccess} from "../utils";
import {authRoleOption} from "../data";

export default [
    {
        url: '/selectAuthRoleOption',
        method: 'get',
        response: () => {
            return resultSuccess(authRoleOption)
        }
    }
] as MockMethod[];