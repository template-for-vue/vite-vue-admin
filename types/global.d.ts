declare interface ViteEnv {
    VITE_PORT: number,
    VITE_PUBLIC_PATH: string,
    VITE_USE_MOCK: boolean,
    VITE_PROXY: [string, string][],
    VITE_GLOB_APP_TITLE: string,
    VITE_GLOB_API_URL: string,
    VITE_GLOB_API_PREFIX: string,
    VITE_GLOB_APP_SHORT_NAME: string,
    VITE_USE_CDN: boolean,
    VITE_DROP_CONSOLE: bolean,
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none',
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean,
    VITE_LEGACY: boolean,
    VITE_USE_IMAGEMIN: boolean,
    VITE_GENERATED_UI: string
}

declare type Nullable<T> = T | null;
declare type NoneNullable<T> = T extends null | undefined ? never : T;

declare type Recordable<T = any> = Record<string, T>;

declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}

declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

declare type EmitType = (event: string, ...args: any[]) => void;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

declare type TimeoutHandle = ReturnType<typeof setTimeout>;
declare interface Window {
    WwLogin: Fn
}