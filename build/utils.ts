export const isDevFn = (mode: string): boolean => mode === 'development';

export const isProdFn = (mode: string): boolean => mode === 'production';

export const isReportMode = (): boolean => process.env.REPORT === 'true';

export const wrapperEnv = (envConf: any): ViteEnv => {
    const ret: any = {};
    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName];
        realName = realName === 'true' ? true : realName === 'false' ? false : realName

        if (envName === 'VITE_PORT') realName = Number(realName);
        if (envName === 'VITE_PROXY' && realName) {
            try {
                realName = JSON.parse(realName)
            } catch (e) {
                realName = ''
            }
        }
        ret[envName] = realName;
        if (typeof realName === 'string') {
            process.env[envName] = realName;
        } else {
            process.env[envName] = JSON.stringify(realName);
        }
    }
    return ret
}