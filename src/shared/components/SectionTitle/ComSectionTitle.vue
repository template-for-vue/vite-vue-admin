<template>
    <h4 class="page-section-title">
        <span class="page-section-title__label" v-if="label || $slots.label">
            <slot name="label">{{ label }}</slot>
        </span>
        <span class="page-section-title__name">
            <slot>{{ title }}</slot>
        </span>
    </h4>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: "ComSectionTitle",
    props: {
        label: [String, Number],
        title: [String, Number]
    }
})

</script>
<style lang="scss" scoped>

.page-section-title {
    position: relative;
    padding-left: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    color: #111;
}
.page-section-title__label {
    margin-right: 8px;
    color: var(--color-primary);
    font-size: 24px;
    font-weight: normal;
}
.page-section-title:first-child {
    margin-top: 20px;
}

.page-section-title__name{
    font-weight: 500;
    font-size: 16px;
}
</style>