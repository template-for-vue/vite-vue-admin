<template>
    <div class="com-badge">
        <span class="com-badge-dot" :class="`com-badge-dot__${type}`" :style="{width:getSize,height:getSize}"></span>
        <slot>
            <span class="com-badge-text__empty">未设置</span>
        </slot>
    </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {isNumber} from "/@/shared/components/Badge/utils";

export default defineComponent({
    name: "ComBadge",
    props: {
        type: {
            type: String,
            default: 'success'
        },
        size: {
            type: [String, Number],
            default: '6px'
        }
    },
    setup(props) {
        const getSize = computed(() => {
            let size = props.size;
            if (isNumber(size) || `${parseFloat(size)}` == size) {
                size = `${size}px`;
            }
            return size;
        })
        return {
            getSize
        }
    }
})

</script>
<style lang="scss">
.com-badge {
    display: flex;
    align-items: center
}

.com-badge-dot {
    margin-right: 6px;
    border-radius: 50%;
}

.com-badge-text__empty {
    color: var(--el-text-color-placeholder);
}
.com-badge-dot__primary{
    background-color:var(--color-primary)
}
.com-badge-dot__warning {
    background-color:var(--color-warning)
}

.com-badge-dot__success {
    background-color:var(--color-success)
}

.com-badge-dot__info {
    background-color:var(--color-info)
}

.com-badge-dot__danger {
    background-color:var(--color-danger)
}
</style>