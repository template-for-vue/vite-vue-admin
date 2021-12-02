<template>
    <div class="com-layout-tabs">
        <div class="com-layout-tabs__control home"
             :class="{'is-active' : isDashboard}"
             @click.stop="navigateTo(welcomePage)">
            <com-icon name="home"></com-icon>
        </div>
        <div class="com-layout-tabs__control left">
            <com-icon name="arrow-double-left" size="18"></com-icon>
        </div>
        <div class="com-layout-tabs__control right">
            <com-icon name="arrow-double-right" size="18"></com-icon>
        </div>
        <el-popover popper-class="com-table-header__popover"
                    v-model:visible="isShowMore"
                    width="112"
                    :offset="-0.5"
                    :show-arrow="false">
            <template #reference>
                <div class="com-layout-tabs__control more">
                    <com-icon name="arrow-down" size="18"></com-icon>
                </div>
            </template>
            <ul class="com-pop">
                <li class="com-pop-item" @click="closeCurrentViewTabs(currPath)">关闭当前标签页</li>
                <li class="com-pop-item" @click="closeOtherViewTabs(currPath)">关闭其他标签页</li>
                <li class="com-pop-item" @click="closeAllViewTabs(currPath)">关闭所有标签页</li>
            </ul>
        </el-popover>
        <div class="com-layout-tabs__control fullscreen" @click.stop="handleToggleScreen">
            <com-icon :name="`full-${isFullScreen ? 'close' : 'open'}-fill`" size="18"></com-icon>
        </div>
        <div class="com-layout-tabs__wrap" ref="tabRef">
            <ul class="com-layout-tabs__list" ref="tabListRef" :style="`transform:translateX(${tabLeft}px)`">
                <li class="com-layout-tabs__item" v-for="tag in visitedViews"
                    :class="{'is-active':tag.path === currPath}"
                    :key="tag.path"
                    @click="navigateTo(tag.path)">
                    <span class="com-layout-tabs__item-title">{{ tag.name }}</span>
                    <div class="com-layout-tabs__item-close" @click.stop="closeCurrentViewTabs(tag.path)">
                        <com-icon name="close"></com-icon>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, ref, watch} from 'vue';
import {useRouter} from "/@/shared/hooks/web/useRouter";
import {Page} from "/@/router/page";
import {useVisitedViews} from "/@/layout/hook/useVisitedViews";
import {isNullOrUnDef} from "/@/shared/utils/is";
import {useFullScreen} from "/@/shared/hooks/web/useFullScreen";
import {useSetting} from "/@/shared/setting/hook/useSetting";
import {getAuthCache} from "/@/service/AuthRuleService";

