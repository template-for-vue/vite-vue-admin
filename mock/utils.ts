export function resultSuccess<T = Record<string, any>>(data: T, {message = '操作成功'} = {}) {
    return {
        code: 'TKE010001',
        data,
        message,
    };
}