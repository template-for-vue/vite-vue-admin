import type {UserConfig, ConfigEnv} from 'vite';
import pkg from './package.json';
import {resolve} from 'path';
import {loadEnv} from 'vite';
import {wrapperEnv} from "./build/utils";
import {createProxy} from "./build/vite/proxy";
import {createVitePlugins} from "./build/vite/plugin";

const pathResolve = (dir: string) => resolve(process.cwd(), '.', dir)

const {name, version} = pkg;
const __APP_INFO__ = {
    pkg: {name, version},
    lastBuildTime: new Date().toLocaleString()
}

export default ({command, mode}: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root);
    const viteEnv = wrapperEnv(env);
    const {VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE} = viteEnv;
    const isBuild = command === 'build';
    return {
        root,
        base: VITE_PUBLIC_PATH,
        resolve: {
            alias: [
                {
                    find: /\/@\//,
                    replacement: pathResolve('src') + '/'
                },
                {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/'
                }
            ]
        },
        server: {
            host: true,
            strictPort:true,
            port: VITE_PORT,
            proxy: createProxy(VITE_PROXY)
        },
        build: {
            target: 'es2015',
            // outDir: OUTPUT_DIR,
            outDir: 'dist',
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_console: VITE_DROP_CONSOLE
                }
            },
            brotliSize: false,
            chunkSizeWarningLimit: 2000,
            // rollupOptions: {
            //     output: {
            //         manualChunks(id) {
            //             if(id.includes('node_modules')){
            //                 return id.toString().split('node_modules/')[2].split('/')[0].toString();
            //             }
            //         }
            //     }
            // }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false,
                    additionalData: '@use "/@/assets/style/reference/index.scss" as *;'
                }
            }
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__)
        },
        plugins: createVitePlugins(viteEnv, isBuild)
    }
}