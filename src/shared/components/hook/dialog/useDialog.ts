import {defineComponent, h, ref} from "vue";
import {usePop} from "/@/shared/components/hook/utils/usePop";
import {isNullOrUnDef, isNumber} from "/@/shared/utils/is";
import script from '/@/shared/components/hook/dialog/index.vue';

interface UseDialogAttrs {
    title?: string,
    width?: string | number,
    showOk?: boolean,
    showCancel?: boolean,
    okType?: string,
    okText?: string,
    cancelType?: string,
    cancelText?: string,
    buttonSize?: string,
    autoClose?: boolean,
}

const noop: any = () => true;

export const useDialog = () => {

    const createDialog = (component: ReturnType<typeof defineComponent>) => {

        class Dialog {
            private component = component;
            private props: Recordable = {};
            private attrs: UseDialogAttrs = {};
            private onOk = noop;
            private onCancel = noop;

            setAttrs = (attrs: UseDialogAttrs = {}) => {
                this.attrs = attrs;
                return this;
            };

            setProps = (props: Recordable = {}) => {
                this.props = props;
                return this;
            };

            setOk = (onOk = noop) => {
                this.onOk = onOk;
                return this;
            };

            setCancel = (onCancel = noop) => {
                this.onCancel = onCancel;
                return this;
            };

            open = async () => {

                let {width} = this.attrs;
                if (!isNullOrUnDef(width)) {
                    this.attrs.width = isNumber(width) || (parseInt(width).toString() === width) ? `${width}px` : width;
                }
                const getComponentActions = ref({});
                const component: any = h(
                    script as any,
                    {},
                    {
                        default: () => {
                            this.component.inheritAttrs = false;
                            const render = this.component.render;
                            this.component.render = function (vm: any) {
                                setTimeout(() => {
                                    getComponentActions.value = {
                                        onOk: vm?.ok,
                                        onCancel: vm?.cancel
                                    };
                                }, 0)
                                return render(...arguments);
                            }
                            return h(this.component, this.props);
                        }
                    }
                );
                const {createPop, closePop} = usePop({component});
                const __options = Object.assign({}, this.attrs, {onOk: this.onOk, onCancel: this.onCancel});
                await createPop(__options, getComponentActions)
                return closePop;
            };
        }
        return new Dialog();
    }

    return {
        createDialog
    }
}