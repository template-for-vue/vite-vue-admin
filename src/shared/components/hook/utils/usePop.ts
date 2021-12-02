import {defineComponent, h, render} from "vue";
import {useSetting} from "/@/shared/setting/hook/useSetting";
import {isFunction} from "/@/shared/utils/is";

const {projectSetting} = useSetting()

interface UsePopContext {
    component: ReturnType<typeof defineComponent>
}

export const usePop = (options: UsePopContext) => {

    const $$instances: any = new Map();
    let $$id: number = 1;
    let $$current: Nullable<number> = null;

    const initInstance = (props: Recordable, container: Element) => {
        const vnode = h(options.component, props);
        render(vnode, container);
        if (container.firstElementChild) {
            document.body.appendChild(container.firstElementChild)
        }
        return vnode.component
    }

    const genContainer = () => {
        return document.createElement('div');
    }

    const showPop = (options: Recordable) => {
        let vm: any;
        const container = genContainer();
        const __options: Recordable = {
            ...options,
            onPopClosed: () => {
                setTimeout(() => {
                    render(null, container);
                    $$instances.delete(vm.$$id);
                    $$current = vm.$$id - 1;
                    vm = null;
                }, 150)
            },
            onPopCancel: async () => {
                const {getComponentActions, resolve} = $$instances.get(vm.$$id);
                const {onCancel} = getComponentActions.value || {};
                if (isFunction(onCancel)) await onCancel();
                if (options.onCancel && isFunction(options.onCancel)) await options.onCancel();
                await resolve(false);
            },
            onPopOk: async (result: any) => {
                const {getComponentActions, resolve} = $$instances.get(vm.$$id);
                const {onOk} = getComponentActions.value || {};
                let isNext = true;
                if (isFunction(onOk)) isNext = await onOk();
                if (isNext && options.onOk && isFunction(options.onOk)) isNext = await options.onOk();
                isNext && await resolve(result);
                return isNext;
            }
        }

        const instance = initInstance(__options, container);
        vm = instance!.proxy;
        vm.$$id = $$id++;
        for (const prop in __options) {
            if (__options.hasOwnProperty(prop) && !vm!.$props.hasOwnProperty(prop)) {
                vm[prop] = __options[prop];
            }
        }
        vm.visible = true;
        return vm;
    }

    const createPop = (options: Recordable = {}, getComponentActions: any = {}): Promise<any> => {

        const __options = Object.assign({}, {
            okText: projectSetting.messageSetting.okText,
            cancelText: projectSetting.messageSetting.cancelText,
        }, options)

        return new Promise((resolve, reject) => {
            const vm = showPop(__options);
            $$current = vm.$$id;
            getComponentActions.$$id = vm.$$id;

            $$instances.set(vm.$$id, {
                vm,
                getComponentActions,
                options,
                resolve,
                reject
            })
        })
    }

    /**
     * 手动关闭弹窗
     * 可以设置autoClose自动关闭
     */
    const closePop = () => {
        $$instances.get($$current)?.vm?.close?.();
    };

    return {
        createPop,
        closePop
    }
}