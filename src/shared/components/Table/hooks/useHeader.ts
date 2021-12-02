import {computed, ref, unref} from "vue";
import type {ComputedRef} from "vue";
import {TableHeader, TableProps, TableSize} from "/@/shared/components/Table/types/table";

interface UseHeaderContext {
    slots: any;
    getProps: ComputedRef<TableProps>;
}

export const useHeader = (
    {getProps, slots}: UseHeaderContext,
) => {

    const {size = 'small', header = {}} = unref(getProps);
    const tableSizeRef = ref(size);

    const handleTableSizeChange = (size: TableSize) => {
        tableSizeRef.value = size;
    }

    const getTableHeaderRef = computed(() => {
        const {title, toolbar = true, buttonRender = 'button'} = header as TableHeader;
        return {title, toolbar, buttonRender};
    })

    const getTableHeaderShowRef = computed(() => {
        const {title, toolbar, buttonRender} = unref(getTableHeaderRef);
        return !!(title || toolbar || slots[buttonRender])
    })


    return {
        getTableHeaderRef,
        handleTableSizeChange,
        getTableHeaderShowRef,
        tableSizeRef
    }
}