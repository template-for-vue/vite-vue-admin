import type {ComputedRef, Ref} from "vue";
import {computed, nextTick, ref, toRaw, unref, watch} from "vue";
import {TableCol, TablePagination, TableProps, TableRow} from "/@/shared/components/Table/types/table";
import {deepClone, isArray, isFunction, isNullOrUnDef, isObject} from "/@/shared/components/Table/utils";
import {buildUUID} from "/@/shared/components/Table/utils/uuid";
import {DATE_FORMAT, formatTime} from "/@/shared/components/Table/utils/date";
import {error} from "/@/shared/components/Table/utils/log";

const ROW_KEY = 'key';

interface UseDataSourceContext {
    loading: Ref<boolean>;
    getCurrentSort: Fn;
    clearSort: Fn;
    getProps: ComputedRef<TableProps>;
    setProps: Fn;
    getViewColumns: ComputedRef<TableCol[]>;
    getPaginationRef: ComputedRef<TablePagination>;
    setPagination: (pagination: TablePagination) => TablePagination;
}

export const useDataSource = (
    {
        loading,
        clearSort,
        getCurrentSort,
        getProps,
        setProps,
        getViewColumns,
        getPaginationRef,
        setPagination
    }: UseDataSourceContext
) => {

    const dataSourceRef = ref<Recordable[]>([])

    const getRowKey = computed<string>(() => {
        const {rowKey = 'id'} = unref(getProps);
        return rowKey;
    });

    /**
     * 针对不同类型，对data值进行转换
     * 获取转换后的值
     * @param row
     * @param col
     * @param index
     */
    function getDataValues(row: TableRow, col: TableCol, index: number) {

        if (
            col.type === 'tree' ||
            col.type === 'expand' ||
            col.type === 'selection'
        ) return {};

        const defaultValue = isFunction(col.defaultValue) ? col!.defaultValue(row, col, index) : col.defaultValue;
        const value = col.prop ? row[col.prop] : '';

        if (col.format && isFunction(col.format)) return {
            value: col.format(row, col, index) || defaultValue,
            originalValue: value,
            status: ''
        }
        let text = value ?? defaultValue;
        let status: string | undefined;
        switch (col.type) {
            case 'index':
                text = (col.index || 0) + index;
                break;
            case 'image':
                text = value ? `<img class="com-table-td__image" src="${value}" alt="">` : '';
                break;
            case 'date':
                text = formatTime(value, col.dateFormat || DATE_FORMAT)
                break;
            case 'number':
                const number = parseFloat(value)
                text = isNaN(number) ? text : number.toFixed(2);
                break;
            case 'tag':
            case 'badge':
                const getStatus = col.statusMap;
                let data = isFunction(getStatus) ? getStatus() : getStatus;
                if (data && data[value]) {
                    const dataItem = data[value];
                    text = dataItem.name;
                    status = dataItem.status;
                } else {
                    text = '';
                }
                break;
        }
        return {value: text, originalValue: value, status}
    }

    /**
     * 针对不同类型，处理data数据
     * @param row
     * @param col
     * @param rowIndex
     */
    function handleDataItemByColumn(row: TableRow, col: TableCol, rowIndex: number) {
        const {originalValue, status, value} = getDataValues(row, col, rowIndex);
        const key = col.isFormat ? `${col.prop!}_format` : col.prop!;
        if (status) {
            row[`${key}_status`] = status;
            row[`${key}_name`] = value;
            row[key] = originalValue;
        } else {
            row[key] = value;
        }
        if (col.type === 'expand') {
            row.loading = false;
        }
        if (col.type === 'tree') {
            row.loading = false;
            const vifFn = isFunction(col.tree?.vif) ? col.tree!.vif : (row: any) => !row?.is_leaf;
            row.isTreeVisible = vifFn(row);
        }

        if (col.type === 'input') {
            row[`${key}_input`] = value;
            if (col.input?.disabled) {
                const disabledFn = isFunction(col.input?.disabled) ? col.input!.disabled : () => col.input?.disabled;
                row[`${key}_disabled`] = disabledFn(row);
            }
        }

        if (col.children && col.children.length) {
            col.children.forEach((childCol: TableCol) => handleDataItemByColumn(row, childCol, rowIndex))
        }
    }

    /**
     * 递归设置数据，
     * @param items
     * @param rowKey
     */
    function handleDataItem(items: any[], rowKey: string) {
        if (!items || !isArray(items)) return;
        items.forEach((item: any, rowIndex: number) => {
            if (!item[ROW_KEY]) {
                item[ROW_KEY] = item[rowKey] || buildUUID();
            }
            nextTick(() => {
                unref(getViewColumns)?.forEach((col: TableCol) => {
                    handleDataItemByColumn(item, col, rowIndex);
                })
            })
            if (item.children && item.children.length) {
                handleDataItem(item.children, rowKey);
            }
        })
    }

    const getDataSourceRef = computed(() => {
        const dataSource = unref(dataSourceRef);
        if (!dataSource || dataSource.length === 0) {
            return dataSource
        }
        const rowKey = unref(getRowKey);
        const data = deepClone(unref(dataSourceRef));
        handleDataItem(data, rowKey);
        dataSourceRef.value = data;
        return unref(dataSourceRef)
    })

    const setDataSource = (data: TableRow[]) => {
        setProps({dataSource:data});
    }
    const getDataSource = () => {
        return toRaw(unref(getDataSourceRef)) as TableRow[];
    }

    /**
     * 远程获取数据
     * @param pagination
     * @param customQuery 自定义额外传参
     * @param isRefresh
     */
    const getRemoteDataSource = async (pagination: TablePagination = {}, customQuery: Recordable = {}, isRefresh = false) => {

        const {form, formMethods, getRemoteDataSource} = unref(getProps);
        const {page_index: defaultIndex, page_size: defaultSize} = unref(getPaginationRef);
        const {page_index = defaultIndex, page_size = defaultSize} = pagination;

        if (getRemoteDataSource && isFunction(getRemoteDataSource)) {
            const {getFieldsValue, resetFields} = formMethods || {};
            if (isRefresh) {
                form && resetFields();
                clearSort();
            }
            customQuery = isObject(customQuery) ? customQuery : {};
            const sort = getCurrentSort();
            const query = Object.assign({}, form ? await getFieldsValue?.() || {} : {}, customQuery, sort, {
                page_index,
                page_size
            });

            try {
                loading.value = true;
                setPagination({page_index, page_size});
                let result = await getRemoteDataSource(query);
                if (isArray(result)) result = {list: result, total: 0};
                const {list, total} = result;
                if (list === undefined || total === undefined) {
                    return error('The remote method must return property list and total')
                }
                setProps({data: list});
                setPagination({total});
                dataSourceRef.value = list;
            } finally {
                loading.value = false;
            }
        }
        return toRaw(unref(dataSourceRef))
    }

    /**
     * 页数切换
     * @param index
     */
    const handlePageIndexChange = async (index: number) => {
        const {page_size} = unref(getPaginationRef);
        await getRemoteDataSource({page_index: index, page_size});
        const {onPageIndexChange} = unref(getProps);
        if (onPageIndexChange && isFunction(onPageIndexChange)) {
            await onPageIndexChange({page_index: index, page_size})
        }
    }

    /**
     * 每页数量切换
     * @param size
     */
    const handlePageSizeChange = async (size: number) => {
        await getRemoteDataSource({page_index: 1, page_size: size});
        const {onPageSizeChange} = unref(getProps);
        if (onPageSizeChange && isFunction(onPageSizeChange)) {
            await onPageSizeChange({page_index: 1, page_size: size})
        }
    }

    /**
     * 重置搜索查询数据
     */
    const handleReset = async () => {
        const {page_index, page_size} = setPagination({page_index: 1});
        const result = await getRemoteDataSource({page_index, page_size}, {}, true);
        const {onReset} = unref(getProps);
        if (onReset && isFunction(onReset)) {
            await onReset({page_index, page_size})
        }
        return result as TableRow[];
    }

    /**
     * 搜索
     * customQuery 额外的查询参数
     */
    const handleSearch = async (customQuery: Recordable = {}) => {
        const {page_index, page_size} = setPagination({page_index: 1});
        return await getRemoteDataSource({page_index, page_size}, customQuery) as TableRow[];
    }

    nextTick().then(async () => {
        let {dataSource} = unref(getProps);
        isNullOrUnDef(dataSource) && await getRemoteDataSource()
    })

    watch(
        () => unref(getProps).dataSource,
        async () => {
            let {dataSource} = unref(getProps);
            if (isArray(dataSource)) {
                dataSource = {list: dataSource, total: 0}
            }
            const {list = [], total = 0} = dataSource || {};
             if(list && list.length > 0){
                 dataSourceRef.value = list;
             }
            setPagination({total});
        }
    )

    return {
        getRowKey,
        getDataSourceRef,
        getDataSource,
        setDataSource,
        handlePageIndexChange,
        handlePageSizeChange,
        handleReset,
        handleSearch,
    }

}

