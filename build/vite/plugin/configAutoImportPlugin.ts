import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from "./ElementPlusResolver";

export const configAutoImportPlugin = () => {
    return AutoImport({
        resolvers: [
            ElementPlusResolver({importStyle: 'sass'}) as any,
        ]
    })
}