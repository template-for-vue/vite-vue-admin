<template>
    <el-dialog
        v-model="visible"
        :custom-class="`com-prompt ${className}`"
        :width="width"
        :show-close="false"
        :close-on-click-modal="false"
        @close="onPopClosed">
        <com-form @register="register">
            <template #append>{{ append }}</template>
        </com-form>
        <template #footer>
            <el-button
                :type="cancelType"
                :size="buttonSize"
                @click="handleCancel">
                {{ cancelText }}
            </el-button>
            <el-button
                :type="okType"
                :size="buttonSize"
                :loading="loading"
                :disabled="loading"
                @click="handleConfirm">
                {{ okText }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import type {PropType} from 'vue';
import {useForm} from "/@/shared/components/Form/hooks/useForm";
import {isBoolean} from "/@/shared/utils/is";

const noop = () => true;
export default defineComponent({
    inheritAttrs: false,
    props: {
        label: String,
        placeholder: String,
        className: String,
        help: [String, Array] as PropType<string | string[]>,
        append: String,
        defaultValue: [String, Number],
        width: {
            type: String,
            default: '400px'
        },
        rules: [Object, Array] as PropType<any | any[]>,
        required: Boolean,
        okText: {
            type: String,
            default: '确定'
        },
        okType: {
            type: String,
            default: 'primary'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        cancelType: String,
        buttonSize: {
            type: String,
            default: 'small'
        },
        autoClose: {
            type:Boolean,
            default:false
        },
        onPopOk: {
            type: Function,
            default: noop
        },
        onPopCancel: {
            type: Function,
            default: noop
        },
        onPopClosed: {
            type: Function,
            default: noop
        }
    },
    setup(props) {
        const visible = ref(true);
        const loading = ref(false);
        const close = () => visible.value = false;


        const [register, {validate, getFieldsValue}] = useForm({
            labelPosition: 'top',
            schemas: [{
                prop: 'value',
                label: props.label,
                help: props.help,
                required: props.required,
                rules: props.rules as any,
                placeholder: props.placeholder ?? `请输入${props.label}`,
                component: 'Input',
                defaultValue: props.defaultValue,
                appendRender: props.append ? 'append' : ''
            }]
        });

        const handleConfirm = async () => {
            if (loading.value) return;
            const validation = await validate();
            if (isBoolean(validation) && validation) {
                loading.value = true;
                const result = await getFieldsValue();
                await props.onPopOk(result).catch(() => void 0);
                props.autoClose && setTimeout(() => {
                    close();
                    loading.value = false;
                }, 0)
            }
        }

        const handleCancel = async () => {
            if (loading.value) return;
            await props.onPopCancel();
            close();
        }


        return {
            register,
            visible,
            loading,
            close,
            handleConfirm,
            handleCancel
        }
    },
})
</script>