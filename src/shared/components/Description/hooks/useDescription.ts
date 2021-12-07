import {getCurrentInstance, ref, unref} from 'vue';
import {
    DescriptionInstance,
    DescriptionProps,
    UseDescriptionReturnType
} from "/@/shared/components/Description/types/description";


export const useDescription = (props?: Partial<DescriptionProps>): UseDescriptionReturnType => {

    if (!getCurrentInstance()) {
        throw new Error('useDescription() can only be used inside setup() or functional components');
    }

    const instanceRef = ref<Nullable<DescriptionInstance>>(null);

    const register = (instance: DescriptionInstance) => {
        if (unref(instanceRef)) return;
        instanceRef.value = instance;
        props && instance.setProps(props);
    }

    const methods: DescriptionInstance = {
        setProps: (props: Partial<DescriptionProps>): void => {
            unref(instanceRef)?.setProps(props);
        }
    }

    return [register, methods];
}