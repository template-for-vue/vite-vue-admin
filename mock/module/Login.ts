import type {MockMethod} from 'vite-plugin-mock';
import {resultSuccess} from "../utils";
import {auth, menu, userInfo} from "../data";

export default [
    {
        url: '/captcha',
        method: 'get',
        response: () => {
            return resultSuccess({
                image: 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAoBAMAAAD+o5JNAAAAG1BMVEX///9dXV3W1tbCwsKZmZmFhYWurq5xcXHq6uqTnUBQAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABqUlEQVRIie2UTU/CQBCG1xZxj77SUo/1K+GIYoLHAtF4hGDUY0lM4EiVcMYY4t92pt1udxNo68Gbc2imm3l23p2ZXSH+7U+sVyvq66bw5dyvg1wBY40MgE010gDQVr4zoZ+wmqGdEWSum5BfI0+Tw5C5KeJVp/mEf6HyHBLxjJNqZoalRCtPOWzguJqZIKb939l1sBAHiGowQSfJi9AV4hpxabjTC6lsseCTd9XaQHupydBGuDFD0RHigbqaK0rsUn971q/g/mWxjp4EabdHJrCgrDG+YlQeR7UqT8P9MqAjYJXwQS5ZpdLtWozMmrwxGI+Dx1uMBsiHuWlpozT3BLUMbR5vO00lnu5iKE2bp36ZL5CP6Ry4YyQICybUDKVZh6Kvd3EAVYMZfV+NwsSFEm52t7i4VAGfi/3I+j50mGucOEwh49qekXDSG3HKTrHstIvjBIu0H5HF0HCVDL7kRm9hzDlpW58n+lLvMtCOblHStHlsZReMLv2ob1Sah55tvB9hKWyxIZffDn9TwsiJHkhtty+r7p7wzNKXKyoN2ZHp7WnxS+TfDPsBZfk9b4Q90f4AAAAASUVORK5CYII=',
                sn: '17cc86fe5112995b1fc601d6c97dc67f'
            })
        }
    }, {
        url: '/isLogin',
        method: 'get',
        response: ({query}: any) => {
            return resultSuccess(!!(query && query.params && JSON.parse(query.params)?.ticket));
        }
    }, {
        url: '/login',
        method: 'post',
        response: () => {
            return resultSuccess({
                ...userInfo,
                auth,
                menu
            })
        }
    }
] as MockMethod[];