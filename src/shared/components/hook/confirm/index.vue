<template>
    <el-dialog
        v-model="visible"
        custom-class="com-confirm"
        :width="width"
        :show-close="false"
        :close-on-click-modal="false"
        @close="onPopClosed">
        {{ message }}
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

const noop = () => true;
export default defineComponent({
    inheritAttrs: false,
    props: {
        message: String,
        width: {
            type: String,
            default: '320px'
        },
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
        autoClose: {
            type:Boolean,
            default:false
        },
        buttonSize: {
            type: String,
            default: 'small'
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

        const handleCancel = () => {
            if (loading.value) return;
            props.onPopCancel()
            close();
        }
        const handleConfirm = async () => {
            if (loading.value) return;
            loading.value = true;
            await props.onPopOk(true);
            props.autoClose && setTimeout(() => {
                close();
                loading.value = false;
            }, 0)
        }
        return {
            visible,
            loading,
            close,
            handleCancel,
            handleConfirm
        }
    },
})
</script>

<style lang="scss">

</style>