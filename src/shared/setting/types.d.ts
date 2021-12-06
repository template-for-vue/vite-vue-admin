export interface MessageSetting {
    title: string;
    cancelText: string;
    okText: string;
}

export interface ProjectSetting {
    messageSetting: MessageSetting;
    // pageLayout是否开启keep-alive
    openKeepAlive: boolean;
    // 使用error-handler-plugin
    useErrorHandler: boolean;
    // 是否开启登录安全校验
    openLoginVerify: boolean;
    // 切换界面的时候是否取消已经发送但是未响应的http请求。
    removeAllHttpPending: boolean;
    // 授权缓存KEY，表格按钮的权限是通过这个KEY获取的
    authCacheKey: string;
    // 头部Tab保留的最大数量
    headerTabNumber: number;
    // 企业微信APPID
    wxAppid: string;
    // 企业微信授权方网页应用ID
    wxAgentId: string;
}

export interface ProjectSettingWrap {
    projectSetting: Readonly<ProjectSetting>
}


/**
 * 全局配置
 */
export interface GlobSetting {
    title: string;
    apiUrl: string;
    apiPrefix: string;
}

/**
 * 全局环境变量
 */
export interface GlobEnvSetting {
    VITE_GLOB_APP_TITLE: string;
    VITE_GLOB_API_URL: string;
    VITE_GLOB_API_PREFIX: string;
}

interface GlobWrap {
    globSetting: Readonly<GlobSetting>
}

export type SettingWrap = GlobWrap & ProjectSettingWrap;
