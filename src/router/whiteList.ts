import {Page} from '/@/router/page';

export const whiteList: string[] = [Page.LOGIN, Page.DASHBOARD_WELCOME, Page.ERROR404];

export const isInWhiteList = (path: string): boolean => {
    return whiteList.includes(path);
};
