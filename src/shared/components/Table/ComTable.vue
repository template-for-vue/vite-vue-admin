<template>
    <div :class="getTableClass">
        <com-form v-if="getProps.form" @register="formRegister" @submit="handleSearch">
            <template #@TableFormButton>
                <el-button @click="handleReset">重置</el-button>
                <el-button type="primary" :loading="loading" @click="handleSearch">搜索</el-button>
            </template>
        </com-form>
        <com-table-header
            v-if="getTableHeaderShowRef"
            :title="getTableHeaderRef.title"
            :toolbar="getTableHeaderRef.toolbar"
            :columns="getColumns({ignoreIndex:true,ignoreAction:true})"
            v-model:size="tableSizeRef"
            :setColumns="setColumns"
            @refresh="handleSearch">
            <template #[getTableHeaderRef.buttonRender]>
                <slot :name="getTableHeaderRef.buttonRender"></slot>
            </template>
        </com-table-header>
        <el-table
            v-bind="getBindProps"
            ref="tableElRef"
            :tree-props="{ children: 'null', hasChildren: 'null' }"
            :row-style="getRowStyle"
            :expand-row-keys="expands"
            @sort-change="handleSortChange"
            @select="onSelectionChange"
            @select-all="onSelectAll"
            @row-click="getBindProps.onRowClick">
            <template v-for="col in getViewColumns">
                <template v-if="col.children && col.children.length > 0">
                    <el-table-column :label="col.label">
                        <template v-for="(childCol,childIndex) in col.children">
                            <com-table-item :table-props="getBindProps" :column="childCol"
                                            :colIndex="childIndex">
                                <template #[slot]="scope" v-for="slot in Object.keys($slots)">
                                    <slot :name="slot" v-bind="scope || {}"></slot>
                                </template>
                            </com-table-item>
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <com-table-item :table-props="getBindProps" :column="col">
                        <template #[slot]="scope" v-for="slot in Object.keys($slots)">
                            <slot :name="slot" v-bind="scope || {}"></slot>
                        </template>
                    </com-table-item>
                </template>
            </template>
        </el-table>
        <template v-if="getPaginationRef.vshow && getPaginationRef.total > 0">
            <el-pagination
                class="com-table-pagination"
                v-if="getPaginationRef.total - getPaginationRef.page_size > 0"
                v-model:currentPage="getPaginationRef.page_index"
                :page-size="getPaginationRef.page_size"
                :page-sizes="[10,15,20,50,100]"
                :total="getPaginationRef.total"
                :layout="getPaginationLayout"
                background
                @size-change="handlePageSizeChange"
                @current-change="handlePageIndexChange"
            ></el-pagination>
            <el-pagination
                v-else
                background
                class="com-table-pagination"
                layout="->,prev,pager,next"
                :total="getPaginationRef.total"
                @size-change="handlePageSizeChange"
                @current-change="handlePageIndexChange"
            ></el-pagination>
        </template>
    </div>
</template>

<script lang="ts">
import {ComputedRef, onMounted} from 'vue';
import {computed, defineComponent, provide, ref, unref} from 'vue';
import {useDataSource} from './hooks/useDataSource';
import type {TableActionType, TableProps, TableRow} from "/@/shared/components/Table/types/table";
import {useColumns} from "/@/shared/components/Table/hooks/useColumns";
import {useTree} from "/@/shared/components/Table/hooks/useTree";
import {isFunction} from "/@/shared/components/Table/utils";
import {useExpand} from "/@/shared/components/Table/hooks/useExpand";
import {OnSortChangeContext, useSort} from "/@/shared/components/Table/hooks/useSort";
import {useSelection} from "/@/shared/components/Table/hooks/useSelection";
import {useTableEvents} from "/@/shared/components/Table/hooks/useTableEvents";
import {usePagination} from "/@/shared/components/Table/hooks/usePagination";
import {useHeader} from "/@/shared/components/Table/hooks/useHeader";
import {useForm} from "/@/shared/components/Form/hooks/useForm";
import {FormSchema} from "/@/shared/components/Form/types/form";
import {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton
} from 'element-plus';

