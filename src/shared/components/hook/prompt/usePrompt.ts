import {usePop} from "/@/shared/components/hook/utils/usePop";
import script from "/@/shared/components/hook/prompt/index.vue";

export interface UsePromptContext {
    label?: string;
    placeholder?: string;
    help?: string;
    append?: string;
    defaultValue?: string | number;
    rules?: unknown | unknown[];
    required?: boolean;
    className?: string;
    okText?: string;
    okType?: string;
    cancelText?: string;
    cancelType?: string;
}


export const usePrompt = () => {
    const {createPop, closePop} = usePop({component: script});

    const createPrompt = async (options: UsePromptContext) => {
        const __options = Object.assign({}, {}, options) as UsePromptContext;
        return await createPop(__options as Recordable)
    }

    return {
        createPrompt,
        closePrompt: closePop
    }
}