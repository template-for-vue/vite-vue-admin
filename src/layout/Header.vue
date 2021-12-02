<template>
    <div class="com-layout-header">
        <div class="com-layout-header__left">
            <ul class="com-layout-header__wrap">
                <li class="com-layout-header__item">
                    <a class="com-layout-header__link" @click.stop="handleToggleMenu">
                        <com-icon :name="`spread-${isCollapsed ? 'right' : 'left'}`"></com-icon>
                    </a>
                </li>
            </ul>
        </div>
        <div class="com-layout-header__right">
            <ul class="com-layout-header__wrap">
                <li class="com-layout-header__item">
                    <div class="com-layout-header__link" @click.stop="handleToggleScreen">
                        <com-icon :name="`full-${isFullScreen ? 'close' : 'open'}-line`" size="18"></com-icon>
                    </div>
                </li>
                <li class="com-layout-header__item">
                    <div class="com-layout-header__link">
                        <com-icon name="notice" size="18"></com-icon>
                    </div>
                </li>
                <li class="com-layout-header__item user_name">
                    <el-popover popper-class="com-table-header__popover" v-model:visible="isUserMenuShow" width="120px"
                                :offset="-0.5">
                        <template #reference>
                            <div class="com-layout-header__link">
                                <span class="com-layout-header-item__avatar"
                                      :style="`background-image:url('${defaultAvatar}')`"></span>
                                <span>{{ userName }}</span>
                            </div>
                        </template>
                        <div class="com-layout-header__item-pop">
                            <ul class="com-layout-header__user-menu com-pop" @click="handleToggleUserMenu">
                                <li class="com-pop-item user-menu-item">
                                    <com-icon name="password-line"></com-icon>
                                    <span>修改密码</span>
                                </li>
                                <li class="com-pop-item user-menu-item">
                                    <com-icon name="clear-line"></com-icon>
                                    <span>清空缓存</span>
                                </li>
                                <li class="user-menu-item__divider"></li>
                                <li class="com-pop-item user-menu-item">
                                    <com-icon name="quit-line"></com-icon>
                                    <span>退出系统</span>
                                </li>
                            </ul>
                        </div>
                    </el-popover>
                </li>
                <li class="com-layout-header__item">
                    <div class="com-layout-header__link">
                        <com-icon name="setting-line" size="18"></com-icon>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref} from 'vue';
import defaultAvatar from '/@/assets/logo.png';
import {useLayout} from "/@/layout/hook/useLayout";
import {useFullScreen} from "/@/shared/hooks/web/useFullScreen";
import {getUserInfoStore} from "/@/service/AuthRuleService";

export default defineComponent({
    name: "LAYOUT_HEADER",
    setup() {

        const {getCollapseState, setCollapseState} = useLayout()
        const isCollapsed = computed(() => getCollapseState());
        const handleToggleMenu = () => setCollapseState(!isCollapsed.value);

        // +----------------------------------------------------------------------
        // | 用户信息
        // +----------------------------------------------------------------------

        const userName = getUserInfoStore('real_name') || 'Hello Guest';
        const isUserMenuShow = ref(false);
        const handleToggleUserMenu = (e: any) => {
            if (e.target.tagName !== 'UL') isUserMenuShow.value = false;
        }

        // +----------------------------------------------------------------------
        // | 全屏
        // +----------------------------------------------------------------------

        const isFullScreen = ref(false);
        const {openFullScreen, closeFullScreen} = useFullScreen();
        const handleToggleScreen = () => {
            if (isFullScreen.value) {
                closeFullScreen();
            } else {
                openFullScreen();
            }
            isFullScreen.value = !isFullScreen.value
        }

        return {
            isCollapsed,
            handleToggleMenu,
            isFullScreen,
            handleToggleScreen,
            isUserMenuShow,
            handleToggleUserMenu,
            userName,
            defaultAvatar
        }
    }
})

</script>

<style lang="scss" scoped>

.com-layout-header {
    height: var(--header-height);
    padding: 0;
    border-bottom: 1px solid var(--color-border-sep);
    background-color: var(--color-white);
    line-height: 0;
    transition: var(--transition);
    @include unselect;
}

.com-layout-header__left {
    position: relative;
    float: left;
    padding-right: 10px;
    overflow: hidden;
    color: #606266;
}

.com-layout-header__right {
    position: relative;
    float: right;
    color: #606266;
}

.com-layout-header__wrap {
    @include unselect;
    @include clear;
}

.com-layout-header__item {
    position: relative;
    float: left;
    padding: 0 2px;
    height: var(--header-height);
    line-height: var(--header-height);
    cursor: pointer;

    &:hover {
        background: #f6f6f6;
    }
}

.com-layout-header__link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 10px;
    transition: var(--transition);
}

.com-layout-header-item__avatar {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    margin-right: 10px;
    background: no-repeat #f6f6f6 center center;
    background-size: contain;
}

.com-layout-header__item-pop {
    min-width: 100%;
    left: -1px;
}

.user-menu-item__divider {
    height: 1px;
    margin: 4px 0;
    overflow: hidden;
    line-height: 0;
    background-color: var(--color-border-sep);
}

.user-menu-item {
    display: flex;
    align-items: center;

    .com-icon {
        margin-right: 10px;
    }
}
</style>