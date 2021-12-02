export enum Page {
    ROOT = '/',
    UN_MATCH = '/:match(.*)*',

    //error
    ERROR404 = '/404',
    //login
    LOGIN = '/login',

    //dashboard
    DASHBOARD_WELCOME = '/dashboard/welcome',
    DASHBOARD_WORKBENCH = '/dashboard/workbench',

    //auth
    AUTH_ADMIN_LIST = '/auth/admin',



    TABLE = '/dashboard/table'
}