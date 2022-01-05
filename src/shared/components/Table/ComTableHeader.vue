<template>
    <div class="com-table-header">
        <span class="com-table-title" v-if="title">{{ title }}</span>
        <div class="com-table-toolbar" v-if="$slots.button || toolbar">
            <template v-if="$slots.button">
                <div class="com-table-header__button-wrap">
                    <slot name="button"></slot>
                    <el-divider v-if="toolbar" class="com-table-header__button-divider" direction="vertical"></el-divider>
                </div>
            </template>
            <div class="com-table-settings" v-if="toolbar">
                <el-tooltip content="刷新" placement="top">
                    <div class="com-table-settings__icon" @click.stop="$emit('refresh')">
                        <com-icon name="refresh" size="18" color="#262626"></com-icon>
                    </div>
                </el-tooltip>
                <el-popover popper-class="com-table-header__popover" width="60">
                    <template #reference>
                        <div class="com-table-settings__icon">
                            <com-icon name="height" size="18" color="#262626"></com-icon>
                        </div>
                    </template>
                    <ul class="com-table-size__pop">
                        <li class="com-table-size__pop-item"
                            :class="{'is-curr':size===key}"
                            v-for="(value,key) in tableSizeMap"
                            @click.stop="handleTableSizeChange(key)">{{ value }}
                        </li>
                    </ul>
                </el-popover>
                <el-popover popper-class="com-table-header__popover" width="60">
                    <template #reference>
                        <div class="com-table-settings__icon">
                            <com-icon name="setting-line" size="18" color="#262626"></com-icon>
                        </div>
                    </template>
                    <div class="com-table-settings__column">
                        <div class="com-table-settings__column-head">
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">
                                全选
                            </el-checkbox>
                            <div class="com-table-settings__column-reset" @click="handleColumnsReset">
                                重置
                            </div>
                        </div>
                        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                            <div class="com-table-settings__column-list">
                                <draggable
                                    v-model="columnsRef"
                                    item-key="prop"
                                    handle=".com-table-settings__icon-wrap"
                                    @end="handleSort">
                                    <template #item="{element,index}">
                                        <div class="com-table-settings__column-item">
                                            <div class="com-table-settings__icon-wrap">
                                                <com-icon name="move"></com-icon>
                                            </div>
                                            <el-checkbox :key="element.prop" :label="element.prop">{{ element.label }}
                                            </el-checkbox>
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </el-checkbox-group>
                    </div>
                </el-popover>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, unref, computed, toRaw} from 'vue';
import type {PropType} from 'vue';
import Draggable from 'vuedraggable';
import {TableCol, TableSize} from "/@/shared/components/Table/types/table";
import {isFunction} from "/@/shared/components/Table/utils";
import {
    ElPopover, ElCheckbox, ElCheckboxGroup, ElDivider, ElTooltip
} from 'element-plus'

export default defineComponent({
    name: "ComTableHeader",
    components: {Draggable, ElPopover, ElCheckbox, ElCheckboxGroup, ElDivider, ElTooltip},
    emits: ['update:size', 'refresh'],
    props: {
        title: String,
        toolbar: {
            type: Boolean,
            default: true
        },
        size: String as PropType<TableSize>,
        columns: Array as PropType<TableCol[]>,
        setColumns: Function
    },
    setup(props, {emit}) {

        // +----------------------------------------------------------------------
        // | 尺寸控制
        // +----------------------------------------------------------------------

        const tableSizeMap = {
            large: '宽松',
            small: '中等',
            mini: '紧凑'
        }

        const isTableSizeShow = ref(false);
        const handleTableSizeChange = (size: TableSize) => {
            isTableSizeShow.value = false;
            emit('update:size', size);
        }

        // +----------------------------------------------------------------------
        // | 列设置
        // +----------------------------------------------------------------------

        const columnsRef = ref(props.columns);

        //获取列prop数组
        const getColumnsPropsRef = computed(() => {
            return columnsRef.value!.map((column) => column.prop);
        })

        const checkAll = ref(true);
        const isIndeterminate = ref(false);
        const checkedColumns = ref(unref(getColumnsPropsRef));

        const resultColumns = computed(() => {
            const temp = toRaw(unref(checkedColumns));
            temp.sort((prev, next) => {
                return (
                    unref(getColumnsPropsRef).indexOf(prev) -
                    unref(getColumnsPropsRef).indexOf(next)
                )
            })
            return temp;
        })

        const setColumns = () => {
            const {setColumns} = props;
            if (setColumns && isFunction(setColumns)) {
                setColumns(unref(resultColumns))
            }
        }

        const handleCheckAll = (val: any) => {
            checkedColumns.value = val ? unref(getColumnsPropsRef) : [];
            isIndeterminate.value = false;
            checkAll.value = val;
            setColumns()
        }
        const handleCheckedColumnsChange = (value: any) => {
            const checkedCount = value.length;
            checkAll.value = checkedCount === unref(getColumnsPropsRef).length;
            isIndeterminate.value = checkedCount > 0 && checkedCount < props.columns!.length;
            setColumns()
        }
        const handleColumnsReset = () => {
            handleCheckAll(true);
        }

        // +----------------------------------------------------------------------
        // | 拖拽排序
        // +----------------------------------------------------------------------

        const handleSort = () => {
            setColumns()
        }

        return {
            columnsRef,
            getColumnsPropsRef,
            tableSizeMap,
            isTableSizeShow,
            handleTableSizeChange,
            checkedColumns,
            checkAll,
            isIndeterminate,
            handleCheckAll,
            handleCheckedColumnsChange,
            handleColumnsReset,
            handleSort
        }
    }
})

</script>

<style lang="scss" scoped>
.com-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    padding-top: 8px;
    @include unselect;
}

.com-table-title {
    padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    @include unselect;
}

.com-table-toolbar {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    min-height: 32px;
}

.com-table-header__button-wrap {
    margin-right: 8px;
}

.com-table-settings {
    display: flex;
    align-items: center;
    justify-content: center;
}

.com-table-settings__icon {
    position: relative;
    display: flex;
    cursor: pointer;

    .icon-font {
        font-size: 18px;
    }
}

.com-table-settings__icon {
    margin-right: 16px;
}

.com-table-size__pop {
    white-space: nowrap;
    padding: 5px 0;
}

.com-table-size__pop-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 16px;
    line-height: 22px;
    cursor: pointer;

    &:hover {
        background-color: #F5F7FA;
    }
}

.com-table-size__pop-item.is-curr {
    background: #0960bd1a;
    color: var(--color-primary);
}

.com-table-settings__column-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
    padding: 0 16px 0 30px;
    border-bottom: 1px solid var(--color-border-sep);
}

.com-table-settings__column-reset {
    margin-left: 14px;
    cursor: pointer;
}

.com-table-settings__column-list {
    padding: 8px 0;
}

.com-table-settings__column-item {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 16px 0 4px;
}

.com-table-settings__icon-wrap {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    cursor: move;
}
.com-table-header__button-divider{
    display: none;
    margin-left: 16px;
}
.el-button + .com-table-header__button-divider,
.com-table-header__slot + .com-table-header__button-divider,
.router-link + .com-table-header__button-divider{
    display: inline-block;
}
</style>