import type {Plugin} from 'vite';
import html from 'vite-plugin-html';

export const configHtmlPlugin = (viteEnv: ViteEnv, isBuild: boolean) => {
    const {VITE_GLOB_APP_TITLE: title} = viteEnv;

    return html({
        minify: isBuild,
        inject: {
            data: {title}
        }

    }) as Plugin[]
}