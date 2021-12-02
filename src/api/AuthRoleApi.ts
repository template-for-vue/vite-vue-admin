import {http} from "/@/shared/utils/http/axios";

export const selectAuthRoleOptionApi = async () => {
    return await http.get({
        url: '/selectAuthRoleOption'
    });
};