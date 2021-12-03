<template>
    <el-form ref="formElRef"
             :model="formModel"
             v-bind="getBindingProps"
             @submit="handleSubmit"
             @keypress.enter="handleSubmit">
        <el-row v-bind="getProps.rowProps">
            <slot name="header"></slot>
            <template v-for="schema in getSchema">
                <com-form-item
                    :schema="schema"
                    :formModel="formModel"
                    :formProps="getProps"
                    :formActionType="formActionType">
                    <template #[item]="data" v-for="item in Object.keys($slots)">
                        <slot :name="item" v-bind="data || {}"></slot>
                    </template>
                </com-form-item>
            </template>
        </el-row>
    </el-form>
</template>

<script lang="ts">
import type {Ref} from 'vue';
import {computed, defineComponent, reactive, ref, unref} from 'vue';
import {FormActionType, FormProps, FormSchema} from "/@/shared/components/Form/types/form";
import {deepMerge, isBoolean} from "/@/shared/components/Form/utils";
import {useFormValues} from "/@/shared/components/Form/hooks/useFormValues";
import {useFormEvents} from "/@/shared/components/Form/hooks/useFormEvents";
import {ElForm, ElRow} from 'element-plus';

export default defineComponent({
    name: "ComForm",
    inheritAttrs: false,
    components: {ElForm, ElRow},
    emits: ['register', 'submit', 'reset'],
    setup(props, {emit}) {

        // +----------------------------------------------------------------------
        // | 基础变量
        // +----------------------------------------------------------------------
        const formModel = reactive<Recordable>({});
        const propsRef = ref<Partial<FormProps>>({});
        const schemaRef = ref<Nullable<FormSchema[]>>(null);
        const formElRef = ref<Nullable<FormActionType>>(null);

        // +----------------------------------------------------------------------
        // | 表单结构配置及参数配置
        // +----------------------------------------------------------------------

        const getProps = computed((): FormProps => {
            return {...props, ...unref(propsRef)} as FormProps;
        })

        const getSchema = computed((): FormSchema[] => {
            return unref(schemaRef) || (unref(getProps).schemas as any);
        })

        // +----------------------------------------------------------------------
        // | 构造表单实例方法
        // +----------------------------------------------------------------------
        const {handleFormValues, initDefault} = useFormValues({getSchema, getProps, formModel})
        const {
            setFieldsValue,
            removeSchemaByField,
            appendSchemaByField,
            resetSchema,
            updateSchema,
            getFieldsValue,
            validate,
            validateField,
            resetFields,
            clearValidate
        } = useFormEvents({
            emit,
            formElRef: formElRef as Ref<FormActionType>,
            schemaRef: schemaRef as Ref<FormSchema[]>,
            formModel,
            getSchema,
            handleFormValues
        })

        async function setProps(formProps: Partial<FormProps>) {
            propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
        }

        const formActionType: Partial<FormActionType> = {
            setProps,
            setFieldsValue,
            removeSchemaByField,
            appendSchemaByField,
            resetSchema,
            updateSchema,
            getFieldsValue,
            validate,
            validateField,
            resetFields,
            clearValidate
        }

        // +----------------------------------------------------------------------
        // | 组成及初始化
        // +----------------------------------------------------------------------


        emit('register', formActionType);
        initDefault();

        // +----------------------------------------------------------------------
        // | 提交
        // +----------------------------------------------------------------------

        const getBindingProps = computed(() => {
            let bindProps: Recordable = {
                ...unref(getProps),
            };
            [
                'colProps',
                'rowProps',
                'schemas'
            ].forEach((key) => {
                delete bindProps[key];
            })
            return bindProps;
        })

        const handleSubmit = async () => {
            const validation = await validate();
            if (isBoolean(validation) && validation) {
                emit('submit', getFieldsValue())
            }
        }

        return {
            formElRef,
            getProps,
            getBindingProps,
            formModel,
            getSchema,
            formActionType,
            handleSubmit
        }
    }
})

</script>
