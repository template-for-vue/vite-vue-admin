import {md5} from "/@/shared/utils/md5";
import {createAdminApi, updateAdminApi} from "/@/api/AdminApi";

export const ADMIN_PASSWORD_SALT = 'x58sd00ql3k@xrv==';


export const createAdmin = async (query: Recordable) => {
    const password = query.password ? md5(`${query.password.toLowerCase()}${ADMIN_PASSWORD_SALT}`) : '';
    return await createAdminApi({...query, password})
}

export const updateAdmin = async (query: Recordable) => {
    const params = {...query};
    if (query.password) {
        params.password = md5(`${query.password.toLowerCase()}${ADMIN_PASSWORD_SALT}`)
    }
    return await updateAdminApi(params)
}