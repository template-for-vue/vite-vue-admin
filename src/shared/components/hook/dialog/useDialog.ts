import {defineComponent, h, Suspense, ref} from "vue";
import {usePop} from "/@/shared/components/hook/utils/usePop";
import {isNullOrUnDef, isNumber} from "/@/shared/utils/is";
import script from '/@/shared/components/hook/dialog/index.vue';

interface UseDialogContext {
    component: ReturnType<typeof defineComponent>,
    width?: string | number,
    showOk?: boolean,
    showCancel?: boolean,
    okType?: string,
    okText?: string,
    cancelType?: string,
    cancelText?: string,
    buttonSize?: string,
    autoClose?: boolean,
    onOk?: Fn,
    onCancel?: Fn,

    [key: string]: any;
}

export const useDialog = (options: UseDialogContext) => {

    const {width} = options;
    if (!isNullOrUnDef(width)) {
        options.width = isNumber(width) || (parseInt(width).toString() === width) ? `${width}px` : width;
    }
    const getComponentActions = ref({});
    const component: any = h(
        script as any,
        {width: options.width},
        {
            default: (attrs: any) => {
                return h(
                    Suspense,
                    null,
                    {
                        default: () => {
                            options.component.inheritAttrs = false;
                            const render = options.component.render;
                            options.component.render = (vm:any) =>{
                                setTimeout(() => {
                                    getComponentActions.value = {
                                        onOk: vm?.ok,
                                        onCancel: vm?.cancel
                                    };
                                }, 0)
                                return render(vm);
                            }
                            return h(options.component, attrs);

                        }
                    }
                )
            }
        }
    );

    const {createPop, closePop} = usePop({component});
    const openDialog = async (params: Recordable = {}) => {
        const __options = Object.assign({}, options, params);
        delete __options.component;
        await createPop(__options, getComponentActions)
    }

    return {
        openDialog,
        closeDialog: closePop
    }
}