export default defineComponent({
    name: "ComTable",
    inheritAttrs: false,
    components: {
        ElTable,
        ElTableColumn,
        ElPagination,
        ElButton
    },
    emits: ['register'],
    setup(props, {emit, slots}) {

        // +----------------------------------------------------------------------
        // | 基础变量
        // +----------------------------------------------------------------------

        const tableElRef = ref<Nullable<TableActionType>>(null);
        const tablePropsRef = ref<Partial<TableProps>>();

        const getProps = computed(() => {
            return {...props, ...unref(tablePropsRef)} as TableProps;
        })
        const setProps = (props: Partial<TableProps>) => {
            tablePropsRef.value = {...unref(tablePropsRef), ...props};
        }

        // +----------------------------------------------------------------------
        // | Table 数据
        // +----------------------------------------------------------------------

        const loading = ref(false);

        const {
            toggleRowSelection,
            toggleAllSelection,
            clearSort,
            doLayout,
            getTableRef
        } = useTableEvents({tableElRef});

        const {
            getPaginationRef,
            getPagination,
            setPagination,
            getPaginationLayout
        } = usePagination({getProps});

        const {getCurrentSort, OnSortChange} = useSort(getProps);

        const {
            getViewColumns,
            getColumns,
            setColumns
        } = useColumns({getProps, getTableRef})

        const {
            getRowKey,
            getDataSourceRef,
            getDataSource,
            setDataSource,
            handleReset,
            handleSearch,
            handlePageIndexChange,
            handlePageSizeChange,
        } = useDataSource({
            loading,
            getProps,
            setProps,
            getViewColumns,
            getPaginationRef,
            setPagination,
            getCurrentSort,
            clearSort
        });

        const handleSortChange = (onSortChangeContext: OnSortChangeContext) => {
            OnSortChange(onSortChangeContext);
            handleSearch();
        }

        const getBindProps: ComputedRef<TableProps> = computed(() => {
            const data = unref(getDataSourceRef);
            let bindProps: Recordable = {
                border: true,
                ...unref(getProps),
                size: unref(tableSizeRef),
                rowKey: unref(getRowKey),
                data
            };
            [
                'columns',
                'sortMap',
                'onSort',
                'onExpandChange',
                'onSelectionChange',
                'onSelectAll',
                'getRemoteDataSource',
                'dataSource',
                'formMethods',
                'header',
                'form'
            ].forEach((key) => {
                delete bindProps[key];
            })
            return bindProps;
        })

        // +----------------------------------------------------------------------
        // | 树展开及行展开
        // +----------------------------------------------------------------------

        const {
            treeExpandProps,
            treeRowStyle,
            treeExpands,
            treeExpandClick,
            handleTreeExpandAll,
            handleTreeCollapseAll
        } = useTree(getProps, getRowKey, getDataSourceRef);

        const {
            expands,
            expandClick,
            handleExpandAll,
            handleCollapseAll
        } = useExpand(getProps, getRowKey, getDataSourceRef);

        provide('USE_TREE', {treeExpandProps, treeExpands, treeExpandClick});
        provide('USE_EXPAND', {getRowKey, expands, expandClick});

        // +----------------------------------------------------------------------
        // | 表格方法
        // +----------------------------------------------------------------------

        const tableAction: TableActionType = {
            setProps,
            handleReset,
            handleSearch,
            getDataSource,
            setDataSource,
            getColumns,
            setColumns,
            getPagination,
            setPagination,
            handleExpandAll,
            handleCollapseAll,
            handleTreeExpandAll,
            handleTreeCollapseAll,
            toggleRowSelection,
            toggleAllSelection,
            clearSort,
            doLayout,
            getTableRef
        }
        emit('register', tableAction);
        // +----------------------------------------------------------------------
        // | 表单
        // +----------------------------------------------------------------------

        const getFormPropsRef = computed(() => {
            const {form} = unref(getProps);
            if (form) {
                form.rowProps = form.rowProps ?? {gutter: 16};
                form.colProps = form.colProps ?? {span: 6};
                form.className = 'el-form el-table-form__search';
                (form.schemas as FormSchema[])?.push({
                    renderItem: '@TableFormButton'
                })
            }
            return form;
        })

        const [formRegister, formMethods] = unref(getFormPropsRef) ? useForm(unref(getFormPropsRef)) : [];
        formMethods && setProps({formMethods})

        // +----------------------------------------------------------------------
        // | 表格头部
        // +----------------------------------------------------------------------

        const {
            handleTableSizeChange,
            getTableHeaderShowRef,
            getTableHeaderRef,
            tableSizeRef
        } = useHeader({getProps, slots})

        // +----------------------------------------------------------------------
        // | 样式
        // +----------------------------------------------------------------------

        const getRowStyle = ({row}: { row: TableRow }) => {
            let style = '';
            const {rowStyle} = unref(getProps);
            if (isFunction(rowStyle)) {
                style += rowStyle({row});
            }
            if (unref(getViewColumns)[0]?.type === 'tree') {
                style += treeRowStyle({row});
            }
            return style;
        };

        const getTableClass = computed(() => {
            let className = ['com-table'];
            if (unref(getViewColumns)[0]?.type === 'expand') {
                className.push('com-table_with-expand')
            }
            return className;
        })


        // +----------------------------------------------------------------------
        // | selection
        // +----------------------------------------------------------------------

        const {
            onSelectionChange,
            onSelectAll,
            getDataSourceMapByKey
        } = useSelection({
            getProps,
            getDataSource: unref(getDataSourceRef),
            treeExpandProps,
            toggleRowSelection
        });

        onMounted(() => {
            //设置默认选中项
            if (unref(getViewColumns).some(({type}) => type === 'selection')) {
                if (unref(getProps).defaultSelection?.length) {
                    const defaultSelection = unref(getProps).defaultSelection!;
                    for (let i = 0, len = defaultSelection.length; i < len; i++) {
                        const key:string = defaultSelection[i];
                        toggleRowSelection(unref(getDataSourceMapByKey)[key], true)
                    }
                }
            }
        });

        return {
            loading,
            tableElRef,
            getProps,
            getBindProps,
            getRowStyle,
            getTableClass,
            expands,
            getColumns,
            setColumns,
            getViewColumns,
            getPaginationRef,
            getPaginationLayout,
            handlePageIndexChange,
            handlePageSizeChange,
            handleSortChange,
            onSelectionChange,
            onSelectAll,
            handleTableSizeChange,
            getTableHeaderShowRef,
            getTableHeaderRef,
            tableSizeRef,
            handleReset,
            handleSearch,
            formRegister
        }
    }
})

</script>

<style lang="scss">
.com-table {
    width: 100%;

    .el-table__expand-icon {
        display: none;
    }

    .el-table__header,
    .el-table__body {
        width: unset !important;
        min-width: 100%;
        table-layout: fixed;
    }

    .el-table__empty-block {
        width: unset !important;
    }

    .el-table__expand-column {
        visibility: hidden;
        overflow: hidden;
    }
}

.com-table_with-expand {
    col[name=el-table_1_column_1] {
        width: 0 !important;
    }
}

.com-table-pagination {
    margin-top: 12px;
}

.el-table-form__search {
    margin-bottom: 6px;
    padding: 16px 16px 0 16px;
    background-color: var(--el-background-color-base);

    .el-input__inner {
        background-color: var(--color-white);
    }
}
</style>