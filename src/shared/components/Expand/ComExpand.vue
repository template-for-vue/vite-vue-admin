<template>
    <div class="com-expand">
        <com-icon name="tiny-loading" class="com-expand-icon com-expand-icon__loading" v-if="loading"
                  color="var(--color-primary)"></com-icon>
        <com-icon :name="isExpand ? 'collapse' : 'expand'" class="com-expand-icon" v-show="!loading"
                  color="var(--color-primary)"
                  @click="$emit('click')"></com-icon>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'ComExpand',
    emits: ['click'],
    props: {
        loading: Boolean,
        isExpand: Boolean
    }
});
</script>

<style lang="scss">
.com-expand {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    @include unselect();
}

.com-expand-icon {
    font-size: 16px;
}

.com-expand-icon__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    animation: expand_loading 1.5s 0s cubic-bezier(.17, .37, .43, .67) infinite;
}

@keyframes expand_loading {
    50% {
        transform: rotate(180deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
