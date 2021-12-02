/**
 * 获取授权（菜单+按钮）
 * rule_apis
 */
import {http} from "/@/shared/utils/http/axios";

/**
 * 查看授权列表
 * 包含菜单和按钮
 * {'path':'name'}形式展示
 */
export const selectAuthApi = async () => {
    return await http.get({
        url: '/selectAuth'
    });
};

/**
 * 查看菜单，以树形结构展示
 * {
 *     id:xxx,
 *     rule_title:xxx
 *     children:[
 *         {
 *             id:yyy,
 *             rule_title:yyy
 *         }
 *     ]
 * }
 */
export const selectAuthMenuApi = async () => {
    return await http.get({
        url: '/selectAuthMenu'
    });
};