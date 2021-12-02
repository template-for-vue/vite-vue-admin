<template>
    <div class="layout-submenu is-menu-hide">
        <ul class="layout-submenu-list">
            <li class="layout-submenu-tab">
                <div class="layout-tab-dividers"></div>
                <tab-background></tab-background>
                <div class="layout-tab-content">
                    <div class="layout-tab-content__title">商品列表</div>
                </div>
            </li>
            <li class="layout-submenu-tab is-active">
                <div class="layout-tab-dividers"></div>
                <tab-background></tab-background>
                <div class="layout-tab-content">
                    <div class="layout-tab-content__title">商品列表</div>
                </div>
            </li>
            <li class="layout-submenu-tab">
                <div class="layout-tab-dividers"></div>
                <tab-background></tab-background>
                <div class="layout-tab-content">
                    <div class="layout-tab-content__title">商品列表</div>
                </div>
            </li>
            <li class="layout-submenu-tab">
                <div class="layout-tab-dividers"></div>
                <tab-background></tab-background>
                <div class="layout-tab-content">
                    <div class="layout-tab-content__title">商品列表</div>
                </div>
            </li>
        </ul>
        <!--        <div class="layout-submenu-more">-->
        <!--            <com-icon name="more"></com-icon>-->
        <!--        </div>-->
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TabBackground from './TabBackground.vue';

export default defineComponent({
    name: "LAYOUT_SUB_MENU",
    components: {TabBackground},
    setup() {
        // +----------------------------------------------------------------------
        // | XXXX
        // +----------------------------------------------------------------------
    }
})

</script>

<style lang="scss" scoped>
.layout-submenu {
    position: relative;
    bottom: -1px;
    display: flex;
    width: calc(100vw - var(--layout-menu-width) - var(--layout-header-controller-width));
    height: var(--layout-header-nav-height);
    overflow-x: hidden;

    .el-button + .el-button {
        margin-left: 10px;
    }
}

.layout-submenu.is-menu-hide {
    padding-right: 40px;
}

.layout-submenu-list {
    display: flex;
    align-items: flex-end;
}

.layout-submenu-more {
    position: absolute;
    right: 0;
    top: calc(var(--layout-header-height) / 2 - 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: var(--color-white);
    cursor: pointer;
    @include transition();
}

.layout-submenu-more:hover {
    background: var(--hover-color-primary);
}

.layout-submenu-tab {
    position: relative;
    width: 150px;
    height: 34px;
    line-height: 32px;
    margin-right: -20px;
    vertical-align: bottom;
    font-size: 14px;
    cursor: pointer;

    --tab-background-color:#dee1e6;
}

.layout-tab-dividers {
    position: absolute;
    height: 14px;
    top: 50%;
    left: 8px;
    right: 8px;
    margin-top: -7px;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        transition: opacity .2s ease;
        left: 1px;
        background-color: #a9adb0;
    }
}

.layout-tab-content {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    @include unselect;
}

.layout-tab-content__title {
    position: absolute;
    height: 100%;
    left: 24px;
    right: 26px;
    color: #97a8be;
    -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);
    overflow: hidden;
    white-space: nowrap;
}
.layout-submenu-tab:first-child {
    .layout-tab-dividers::before{
        display: none;
    }
}
.layout-submenu-tab:hover {
    .layout-tab-content__title {
        color: #999;
    }
    .layout-submenu-tab__background{
        opacity: 1;
    }
}
.layout-submenu-tab.is-active{
    --tab-background-color:var(--color-white);
    z-index:2;
    .layout-submenu-tab__background{
        opacity: 1;
    }
}
</style>