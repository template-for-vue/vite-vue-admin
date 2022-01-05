<template>
    <span class="com-icon-wrap" :style="{'height':size,'line-height':size}">
        <svg class="com-icon" :class="className" aria-hidden="true" :style="{'width':size,'height':size,'color':color,'cursor':pointer ? 'pointer' : ''}"
             @click="$emit('click')">
            <use :href="id" fill="currentColor"></use>
        </svg>
        <span class="com-icon-text" v-if="$slots.default">
            <slot></slot>
        </span>
    </span>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';

export default defineComponent({
    name: "ComIcon",
    emits: ['click'],
    props: {
        prefix: {
            type: String,
            default: 'icon'
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#606266'
        },
        size: {
            type: [Number, String],
            default: '16px'
        },
        pointer: Boolean
    },
    setup(props) {
        const id = computed(() => `#${props.prefix}-${props.name}`);
        const className = computed(() => `${props.prefix}-${props.name}`)
        return {id, className}
    }
})

</script>
<style>
.com-icon-wrap{
    display: inline-flex;
    vertical-align:middle;
}
.com-icon-text{
    margin-left: 4px;
}
</style>