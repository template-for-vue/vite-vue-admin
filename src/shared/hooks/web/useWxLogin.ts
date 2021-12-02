import {useSetting} from "/@/shared/setting/hook/useSetting";

export interface WxLoginConfig {
    id: string,
    appid?: string,
    agentid?: string,
    redirect_uri: string,
    state?: string,
    href?: string,
    style?: string
}


export const useWxLogin = () => {
    const createBarcode = (config: WxLoginConfig) => {
        const {projectSetting: {wxAppid, wxAgentId}} = useSetting();
        const {
            appid = wxAppid,
            agentid = wxAgentId
        } = config;
        window.WwLogin?.({...config, appid, agentid})
    }

    return {
        createBarcode
    }
}