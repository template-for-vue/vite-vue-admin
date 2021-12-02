import type {ComponentResolver} from 'unplugin-vue-components/types';

export const ComResolver = (): ComponentResolver => {
    return (name: string) => {
        if (name.startsWith('Com')) {
            let path;
            switch (name) {
                case 'ComTableHeader':
                    path = `Table/${name}`;
                    break;
                case 'ComSpin':
                    path = `Loading/${name}`;
                    break;
                default:
                    const parentPath = name.replace('Com','').replace('Item','');
                    path = `${parentPath}/${name}`;
                    break;
            }
            return {
                path: `/@/shared/components/${path}.vue`,
            }
        }
    }
}
