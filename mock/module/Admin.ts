import type {MockMethod} from 'vite-plugin-mock';
import {resultSuccess} from "../utils";
import {adminList} from "../data";

export default [
    {
        url: '/selectAdminPage',
        method: 'get',
        // statusCode:500,
        response: ({query}: any) => {
            const params = query?.params ? JSON.parse(query.params) : {};
            const {value, state: query_state, role_id} = params;
            let list: any[] = adminList;

            list = list.filter(({real_name, mobile, state, roles}) => {
                let condition = true;
                if (value) {
                    condition = real_name.indexOf(value) > -1 || mobile.indexOf(value) > -1;
                }
                if (query_state) {
                    condition = condition && state == query_state;
                }
                if (role_id) {
                    condition = condition && roles.indexOf(role_id) > -1;
                }
                return condition
            })
            return resultSuccess({
                list, total: list.length
            })
        }
    },
    {
        url: '/selectAdminInfo',
        method: 'get',
        response: ({query}: any) => {
            const params = query?.params ? JSON.parse(query.params) : {};
            const {id} = params;
            let list: any[] = adminList;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].id === id) {
                    return resultSuccess({...list[i], password: ''})
                }
            }
            return resultSuccess({})
        }
    },
    {
        url: '/createAdmin',
        method: 'post',
        response: ({query}: any) => {
            const params = query?.params ? JSON.parse(query.params) : {};
            let list: any[] = adminList;
            params.mobile = '13333333333';
            params.real_name = '王开';
            params.state = 2;
            params.remark = 123;
            params.id = list[0].id + 1;
            params.roles = [];
            params.login_times = 0;
            list.push(params);
            return resultSuccess(list)
        }
    },
    {
        url: '/updateAdmin',
        method: 'post',
        response: ({query}: any) => {
            const params = query?.params ? JSON.parse(query.params) : {};
            let list: any[] = adminList;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].id === params.id) {
                    list[i] = Object.assign(list[i], query);
                    return resultSuccess(list)
                }
            }
            return resultSuccess({})
        }
    },
    {
        url: '/updateAdminForDelete',
        method: 'post',
        response: () => {
            let list: any[] = adminList;
            list.pop()
            return resultSuccess(list, {message: '模拟删除，只会删除最后一个'})
        }
    }
] as MockMethod[];