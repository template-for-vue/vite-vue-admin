import {defineComponent, Suspense, h, ref} from "vue";
import {usePop} from "/@/shared/components/hook/utils/usePop";
import script from '/@/shared/components/hook/drawer/index.vue';

interface UseDrawerContext {
    component: ReturnType<typeof defineComponent>;
    size?: string | number;
    title?: string;
    direction?:
        | 'rtl'
        | 'ltr'
        | 'ttb'
        | 'btt';
    onOk?: Fn,
    onCancel?: Fn,

    [key: string]: any;
}

export const useDrawer = (options: UseDrawerContext) => {

    const getComponentActions = ref({});
    const component = h(
        script,
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
                            options.component.render = function(vm:any){
                                setTimeout(() => {
                                    getComponentActions.value = {
                                        onOk: vm?.ok,
                                        onCancel: vm?.cancel
                                    };
                                }, 0)
                                return render(...arguments);
                            }
                            return h(options.component, attrs);
                        }
                    }
                )
            }
        }
    );

    const {createPop, closePop} = usePop({component});
    const openDrawer = async (params: Recordable = {}) => {
        const __options = Object.assign({}, options, params);
        delete __options.component;
        await createPop(__options, getComponentActions)
    }

    return {
        openDrawer,
        closeDrawer: closePop
    }
}