import styleImport from 'vite-plugin-style-import';

export const configStyleImport = (_isBuild: boolean) => {
    return  styleImport({
        libs: [
            {
                libraryName: 'element-plus',
                esModule: true,
                resolveStyle: (name) => {
                    const partialName = name.slice(3);
                    return `element-plus/es/components/${partialName}/style/index`
                }
            }
        ]
    })
}