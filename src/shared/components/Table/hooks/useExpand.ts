import {ComputedRef, ref, unref, watch} from 'vue';
import type {TableProps, TableRow} from "/@/shared/components/Table/types/table";
import {warn} from "/@/shared/components/Table/utils/log";
import {isFunction, sleep} from "/@/shared/components/Table/utils";

export const useExpand = (
    getProps: ComputedRef<TableProps>,
    getRowKey: ComputedRef<string>,
    getDataSourceRef: ComputedRef<TableRow[]>
) => {

    const expands = ref<any[]>(unref(getProps).expandRowKeys || [])
    const key = unref(getRowKey);

    const handleExpandChange = (row: TableRow, isExpand: boolean) => {
        const id = row[key];
        if (isExpand) {
            if (!expands.value.includes(id)) {
                expands.value.push(id);
            }
        } else {
            expands.value = expands.value.filter((x) => x !== id);
        }
    }

    const expandClick = async (row: TableRow) => {
        const id = row[key];
        if (!id) return warn('请设置正确的rowKey');
        const {onExpandChange = (() => true)} = unref(getProps);
        if (isFunction(onExpandChange)) {
            const isWillExpand = expands.value.indexOf(id) === -1;
            const actions = [onExpandChange(row, isWillExpand)];
            if (isWillExpand) {
                actions.push(sleep(60));
                row.loading = true;
            }
            await Promise.all(actions);
            handleExpandChange(row, isWillExpand)
        }
        row.loading = false;
    }

    watch(
        () => getDataSourceRef.value,
        async () => {
            let {defaultExpandAll} = unref(getProps);
            if (defaultExpandAll) {
                expands.value = (unref(getDataSourceRef) || []).map((row) => row[key]);
            }
        }
    )

    const handleExpandAll = () => {
        expands.value = (unref(getDataSourceRef) || []).map((row) => row[key]);
    }

    const handleCollapseAll = () => {
        expands.value = [];
    }

    return {
        expands,
        expandClick,
        handleExpandAll,
        handleCollapseAll
    }

}