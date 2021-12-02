<template>
    <svg class="com-icon" :class="className" aria-hidden="true" :style="{'width':size,'height':size,'color':color}" @click="$emit('click')">
        <use :href="id" fill="currentColor"></use>
    </svg>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';

export default defineComponent({
    name: "ComIcon",
    emits:['click'],
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
        }
    },
    setup(props) {
        const id = computed(() => `#${props.prefix}-${props.name}`);
        const className = computed(() => `${props.prefix}-${props.name}`)
        return {id, className}
    }
})

</script>