export default defineComponent({
    name: "LayoutTabs",
    emits: ['fullscreen'],
    setup(_props, {emit}) {

        const {route, navigateTo} = useRouter();
        const currPath = computed(() => route.path);

        // +----------------------------------------------------------------------
        // | 授权路由
        // +----------------------------------------------------------------------
        const authPaths: Recordable = getAuthCache<any>();
        const routeName = computed(() => authPaths[route.path] || '');
        const welcomePage = Page.DASHBOARD_WELCOME;
        const isDashboard = computed(() => currPath.value === welcomePage || currPath.value === Page.DASHBOARD_WORKBENCH);

        // +----------------------------------------------------------------------
        // | 标签
        // +----------------------------------------------------------------------

        const {getVisitedViews, setVisitedViews} = useVisitedViews();
        const visitedViews = ref(getVisitedViews());
        const isShowMore = ref(false);
        const {projectSetting: {headerTabNumber = 10}} = useSetting();
        const addViewTabs = () => {
            if (authPaths?.[currPath.value]) {
                const isSameView = visitedViews.value.some(v => {
                    if (v.path === currPath.value) {
                        v.query = route.query;
                        v.name = routeName.value;
                        return true;
                    }
                })
                if (!isSameView) {
                    if (visitedViews.value.length >= headerTabNumber) {
                        visitedViews.value.splice(0, 1);
                    }
                    visitedViews.value = visitedViews.value.concat({
                        path: currPath.value,
                        query: route.query,
                        name: routeName.value
                    })
                }
            }
        }

        watch(
            () => route.path,
            () => {
                addViewTabs();
                nextTick(() => {
                    for (let i = 0; i < visitedViews.value.length; i++) {
                        if (visitedViews.value[i].path === currPath.value) {
                            return handleGoByIndex(i);
                        }
                    }
                })
            },
            {immediate: true}
        )
        watch(() => visitedViews.value, (val) => setVisitedViews(val));

        //关闭当前标签
        const closeCurrentViewTabs = (path: string) => {
            let index: Nullable<number> = null;
            for (const [i, v] of visitedViews.value.entries()) {
                if (v.path === path) {
                    index = i;
                    break;
                }
            }
            !isNullOrUnDef(index) && visitedViews.value.splice(index, 1);
            if (currPath.value === path) {
                const lastView = visitedViews.value.slice(-1)[0];
                navigateTo({
                    path: lastView?.path || '/',
                    query: lastView?.query || {}
                })
            }
            isShowMore.value = false;
        }
        //关闭其他标签
        const closeOtherViewTabs = () => {
            if (visitedViews.value.length > 1) {
                visitedViews.value = [{path: currPath.value, query: route.query, name: routeName.value}]
            }
            isShowMore.value = false;
        }
        //关闭当前标签
        const closeAllViewTabs = () => {
            if (visitedViews.value.length > 0) {
                visitedViews.value = [];
                navigateTo('/')
            }
            isShowMore.value = false;
        }
        //标签定位
        const tabLeft = ref(0);
        const tabRef = ref<ElRef>(null);
        const tabListRef = ref<ElRef>(null);

        //向右定位标签
        const handleGoRight = () => {
            const mainWidth = (tabRef.value as any)?.offsetWidth;
            const children = (tabListRef.value as Element).children;
            for (let i = 0; i < children.length; i++) {
                let {offsetLeft, offsetWidth} = children[i] as any;
                if (offsetLeft + offsetWidth + tabLeft.value - mainWidth > 0) {
                    tabLeft.value = -offsetLeft;
                    break;
                }
            }
        }

        //向左定位标签
        const handleGoLeft = () => {
            const mainWidth = (tabRef.value as any)?.offsetWidth;
            const children = (tabListRef.value as Element).children;
            for (let i = 0; i < children.length; i++) {
                let {offsetLeft} = children[i] as any;
                if (offsetLeft - Math.abs(tabLeft.value) >= 0) {
                    tabLeft.value = Math.min(-(offsetLeft - mainWidth), 0);
                    break;
                }
            }
        };

        //根据索引定位标签
        const handleGoByIndex = (index: number) => {
            const mainWidth = (tabRef.value as any)?.offsetWidth;
            const children = (tabListRef.value as Element).children;
            const {offsetLeft, offsetWidth} = children[index] as any;
            const left = Math.abs(tabLeft.value);
            //在展示范围内不做处理
            if ((offsetLeft - left >= 0) && (offsetLeft + offsetWidth - left <= mainWidth)) return;
            if (offsetLeft - mainWidth / 2 > 0) {
                tabLeft.value = -(offsetLeft - mainWidth + offsetWidth);
            } else {
                const i = index - 1 < 0 ? 0 : index - 1;
                tabLeft.value = -(children[i] as any).offsetLeft;
            }
        };

        // +----------------------------------------------------------------------
        // | 全屏
        // +----------------------------------------------------------------------

        const isFullScreen = ref(false);
        const {closeFullScreen} = useFullScreen();
        const handleToggleScreen = () => {
            if (isFullScreen.value) {
                closeFullScreen();
            } else {
                emit('fullscreen');
            }
            isFullScreen.value = !isFullScreen.value;
        }

        return {
            currPath,
            isDashboard,
            welcomePage,
            navigateTo,
            isShowMore,
            closeCurrentViewTabs,
            closeOtherViewTabs,
            closeAllViewTabs,
            visitedViews,
            tabRef,
            tabListRef,
            tabLeft,
            handleGoRight,
            handleGoLeft,
            handleGoByIndex,
            handleToggleScreen,
            isFullScreen
        }
    }
})

</script>

<style lang="scss" scoped>
.com-layout-tabs {
    position: relative;
    z-index: 2;
    height: var(--nav-height);
    line-height: var(--nav-height);
    padding: 0 120px 0 80px;
    background-color: var(--color-white);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    @include unselect;
    transition: var(--transition);
}

.com-layout-tabs__control {
    position: absolute;
    top: 0;
    width: var(--nav-height);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #666;
    overflow: hidden;
    border-right: 1px solid var(--color-border-sep);
    transition: var(--transition);
}

.com-layout-tabs__control {
    &:hover {
        background-color: #f6f6f6;
    }

    &.left {
        left: 0;
    }

    &.home {
        left: 40px;
    }

    &.right {
        right: 80px;
        border-left: 1px solid var(--color-border-sep);
    }

    &.more {
        right: 40px;
        overflow: visible;
        @include unselect;
    }

    &.fullscreen {
        border-right: none;
        right: 0;
    }
}

.com-layout-tabs__wrap {
    overflow: hidden;
}

.com-layout-tabs__list {
    position: relative;
    left: 0;
    font-size: 0;
    line-height: 0;
    white-space: nowrap;
    transition: var(--transition);
}

.com-layout-tabs__item {
    position: relative;
    display: inline-block;
    padding: 0 40px 0 15px;
    max-width: 160px;
    height: var(--nav-height);
    line-height: var(--nav-height);
    text-align: center;
    font-size: 14px;
    border-right: 1px solid var(--color-border-sep);
    color: #666;
    cursor: pointer;
}

.com-layout-tabs__item::after,
.com-layout-tabs__control.home::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-black);
    transform: translate3d(-100%, 0, 0);
    transition: transform .3s;
}

.com-layout-tabs__control.home:hover,
.com-layout-tabs__control.home.is-active,
.com-layout-tabs__item:hover,
.com-layout-tabs__item.is-active {
    background-color: #f6f6f6;

    .com-layout-tabs__item-title {
        color: var(--color-black);
    }

    &::after {
        transform: translate3d(0, 0, 0);
    }
}

.com-layout-tabs__item-close {
    position: absolute;
    right: 8px;
    top: 12px;
    line-height: 16px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: var(--transition);
}

.com-layout-tabs__item-close:hover {
    .com-icon {
        color: var(--color-white) !important;
    }

    background-color: var(--color-primary);
}
</style>