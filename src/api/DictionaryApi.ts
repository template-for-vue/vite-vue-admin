import {http} from "/@/shared/utils/http/axios";

export const selectDictionaryKeyApi = async () => {
    return await http.get({url: '/selectDictionaryKey'});
}