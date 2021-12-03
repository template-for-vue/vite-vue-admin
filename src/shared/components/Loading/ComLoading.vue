<template>
    <transition name="fade">
        <section class="com-loading" :class="{ absolute }" v-show="loading" :style="getStyle">
            <ComSpin></ComSpin>
        </section>
    </transition>
</template>

<script lang="ts">
import {defineComponent, computed, PropType, CSSProperties} from 'vue';
import {LoadingSize} from '/@/shared/components/Loading/types';

export default defineComponent({
    name: 'ComLoading',
    props: {
        tip: {
            type: String,
            default: ''
        },
        size: {
            type: String as PropType<LoadingSize>,
            default: 'small'
        },
        loading: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
        absolute: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
        background: {
            type: String as PropType<string>,
        },
        theme: {
            type: String as PropType<'dark' | 'light'>,
            default: 'light',
        },
    },
    setup(props) {
        const getStyle = computed(
            (): CSSProperties => {
                const {background, theme} = props;
                const bgColor = background
                    ? background
                    : theme === 'dark'
                        ? 'rgba(0, 0, 0, 0.2)'
                        : 'rgba(240, 242, 245, 0.4)';
                return {background: bgColor};
            }
        );
        return {getStyle};
    }
});
</script>

<style lang="scss" scoped>
.com-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    &.absolute {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 300;
    }
}
</style>
