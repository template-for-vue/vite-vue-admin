import {ref, unref, watch, nextTick, onUnmounted} from 'vue';
import type {WatchStopHandle} from 'vue';
import {DynamicProps} from "/@/shared/components/Form/types/utils.d";
import {
    FormActionType,
    FormProps,
    FormSchema,
    NamePath,
    UseAppendSchemaOptions,
    UseFormReturnType
} from "/@/shared/components/Form/types/form";
import {error} from "/@/shared/components/Form/utils/log";
import {isProdMode} from "/@/shared/components/Form/utils/env";
import {getDynamicProps} from "/@/shared/components/Form/utils";

type Props = Partial<DynamicProps<FormProps>>

export const useForm = (props?: Props): UseFormReturnType => {
    const formRef = ref<Nullable<FormActionType>>(null);

    async function getForm() {
        const form = unref(formRef);
        if (!form) {
            error('The form instance has not been obtained!')
        }
        await nextTick();
        return form as FormActionType;
    }

    const methods: FormActionType = {
        setProps: async (formProps: Partial<FormProps>) => {
            const form = await getForm();
            await form.setProps(formProps);
        },

        validate: async (nameList?: NamePath): Promise<void> => {
            const form = await getForm();
            return form.validate(nameList);
        },

        validateField: async (nameList: NamePath): Promise<void> => {
            const form = await getForm();
            return form.validateField(nameList);
        },

        clearValidate: async () => {
            const form = await getForm();
            form.clearValidate();
        },

        getFieldsValue: async (): Promise<Recordable> => {
            const form = await getForm();
            return form.getFieldsValue();
        },

        setFieldsValue: async (values: Recordable): Promise<void> => {
            const form = await getForm();
            return form.setFieldsValue(values);
        },

        resetFields: async (): Promise<void> => {
            const form = await getForm();
            return form.resetFields();
        },

        removeSchemaByField: async (fields: NamePath): Promise<void> => {
            const form = await getForm();
            return form.removeSchemaByField(fields);
        },

        appendSchemaByField: async (schema: FormSchema, options: UseAppendSchemaOptions): Promise<void> => {
            const form = await getForm();
            return form.appendSchemaByField(schema, options);
        },

        resetSchema: async (data): Promise<void> => {
            const form = await getForm();
            return form.resetSchema(data);
        },

        updateSchema: async (data): Promise<void> => {
            const form = await getForm();
            return form.updateSchema(data);
        }
    }

    let stopWatch: WatchStopHandle;

    function register(instance: FormActionType) {

        if (formRef.value && instance === formRef.value) return;
        if (isProdMode()) onUnmounted(() => formRef.value = null)
        formRef.value = instance;
        stopWatch?.();
        stopWatch = watch(
            () => props,
            () => {
                props && instance.setProps(getDynamicProps(props));
            },
            {
                immediate: true,
                deep: true
            }
        )
    }


    return [register, methods];
}