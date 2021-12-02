import {usePop} from "/@/shared/components/hook/utils/usePop";
import script from "/@/shared/components/hook/confirm/index.vue";
import {isString} from "/@/shared/utils/is";

export interface UseConfirmContext {
    message?: string;
    okText?: string;
    okType?: string;
    cancelText?: string;
    cancelType?: string;
    autoClose?: boolean;
}

export const useConfirm = () => {
    const {createPop, closePop} = usePop({component: script});

    /**
     * 确认返回true
     * 取消返回false
     */
    const createConfirm = async (options: UseConfirmContext | string = ''): Promise<boolean> => {

        if (options && isString(options)) {
            options = {message: options};
        }
        return await createPop(options as Recordable)
    }

    return {
        createConfirm,
        closeConfirm: closePop
    }
}