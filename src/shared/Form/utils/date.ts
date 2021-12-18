export const DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm';
export const DATE_FORMAT = 'yyyy-MM-dd ';

//判断是否是有效的日期对象
const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
};

export function formatTime(time: string | number | Date, fmt = DATE_FORMAT) {
    if (!time) return '';
    let date: Nullable<any> = null;
    if (date instanceof Date) {
        date = time;
    } else if (typeof time === 'number') {
        date = new Date(time.toString().length === 10 ? time * 1000 : time);
    } else {
        const temp = parseInt(time.toString());
        if (temp.toString().length === 10) time = temp * 1000;
        if (temp.toString().length > 10) time = temp;
        date = new Date(time);
    }
    if (!isValidDate(date)) return '';

    let o: any = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;

}

export function formatToDateTime(date: string | number | Date): string {
    return formatTime(date, DATE_TIME_FORMAT);
}

export function formatToDate(date: string | number | Date): string {
    return formatTime(date, DATE_FORMAT);
}
