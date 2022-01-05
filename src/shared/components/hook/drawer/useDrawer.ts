import {defineComponent, h, ref} from "vue";
import {usePop} from "/@/shared/components/hook/utils/usePop";
import script from '/@/shared/components/hook/drawer/index.vue';
import {isNullOrUnDef, isNumber} from "/@/shared/utils/is";

interface useDrawerAttrs {
    size?: string | number;
    title?: string;
    showOk?: boolean;
    okText?: string;
    showCancel?: boolean;
    cancelText?: string;
    direction?:
        | 'rtl'
        | 'ltr'
        | 'ttb'
        | 'btt';
}

const noop: any = () => true;
export const useDrawer = () => {

    const createDrawer = (component: ReturnType<typeof defineComponent>) => {
        class Drawer {
            private component = component;
            private props: Recordable = {};
            private attrs: useDrawerAttrs = {};
            private onOk = noop;
            private onCancel = noop;

            setAttrs = (attrs: useDrawerAttrs = {}) => {
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

                let {size} = this.attrs;
                if (!isNullOrUnDef(size)) {
                    this.attrs.size = isNumber(size) || (parseInt(size).toString() === size) ? `${size}px` : size;
                }

                const getComponentActions = ref({});
                const component = h(
                    script,
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
            }

        }

        return new Drawer();
    }

    return {createDrawer}
}