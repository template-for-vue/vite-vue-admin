<template>
    <el-dialog
        v-model="visible"
        custom-class="com-alert"
        :width="width"
        :show-close="false"
        :close-on-click-modal="false"
        @close="onPopClosed">
        {{ message }}
        <template #footer>
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
import {ElDialog, ElButton} from 'element-plus';

const noop = () => true;
export default defineComponent({
    components: {
        ElDialog, ElButton
    },
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
        buttonSize: {
            type: String,
            default: 'small'
        },
        onPopOk: {
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

        const handleConfirm = async () => {
            if (loading.value) return;
            loading.value = true;
            await props.onPopOk(true);
            visible.value = false;
        }
        return {
            visible,
            loading,
            handleConfirm
        }
    },
})
</script>