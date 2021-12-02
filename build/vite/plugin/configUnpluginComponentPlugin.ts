import Components from 'unplugin-vue-components/vite';
import {ComResolver} from "./ComResolver";
import {ElementPlusResolver} from "./ElementPlusResolver";

export const configUnpluginComponentPlugin = () => {
    return Components({
        resolvers: [
            ElementPlusResolver({importStyle: 'sass'}),
            ComResolver()
        ]
    })
}
