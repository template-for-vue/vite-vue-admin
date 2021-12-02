import {nextTick, onUnmounted, ref, toRaw, unref, watch} from 'vue';
import type {WatchStopHandle} from 'vue';
import {
    GetColumnsParams,
    TableActionType, TableCol, TablePagination,
    TableProps,
    TableRow,
    UseTableReturnType
} from "/@/shared/components/Table/types/table";
import {isProdMode} from "/@/shared/components/Table/utils/env";
import {getDynamicProps, isFunction} from "/@/shared/components/Table/utils";
import {error} from "/@/shared/components/Table/utils/log";


export const useTable = (
    tableProps: TableProps,
    getRemoteDataSource?: Fn
): UseTableReturnType => {

    const tableRef = ref<Nullable<TableActionType>>(null);

    let stopWatch: WatchStopHandle;
    const register = (instance: TableActionType) => {

        if (tableRef.value && instance === unref(tableRef)) return;
        if (isProdMode()) {
            onUnmounted(() => tableRef.value = null)
        }

        tableRef.value = instance;
        stopWatch?.();
        stopWatch = watch(
            () => tableProps,
            () => {
                if (getRemoteDataSource && isFunction(getRemoteDataSource)) {
                    tableProps.getRemoteDataSource = getRemoteDataSource;
                }
                tableProps && instance.setProps(getDynamicProps(tableProps))
            },
            {
                immediate: true,
                deep: true
            }
        )
    }

    async function getTableInstance(): Promise<TableActionType> {
        const table = unref(tableRef);
        if (!table) {
            error(`
                The table instance has not been obtained yet,
                please make sure the table is presented when performing the table operation;
            `)
        }
        await nextTick();
        return table as TableActionType;
    }

    const methods: TableActionType = {

        setProps: async (props: Partial<TableProps>) => {
            const table = await getTableInstance();
            table.setProps(props);
        },

        handleReset: async () => {
            const table = await getTableInstance();
            return await table.handleReset();
        },

        handleSearch: async (query: Recordable) => {
            const table = await getTableInstance();
            return await table.handleSearch(query);
        },

        getDataSource: async () => {
            const table = await getTableInstance();
            return table.getDataSource();
        },

        setDataSource: async (data: TableRow[]) => {
            const table = await getTableInstance();
            await table.setDataSource(data);
        },

        getColumns: async (params: GetColumnsParams) => {
            const table = await getTableInstance();
            return table.getColumns(params);
        },

        setColumns: async (columnList: TableCol[] | string[]) => {
            const table = await getTableInstance();
            return table.setColumns(columnList);
        },

        getPagination: async () => {
            const table = await getTableInstance();
            return toRaw(unref(table.getPagination)) as TablePagination;
        },

        setPagination: async (pagination: TablePagination) => {
            const table = await getTableInstance();
            const {vshow} = pagination;
            table.setPagination({vshow});
        },

        handleExpandAll: async () => {
            const table = await getTableInstance();
            const {columns} = tableProps;
            const isTree = columns?.[0].type === 'tree';
            isTree ? table.handleTreeExpandAll?.() : table.handleExpandAll();
        },

        handleCollapseAll: async () => {
            const table = await getTableInstance();
            const {columns} = tableProps;
            const isTree = columns?.[0].type === 'tree';
            isTree ? table.handleTreeCollapseAll?.() : table.handleCollapseAll();
        },

        toggleRowSelection: async (row: TableRow, selected?: boolean) => {
            const table = await getTableInstance();
            table.toggleRowSelection(row, selected)
        },

        toggleAllSelection: async () => {
            const table = await getTableInstance();
            table.toggleAllSelection();
        },

        clearSort: async () => {
            const table = await getTableInstance();
            table.clearSort();
        },

        doLayout: async () => {
            const table = await getTableInstance();
            table.doLayout();
        },

        getTableRef: async () => {
            const table = await getTableInstance();
            table.getTableRef();
        }

    }

    return [register, methods] as any
}