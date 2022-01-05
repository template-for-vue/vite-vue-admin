import {computed, ComputedRef, ref, unref, watch} from 'vue';
import {TableProps, TableRow} from "/@/shared/components/Table/types/table";
import {listToMap} from "/@/shared/components/Table/utils/array";
import {isFunction} from "/@/shared/components/Table/utils";

interface UseTableRadioContext {
    getProps: ComputedRef<TableProps>,
    getRowKey: ComputedRef<string>,
    getDataSourceRef: ComputedRef<TableRow[]>
}

export const useRadio = (
    {
        getProps,
        getRowKey,
        getDataSourceRef
    }: UseTableRadioContext) => {

    const key = unref(getRowKey);
    const radioSelectionRef = ref(unref(getProps)?.defaultRadio ?? '');

    /**
     * 将数据构建成Record<key,row|row[]>
     */
    const getDataSourceMapByKey = computed(() => {
        return listToMap(unref(getDataSourceRef), key)
    })

    watch(
        () => unref(radioSelectionRef),
        (val) => {
            const {onRadioChange} = unref(getProps);
            if (isFunction(onRadioChange)) {
                onRadioChange(unref(getDataSourceMapByKey)[val])
            }
        },
        {
            immediate: true
        }
    )

    return {
        radioSelectionRef,
        getDataSourceMapByKey
    }
}