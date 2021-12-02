import {Ref, toRaw, unref} from 'vue';
import {TableActionType, TableRow} from "/@/shared/components/Table/types/table";

interface UseTableEventsContext {
    tableElRef: Ref<Nullable<TableActionType>>;
}


export const useTableEvents = (
    {
        tableElRef,
    }: UseTableEventsContext) => {

    const toggleRowSelection = async (row: TableRow, selected: boolean) => {
        return unref(tableElRef)?.toggleRowSelection(row, selected)
    }

    //切换全选
    const toggleAllSelection = () => {
        unref(tableElRef)?.toggleAllSelection();
    };

    //清空筛选
    const clearSort = () => {
        unref(tableElRef)?.clearSort();
    };

    //重新布局
    const doLayout = () => {
        unref(tableElRef)?.doLayout();
    };

    const getTableRef = () => {
        return toRaw(unref(tableElRef))
    }

    return {
        toggleRowSelection,
        toggleAllSelection,
        clearSort,
        doLayout,
        getTableRef
    }
}