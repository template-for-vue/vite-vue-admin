import {viteMockServe} from 'vite-plugin-mock';

export const configMockPlugin = (isBuild: boolean) => {
    return viteMockServe({
        mockPath: 'mock',
        localEnabled: !isBuild
    })
}