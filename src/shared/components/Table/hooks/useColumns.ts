import type {ComputedRef} from "vue";
import {computed, ref, toRaw, unref, watch} from "vue";
import type {GetColumnsParams, TableCol, TableProps} from "/@/shared/components/Table/types/table";
import {deepClone, isArray, isBoolean, isFunction, isString} from "/@/shared/components/Table/utils";
import {warn} from "/@/shared/components/Table/utils/log";
import {useButton} from "/@/shared/components/Table/hooks/useButton";
import {isNullOrUnDef, isObject} from "/@/shared/utils/is";

export const INDEX_COLUMN_FLAG = 'INDEX';
export const ACTION_COLUMN_FLAG = 'ACTION';
export const WIDTH_DEFAULT_NONE = 'WIDTH_DEFAULT_NONE';

interface UseColumnContext {
    getProps: ComputedRef<TableProps>;
    getTableRef: Fn
}

const isIfShow = (column: TableCol) => {
    const {vshow = true} = column;
    return isFunction(vshow) ? vshow(column) : vshow
}

export const useColumns = (
    {
        getProps,
        getTableRef
    }: UseColumnContext
) => {

    const columnsRef = ref<TableCol[]>(unref(getProps).columns || []);
    let cacheColumns = unref(getProps)?.columns ?? [];


    function handleColumnItem(column: TableCol, pIndex: number, currIndex: number) {
        const col: TableCol = deepClone(column);
        if (column.width && parseFloat(`${column.width}`) == column.width) {
            col.width = `${column.width}px`
        }
        switch (column.type) {
            case 'index':
                col.index = column.index ?? 1;
                col.width = column.width ?? '60px';
                col.label = column.label ?? '序号';
                col.format = undefined;
                col.flag = INDEX_COLUMN_FLAG;
                break;
            case 'tree':
            case 'expand':
                if (pIndex === 0 && currIndex === 0) {
                    col.width = column.width ?? '36px';
                    col.flag = INDEX_COLUMN_FLAG;
                    col.label = '\\';
                    col.align = 'center';
                } else {
                    col.type = undefined;
                    warn('(type = tree | expand) only can be set to first column')
                }
                break;
            case 'selection':
                col.width = column.width ?? '36px';
                col.flag = INDEX_COLUMN_FLAG;
                break;
            case 'link':
                !isFunction(column.click) && (col.type = undefined);
                break;
            case 'badge':
            case 'tag':
                !column.statusMap && (col.type = undefined);
                break;
            case 'button':
                const {buttons} = useButton(column.buttons, getProps);
                col.buttons = buttons;
                if (buttons.length === 0) {
                    col.vshow = false;
                } else {
                    col.flag = ACTION_COLUMN_FLAG;
                }
                break;
        }
        col.className = ([]).concat((column.className || []) as any).join(' ');
        col.labelClassName = [].concat((column.labelClassName || []) as any).join(' ');
        col.align = col.align || column.align || 'left';
        col.showOverflowTooltip = column.showOverflowTooltip || column.ellipsis;
        col.prop = column.prop;
        if (!col.width) col[WIDTH_DEFAULT_NONE] = true;
        if (!col.prop) {
            col.prop = 'col_' + (pIndex ? `${pIndex}_` : '') + currIndex;
        }
        if(col.format && isFunction(col.format)) col.isFormat = true;
        col.columnKey = col.prop;

        //排序相关
        if (column.sortable) {
            if (isBoolean(column.sortable)) {
                column.sortable = 'custom'
            }
        }

        Object.assign(column, col)

        if (column.children && column.children.length) {
            column.children.forEach((child: TableCol, childIndex: number) => {
                handleColumnItem(child, currIndex, childIndex)
            })
        }
    }

    const viewColumnsRef = ref<TableCol[]>([]);
    watch(
        () => columnsRef.value,
        () => {
            if (!unref(columnsRef)) viewColumnsRef.value = [];
            const columns: TableCol[] = deepClone(unref(columnsRef));
            columns.forEach((item, index) => {
                handleColumnItem(item, 0, index);
            })
            viewColumnsRef.value = columns;
        }
    )

    const hasPermission = (column: TableCol) => {
        const {vColumnAuth} = unref(getProps);
        let columnAuths = (isFunction(vColumnAuth) ? vColumnAuth?.() : vColumnAuth) || [];
        columnAuths = isObject(columnAuths) ? Object.keys(columnAuths) : columnAuths;
        return column.flag === ACTION_COLUMN_FLAG ||
            column.flag === INDEX_COLUMN_FLAG ||
            columnAuths.length === 0 ||
            columnAuths.includes(column.prop);
    };

    const getViewColumns = computed(() => {
        const viewColumns = unref(viewColumnsRef);
        const columns: TableCol[] = deepClone(viewColumns);
        const bodyWidth = getTableRef()?.$el.offsetWidth;
        let width: Nullable<number> = null
        let count: number = 0
        let perWidth: Nullable<number> = null;
        if (isNullOrUnDef(width) && bodyWidth) {
            width = parseInt(`${bodyWidth}`);
        }
        const result = columns
            .filter((column) => {
                const isNeedToCount = isIfShow(column) && hasPermission(column);
                if (isNeedToCount && bodyWidth) {
                    if (!column[WIDTH_DEFAULT_NONE] && column.width) {
                        width! -= parseInt(`${column.width}`);
                    }
                    if (column[WIDTH_DEFAULT_NONE]) {
                        count++;
                    }
                }
                return isNeedToCount
            })

        if (width && count > 0) {
            perWidth = width / count;
            result.forEach((column) => {
                if (isNullOrUnDef(column.width)) {
                    column.width = `${perWidth}px`;
                }
            })
        }
        return result;
    })

    const setColumns = (columnList: TableCol[] | string[]) => {
        const columns = deepClone(columnList);
        if (!isArray(columns)) return;
        const firstColumn = columns[0];
        if (columns.length > 0 && !isString(firstColumn)) {
            columnsRef.value = columns;
        } else {
            const columnKeys = columns as string[];
            const newColumns: TableCol[] = [];
            cacheColumns.forEach((column) => {
                newColumns.push({
                    ...column,
                    vshow: columnKeys.includes(column.prop!) ||
                        column.flag === INDEX_COLUMN_FLAG ||
                        column.flag === ACTION_COLUMN_FLAG
                })
            })

            newColumns.sort((prev, next) => {
                const prevIndex = columnKeys.indexOf(prev.prop as string);
                const nextIndex = columnKeys.indexOf(next.prop as string);
                return prevIndex === -1 || nextIndex === -1 ? 1 : prevIndex - nextIndex;
            })

            columnsRef.value = newColumns;
        }
    }

    const getColumns = (params?: GetColumnsParams): TableCol[] => {
        const {ignoreIndex, ignoreAction} = params || {};
        let columns = toRaw(unref(getViewColumns));
        if (ignoreIndex) {
            columns = columns.filter(column => column.flag !== INDEX_COLUMN_FLAG)
        }
        if (ignoreAction) {
            columns = columns.filter(column => column.flag !== ACTION_COLUMN_FLAG)
        }
        return columns;
    }

    const getCacheColumns = () => cacheColumns;

    const setCacheColumnsByField = (prop: string | undefined, value: Partial<TableCol>) => {
        if (!prop || !value) return;
        cacheColumns.forEach((column) => {
            if (column.prop === prop) {
                Object.assign(column, value);
                return;
            }
        })
    }

    watch(
        () => unref(getProps).columns as TableCol[],
        (columns) => {
            columnsRef.value = columns;
            cacheColumns = unref(getProps)?.columns ?? [];
        }
    );

    return {
        getViewColumns,
        getColumns,
        setColumns,
        getCacheColumns,
        setCacheColumnsByField
    }
}