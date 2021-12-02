import {computed, unref} from "vue";
import type {ComputedRef} from "vue";
import {TableCol, TableProps} from "/@/shared/components/Table/types/table";
import {isFunction} from "/@/shared/components/Table/utils";

export interface OnSortChangeContext {
    column: Nullable<TableCol>,
    prop: string | null,
    order: string | null
}

export const useSort = (
    getProps: ComputedRef<TableProps>,
) => {


    const getSortMap = computed(() => {
        const {
            sortMap = {
                'ascending': 'asc',
                'descending': 'desc'
            }
        } = unref(getProps);
        return sortMap;
    })

    let lastSortColumn: Nullable<TableCol> = {};

    const OnSortChange = (
        {
            column,
            prop,
            order
        }: OnSortChangeContext) => {

        if (column === null) {
            column = lastSortColumn;
            prop = lastSortColumn!.property
        }

        lastSortColumn = column;
        const {onSort} = unref(getProps);
        if (onSort && isFunction(onSort)) {
            onSort({column, prop, order: order ? (unref(getSortMap) as any)[order] : null})
        }
    }

    const getCurrentSort = () => {
        const {property, order} = lastSortColumn as any;
        const result: Recordable = {};
        if (order) result.order = `${property} ${(unref(getSortMap) as any)[order]}`
        return result;
    }

    return {
        OnSortChange,
        getCurrentSort
    }
}