<template>
    <div class="com-spin">
        <span class="com-spin-dot">
            <i class="com-spin-dot-item"></i>
            <i class="com-spin-dot-item"></i>
            <i class="com-spin-dot-item"></i>
            <i class="com-spin-dot-item"></i>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ComSpin'
});
</script>

<style lang="scss" scoped>
.com-spin {
    display: inline-block;
    margin: 0;
    padding: 0;
    transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    opacity: 1;
}

.com-spin-dot {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    transform: rotate(45deg);
    animation: comLoadingSpinRotate 1.2s infinite linear;
}

.com-spin-dot-item {
    position: absolute;
    display: block;
    width: 9px;
    height: 9px;
    background-color: var(--color-primary);
    border-radius: 100%;
    transform: scale(0.75);
    transform-origin: 50% 50%;
    opacity: 0.3;
    animation: comLoadingSpinShine 1s infinite linear alternate;
}

.com-spin-dot-item {
    width: 14px;
    height: 14px;
}

.com-spin-dot-item:nth-child(1) {
    top: 0;
    left: 0;
}

.com-spin-dot-item:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
}

.com-spin-dot-item:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s
}

.com-spin-dot-item:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 1.2s;
}

</style>

<style>
@keyframes comLoadingSpinRotate {
    100% {
        transform: rotate(405deg);
    }
}

@keyframes comLoadingSpinShine {
    100% {
        opacity: 1;
    }
}
</style>
