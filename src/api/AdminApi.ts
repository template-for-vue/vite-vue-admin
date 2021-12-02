import {http} from '/@/shared/utils/http/axios';

/**
 * 获取管理员列表
 * @param query
 */
export const selectAdminPageApi = async (query: Recordable) => {
    return await http.get({
        url: '/selectAdminPage',
        params: query
    });
};

/**
 * 获取管理员详情
 * @param query
 */
export const selectAdminInfoApi = async (query: Recordable) => {
    return await http.get({
        url: '/selectAdminInfo',
        params: query
    });
};


/**
 * 创建管理员
 * @param query
 */
export const createAdminApi = async (query: Recordable) => {
    return await http.post({
        url: '/createAdmin',
        data: query
    });
};

/**
 * 编辑管理员
 * @param query
 */
export const updateAdminApi = async (query: Recordable) => {
    return await http.post({
        url: '/updateAdmin',
        data: query
    });
};


/**
 * 删除
 * @param query
 */
export const updateAdminForDeleteApi = async (query: Recordable) => {
    return await http.post({
        url: '/updateAdminForDelete',
        data: query
    });
};