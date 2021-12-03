import Components from 'unplugin-vue-components/vite';
import {ComResolver} from "./ComResolver";

export const configUnpluginComponentPlugin = () => {
    return Components({
        resolvers: [
            ComResolver()
        ]
    })
}
