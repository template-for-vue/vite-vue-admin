<template>
    <el-dialog
        :custom-class="`com-dialog ${title ? '' : 'title-hidden'}`"
        v-model="visible"
        :width="width"
        :show-close="false"
        :close-on-click-modal="false"
        @close="onPopClosed">
        <template #title v-if="title">{{ title }}</template>
        <slot v-bind="{...$attrs}"></slot>
        <template #footer v-if="showOk || showCancel">
            <el-button v-if="showCancel" :type="cancelType" :size="buttonSize" @click="handleDialogCancel">
                {{ cancelText }}
            </el-button>
            <el-button v-if="showOk" :type="okType" :size="buttonSize" :loading="loading" @click="handleDialogOk">
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
        title: String,
        width: {
            type: String,
            default: '480px'
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
        },
        showOk: {
            type: Boolean,
            default: true
        },
        showCancel: {
            type: Boolean,
            default: true
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
            type: Boolean,
            default: true
        },
        buttonSize: {
            type: String,
            default: 'large'
        }
    },
    setup(props) {

        const visible = ref(false);
        const loading = ref(false);

        const close = () => visible.value = false;

        const handleDialogOk = async () => {
            if (loading.value) return;
            loading.value = true;
            try {
                const isNext = await props.onPopOk();
                if (isNext) {
                    props.autoClose && close()
                } else {
                    loading.value = false
                }
            } catch (e) {
                loading.value = false
            }
        }

        const handleDialogCancel = async () => {
            if (loading.value) return;
            await props.onPopCancel();
            close()
        }

        return {
            visible,
            loading,
            close,
            handleDialogOk,
            handleDialogCancel,
        }
    }
})

</script>
