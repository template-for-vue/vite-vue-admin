import type { ProjectSetting } from '/@/shared/setting/types';

const projectSetting: ProjectSetting = {
    // 消息配置
    messageSetting: {
        // 弹窗title
        title: '操作提示',
        // 取消按钮的文子,
        cancelText: '取消',
        // 确认按钮的文字
        okText: '确定',
    },
    // 是否开启KeepAlive缓存  开发时候最好关闭,不然每次都需要清除缓存
    openKeepAlive: true,

    // 使用error-handler-plugin
    useErrorHandle: true,

    // 是否开启登录安全校验
    openLoginVerify: true,

    // 切换界面的时候是否取消已经发送但是未响应的http请求。
    // 如果开启,想对单独接口覆盖。可以在单独接口设置
    removeAllHttpPending: true,

    // 头部tab保留的最大数量
    headerTabNumber: 10,

    //授权缓存KEY，表格按钮的权限是通过这个KEY获取的
    authCacheKey: 'AUTH_CACHE_KEY__',

    // 企业微信APPID
    wxAppid: 'wwb8187ef61927b720',

    // 企业微信授权方网页应用ID
    wxAgentId: '1000002'
};

export default projectSetting;
