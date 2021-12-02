import {isInWhiteList} from "/@/router/whiteList";
import {wxLoginApi} from "/@/api/LoginApi";

export const order = 2;
export const beforeEach = async ({to, next}: any) => {
    const {path, query} = to;
    if (!isInWhiteList(path) && query.code && query.state === 'WX_WORK_LOGIN') {
        await wxLoginApi({code: query.code});
        delete to.query.code;
        delete to.query.state;
        delete to.query.appid;
        return next(to);
    }
    next();
}