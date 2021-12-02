import {isString} from "/@/shared/components/hook/utils";
import script from "/@/shared/components/hook/alert/index.vue";
import {usePop} from "/@/shared/components/hook/utils/usePop";

export interface UseAlertParams {
    message?: string;
    okText?: string;
    okType?: string;
}

export const useAlert = () => {

    const {createPop} = usePop({component: script})

    const createAlert = async (options: UseAlertParams | string = '') => {
        if (options && isString(options)) {
            options = {message: options};
        }
        const __options = Object.assign({}, {
            message: '请设置警告信息',
        }, options) as UseAlertParams;

        return await createPop(__options)
    }

    return {
        createAlert,
    }
}