<template>
    <el-drawer
        :custom-class="`com-drawer ${title ? '' : 'title-hidden'} ${showOk || showCancel ? '' : 'footer-hidden'}`"
        v-model="visible"
        :size="size"
        :show-close="showClose"
        :close-on-click-modal="true"
        :with-header="!!title"
        :append-to-body="true"
        :direction="direction"
        @close="onPopClosed">
        <template #title>{{ title }}</template>
        <section class="com-drawer-content">
            <suspense>
                <slot v-bind="{...$attrs}"></slot>
            </suspense>
        </section>
        <div class="com-drawer-footer" v-if="showOk || showCancel">
            <el-button v-if="showCancel" :type="cancelType" :size="buttonSize" @click="handleDrawerCancel">
                {{ cancelText }}
            </el-button>
            <el-button v-if="showOk" :type="okType" :size="buttonSize" :loading="loading" @click="handleDrawerOk">
                {{ okText }}
            </el-button>
        </div>
    </el-drawer>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {ElButton, ElDrawer} from 'element-plus';

const noop = () => true;
export default defineComponent({
    inheritAttrs: false,
    components: {ElDrawer, ElButton},
    props: {
        title: String,
        size: {
            type: [String, Number],
            default: '460px'
        },
        showClose: {
            type: Boolean,
            default: false
        },
        direction: String,
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
        const visible = ref(true);
        const loading = ref(false);
        const close = () => visible.value = false;
        const handleDrawerOk = async () => {
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
        const handleDrawerCancel = async () => {
            if (loading.value) return;
            await props.onPopCancel();
            close()
        }
        return {
            visible,
            loading,
            close,
            handleDrawerOk,
            handleDrawerCancel
        }
    }
})

</script>
