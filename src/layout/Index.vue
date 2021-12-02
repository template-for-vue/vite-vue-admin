<template>
    <div class="com-layout" :class="{'is-collapsed':isCollapsed}">
        <el-aside class="com-layout-aside">
            <div class="com-layout-logo">
                <com-icon name="semi" size="32" color="white" v-show="isCollapsed"></com-icon>
                <span v-show="!isCollapsed">业务管理系统</span>
            </div>
            <div class="com-layout-aside__scroll">
                <Menu></Menu>
            </div>
        </el-aside>
        <div class="com-layout-content">
            <Header></Header>
            <div ref="tabAndMainRef" class="com-layout-main__wrap">
                <Tabs @fullscreen="handleFullScreen"></Tabs>
                <div class="com-layout-main">
                    <com-loading :loading="loading" :absolute="true"></com-loading>
                    <router-view v-slot="{ Component,route }">
                        <suspense>
                            <template #default>
                                <transition name="fade-slide" mode="out-in" appear @before-enter="beforeEnter">
                                    <!--                                    <keep-alive :include="visitedViews">-->
                                    <component class="com-page" :is="Component"/>
                                    <!--                                    </keep-alive>-->
                                </transition>
                            </template>
                            <template #fallback>
                                <span></span>
                            </template>
                        </suspense>
                    </router-view>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import {defineComponent, computed, ref, nextTick} from 'vue';
import type {Ref} from 'vue';
import Menu from '/@/layout/Menu.vue';
import Header from "/@/layout/Header.vue";
import Tabs from "/@/layout/Tabs.vue";
import {useLayout} from "/@/layout/hook/useLayout";
import {useVisitedViews} from "/@/layout/hook/useVisitedViews";
import {useRouter} from "/@/shared/hooks/web/useRouter";
import {useFullScreen} from "/@/shared/hooks/web/useFullScreen";

export default defineComponent({
    name: "Layout",
    components: {Menu, Header, Tabs},
    setup() {
        const {getCollapseState, getPageLoadingState, setPageLoadingState} = useLayout();
        const isCollapsed = computed(() => getCollapseState());

        const {getVisitedViewsPath} = useVisitedViews();
        const visitedViews: Ref<string[]> = ref(getVisitedViewsPath());
        const {router} = useRouter();
        router.beforeEach(() => {
            visitedViews.value = getVisitedViewsPath();
        })

        //loading
        const loading = computed(() => getPageLoadingState())
        const beforeEnter = async () => {
            await nextTick();
            setPageLoadingState(false);
        }

        //全屏
        const tabAndMainRef: Ref<ElRef> = ref(null);
        const {openFullScreen} = useFullScreen();
        const handleFullScreen = () => {
            openFullScreen(tabAndMainRef.value)
        };

        return {
            isCollapsed,
            visitedViews,
            loading,
            beforeEnter,
            tabAndMainRef,
            handleFullScreen
        }
    }
})

</script>

<style lang="scss" scoped>

.com-layout {
    --menu-width: 160px;
    --menu-width-fixed: 160px;
    --header-height: 50px;
    --nav-height: 40px;
    --transition: all .2s;
}

.com-layout {
    display: flex;
    height: 100vh;
}

.com-layout-aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
    width: var(--menu-width);
    background-color: var(--color-black);
    overflow: hidden;
    transition: var(--transition);
}

.com-layout-aside__scroll {
    display: flex;
    flex-direction: column;
    width: calc(100% + 3px);
    height: calc(100vh - var(--header-height));
    overflow-y: scroll;
    overflow-x: hidden;
    @include beauty-scroll
}

.com-layout-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--menu-width);
    height: calc(var(--header-height) - 1px);
    padding: 0 10px;
    font-size: 16px;
    font-weight: 300;
    color: rgba(255, 255, 255, .8);
    background: var(--color-black);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
    overflow: hidden;
    white-space: nowrap;
    transition: var(--transition);
}


.com-layout-content {
    width: 100vw;
    padding-left: var(--menu-width);
    transition: var(--transition);
}

.com-layout-main__wrap {
    display: flex;
    flex-direction: column;
    background: var(--color-page-background);
}

.com-layout-main {
    padding: 10px;
    flex: 1 1 auto;
    height: calc(100vh - var(--header-height) - var(--nav-height));
    min-width: 800px;
    @include beauty-scroll;
    overflow: auto;
}

.com-layout.is-collapsed {
    --menu-width: 60px;
}

@media screen and (max-width: 1000px) {
    .is-collapsed {
        .com-layout-aside {
            transform: translate3d(calc(0px - var(--menu-width)), 0, 0);
        }

        .com-layout-content {
            padding-left: 0;
        }
    }
}
</style>