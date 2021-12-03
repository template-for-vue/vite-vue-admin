import {Page} from '/@/router/page';

export const whiteList: string[] = [Page.LOGIN, Page.ERROR404];

export const isInWhiteList = (path: string): boolean => {
    return whiteList.includes(path);
};
