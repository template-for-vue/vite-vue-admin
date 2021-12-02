import type {Plugin} from 'vite';
import compressPlugin from 'vite-plugin-compression';

export const configCompressPlugin = (
    compress: 'gzip' | 'brotli' | 'none',
    deleteOriginFile: boolean = false
) => {
    const compressList = compress.split(',');
    const plugins: Plugin[] = [];

    if (compressList.includes('gzip')) {
        plugins.push(compressPlugin({
            ext: '.gz',
            deleteOriginFile
        }))
    }

    if (compressList.includes('brotli')) {
        plugins.push(compressPlugin({
            ext: '.br',
            algorithm: 'brotliCompress',
            deleteOriginFile
        }))
    }

    return plugins;
}