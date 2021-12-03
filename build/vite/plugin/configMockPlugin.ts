import {viteMockServe} from 'vite-plugin-mock';

export const configMockPlugin = (_isBuild: boolean) => {
    return viteMockServe({
        mockPath: 'mock',
        localEnabled: true
    })
}