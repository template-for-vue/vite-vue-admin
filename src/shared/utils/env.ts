export const devMode = 'development';
export const prodMode = 'production';

export const getEnv = (): string => import.meta.env.MODE;
export const isDevMode = () => getEnv() === devMode;
export const isProdMode = () => getEnv() === prodMode;

export const getEnvConfig = (): ViteEnv => {
    return import.meta.env as unknown as ViteEnv
};
