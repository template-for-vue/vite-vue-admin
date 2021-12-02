<template>
    <div class="com-layout-menu" :class="{'is-collapsed':isCollapsed}">
        <ul class="com-layout-menu__wrap">
            <li class="com-layout-menu__item" :class="{'is-active':isDashboard}">
                <a class="com-layout-menu__link is-single" @click="handleMenuClick({rule_code:'/'})">
                    <div class="com-layout-menu__icon">
                        <com-icon name="home" size="14"></com-icon>
                    </div>
                    <cite class="com-layout-menu__title">主页</cite>
                </a>
            </li>
            <li class="com-layout-menu__item"
                :class="{
                    'is-active':(isDashboard || currPath === item.rule_code) && !item.children?.length,
                    'is-open' : ~openedMenus.indexOf(item.rule_code)
                }"
                v-for="(item,index) in menus"
                :key="item.rule_code"
                :ref="`route_${index}`">
                <a class="com-layout-menu__link is-single" @click="handleMenuClick(item)">
                    <div class="com-layout-menu__icon">
                        <com-icon :name="item.rule_icon" size="14"></com-icon>
                    </div>
                    <cite class="com-layout-menu__title">{{ item.rule_title }}</cite>
                    <span class="com-layout-menu__triangle" v-if="item.children?.length"></span>
                </a>
                <dl class="com-layout-menu__sub" v-if="item.children?.length">
                    <dd class="com-layout-menu__sub-item"
                        v-for="sub in item.children"
                        :class="{'is-sub-active' : currPath === sub.rule_code}"
                        :key="sub.rule_code">
                        <a class="com-layout-menu__sub-link" @click.stop="navigateTo(sub.link || sub.rule_code)">
                            <cite class="com-layout-menu__title">{{ sub.rule_title }}</cite>
                        </a>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import {computed, ref, watch, defineComponent} from 'vue';
import {useLayout} from "/@/layout/hook/useLayout";
import {useRouter} from "/@/shared/hooks/web/useRouter";
import {getMenuCache, MenuItem} from "/@/service/AuthRuleService";
import {Page} from "/@/router/page";

export default defineComponent({
    name: "LAYOUT_MENU",
    props: {
        unique: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {

        const {getCollapseState, setCollapseState} = useLayout()
        const isCollapsed = computed(() => getCollapseState());
        const {route, navigateTo} = useRouter();
        const currPath = computed(() => route.path);
        const isDashboard = computed(() => currPath.value === Page.DASHBOARD_WELCOME || currPath.value === Page.DASHBOARD_WORKBENCH);
        const menus = getMenuCache<MenuItem[]>() ?? [];
        const openedMenus = ref<string[]>([]);

        // +----------------------------------------------------------------------
        // | 菜单初始化
        // +----------------------------------------------------------------------

        //初始化菜单展开
        const getOpenedMenus = () => {
            if (!isCollapsed.value) {
                for (let i = 0; i < menus.length; i++) {
                    let {rule_code, children} = menus[i];
                    if (children?.length && ~currPath.value.indexOf(rule_code)) {
                        return [rule_code]
                    }
                }
                return openedMenus.value;
            }
            return []
        }

        watch(
            () => isCollapsed.value,
            () => openedMenus.value = getOpenedMenus(),
            {
                immediate: true,
            }
        )

        // +----------------------------------------------------------------------
        // | 菜单操作
        // +----------------------------------------------------------------------

        //打开菜单
        const handleOpenMenu = (path: string) => {
            if (~openedMenus.value.indexOf(path)) return;
            if (props.unique) return openedMenus.value = [path];
            openedMenus.value.push(path);
        }
        //关闭菜单
        const handleCloseMenu = (index: number) => {
            openedMenus.value.splice(index, 1)
        }

        //点击菜单
        const handleMenuClick = ({link, rule_code, children}: MenuItem) => {
            if (!children?.length) return navigateTo(link || rule_code);
            const index = openedMenus.value.indexOf(rule_code);
            if (~index) {
                handleCloseMenu(index);
            } else {
                handleOpenMenu(rule_code);
                if (isCollapsed.value) {
                    setCollapseState(false);
                }
            }
        }

        return {
            menus,
            currPath,
            isCollapsed,
            isDashboard,
            openedMenus,
            navigateTo,
            handleMenuClick
        }

    }
})

</script>

<style lang="scss" scoped>
.com-layout-menu {
    position: relative;
    @include unselect;
}

.com-layout-menu__link {
    position: relative;
    display: block;
    height: 56px;
    padding-right: 30px;
    padding-left: 50px;
    font-size: 14px;
    line-height: 56px;
    color: rgba(255, 255, 255, .7);
    cursor: pointer;
    transition: var(--transition);
}

.is-active .com-layout-menu__link,
.com-layout-menu__link:hover {
    color: var(--color-white);
}

.is-active .is-single {
    background-color: var(--color-primary);
}

.com-layout-menu__icon {
    position: absolute;
    left: 22px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;

    .com-icon {
        color: rgba(255, 255, 255, 0.7) !important;
    }
}

.com-layout-menu__title,
.com-layout-menu__triangle {
    position: relative;
    opacity: 1;
    transition: var(--transition);
    white-space: nowrap;
}

.com-layout-menu__triangle {
    position: absolute;
    right: 15px;
    top: 25px;
    @include triangle;
}

.is-open .com-layout-menu__triangle {
    top: 20px;
    border-style: dashed dashed solid;
    border-color: transparent transparent var(--color-white);
}

//子菜单
.com-layout-menu__sub {
    display: none;
    padding: 5px 0;
    background-color: rgba(0, 0, 0, .3);
    border-radius: var(--el-border-radius-base);
}

.com-layout-menu__sub-item {
    white-space: nowrap;
    cursor: pointer;
}

.com-layout-menu__sub-link {
    display: block;
    padding-left: 50px;
    padding-right: 30px;
    line-height: 40px;
    color: rgba(255, 255, 255, .7);
    transition: var(--transition);
}

.is-sub-active .com-layout-menu__sub-link,
.com-layout-menu__sub:hover {
    color: var(--color-white);
}

.is-sub-active .com-layout-menu__sub-link {
    background-color: var(--color-primary);
}

.is-open .com-layout-menu__sub {
    display: block;
}

.is-collapsed {
    .com-layout-menu__title,
    .com-layout-menu__triangle {
        opacity: 0;
    }
}
</style>