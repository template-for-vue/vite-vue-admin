import type {Plugin} from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
// import { visualizer } from 'rollup-plugin-visualizer';
import {configHtmlPlugin} from "./configHtmlPlugin";
import {configCompressPlugin} from "./configCompressPlugin";
import {configImageminPlugin} from "./configImageminPlugin";
import {configIconPlugin} from "./configIconPlugin";
import {configMockPlugin} from "./configMockPlugin";
import {configUnpluginComponentPlugin} from "./configUnpluginComponentPlugin";
import {configStyleImport} from "./configStyleImport";

export const createVitePlugins = (viteEnv: ViteEnv, isBuild: boolean) => {

    const {
        VITE_LEGACY,
        VITE_USE_IMAGEMIN,
        VITE_BUILD_COMPRESS,
        VITE_USE_MOCK,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
    } = viteEnv;

    const vitePlugins: (Plugin | Plugin[])[] = [
        vue()
    ]

    //@vitejs/plugin-legacy
    VITE_LEGACY && isBuild && vitePlugins.push(legacy());

    //vite-plugin-html
    vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

    //unplugin-vue-component
    vitePlugins.push(configUnpluginComponentPlugin());

    //vite-plugin-style-import
    vitePlugins.push(configStyleImport(isBuild))

    //vite-plugin-svg-icons
    vitePlugins.push(configIconPlugin())

    // vite-plugin-mock
    VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

    if (isBuild) {

        //vite-plugin-imagemin
        VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());
        //rollup-plugin-gzip
        vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));

        // vitePlugins.push(visualizer({
        //     open:true,
        //     // template:'sunburst'
        // }))
    }

    return vitePlugins;
}