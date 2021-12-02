<template>
    <div class="layout-submenu-tab__background">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <symbol id="tab-geometry-left" viewBox="0 0 214 36">
                    <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"></path>
                </symbol>
                <symbol id="tab-geometry-right" viewBox="0 0 214 36">
                    <use href="#tab-geometry-left"></use>
                </symbol>
                <clipPath id="crop">
                    <rect class="mask" width="100%" height="100%" x="0"></rect>
                </clipPath>
            </defs>
            <svg width="52%" height="100%">
                <use href="#tab-geometry-left" width="214" height="36" class="tab-geometry" fill="var(--tab-background-color)"></use>
            </svg>
            <g transform="scale(-1, 1)">
                <svg width="52%" height="100%" x="-100%" y="0">
                    <use href="#tab-geometry-right" width="214" height="36" class="tab-geometry" fill="var(--tab-background-color)"></use>
                </svg>
            </g>
        </svg>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: "TabBackground"
})

</script>

<style lang="scss" scoped>
.layout-submenu-tab__background{
    position: absolute;
    z-index: 1;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    svg{
        display: block;
        width: 100%;
        height: 100%;
        box-shadow: 10px 0 10px -10px #c7c7c7;
    }
}
</style>