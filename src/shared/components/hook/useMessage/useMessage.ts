import ElMessage from 'element-plus/es/components/message/index';
import ElNotification from 'element-plus/es/components/notification/index';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-notification.css';
import {isString} from "/@/shared/utils/is";

interface MessageOptions {
    message?: string;
    duration?: number;
}

type MessageArguments = MessageOptions | string;

type NotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NotificationOptions {
    title?: string;
    message?: string;
    duration?: number;
    position?: NotificationPlacement;
    showClose?: boolean;
}

type NotificationArguments = NotificationOptions | string;

export const useMessage = () => {

    /**
     * 根据信息长度计算持续时间
     * @param message
     * @param min
     * @param max
     */
    function calcDuration(message = '', min = 1200, max = 2500) {
        return Math.min(Math.max(message.length * 200, min), max);
    }

    const createSuccessMessage = (args: MessageArguments = {}) => {
        if (isString(args)) {
            args = {message: args}
        }
        let message = args.message || '操作成功';
        let duration = calcDuration(message);
        return ElMessage.success({message, duration, center: false});
    }


    const createErrorMessage = (args: MessageArguments = {}) => {
        if (isString(args)) {
            args = {message: args}
        }
        let message = args.message || '操作失败';
        let duration = calcDuration(message);
        return ElMessage.error({message, duration, center: false});
    }


    const createNotice = (args: NotificationArguments = {}) => {
        if (isString(args)) {
            args = {message: args}
        }
        let {title, message, position, showClose} = Object.assign({}, {
            title: '提示',
            message: '你好兄弟，写一下信息!',
            showClose: false
        }, args) as NotificationOptions;
        let duration = calcDuration(args.message, 2000, 3000);
        return ElNotification({title, message, duration, position, showClose})
    }

    return {
        createSuccessMessage,
        createErrorMessage,
        createNotice
    }
}