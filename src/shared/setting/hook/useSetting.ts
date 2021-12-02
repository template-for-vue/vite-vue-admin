import {GlobSetting, ProjectSetting, SettingWrap} from "/@/shared/setting/types";

import getProjectSetting from '/@/shared/setting/index';
import {getEnvConfig} from "/@/shared/utils/env";


export const useSetting = (): SettingWrap => {
    const {VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_PREFIX} = getEnvConfig();
    // Take global configuration
    const glob: Readonly<GlobSetting> = {
        title: VITE_GLOB_APP_TITLE,
        apiUrl: VITE_GLOB_API_URL!,
        apiPrefix: VITE_GLOB_API_PREFIX!,
    };
    const projectSetting: Readonly<ProjectSetting> = getProjectSetting;
    return {
        globSetting: glob as Readonly<GlobSetting>,
        projectSetting,
    };
};
