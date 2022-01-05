import {Ref, ComputedRef, watch} from 'vue';
import {ref, computed, unref} from 'vue';
import {arrayFlat2} from "/@/shared/components/Table/utils/array";
import type {TableProps, TableRow, TreeExpandProps} from "/@/shared/components/Table/types/table";
import {warn} from "/@/shared/components/Table/utils/log";
import {isFunction, sleep} from "/@/shared/components/Table/utils";

export const useTree = (
    getProps: ComputedRef<TableProps>,
    getRowKey: ComputedRef<string>,
    getDataSourceRef: ComputedRef<TableRow[]>
) => {

    const expandGroups: Ref<number[][]> = ref(unref(getProps).expandRowKeys || []);
    const treeExpands = computed<number[]>(() => {
        return Array.from(new Set(arrayFlat2(expandGroups.value)));
    })
    const treeExpandProps: ComputedRef<TreeExpandProps> = computed(() => {
        return Object.assign({}, {
            id: unref(getRowKey) || 'id',
            pid: 'pid',
            isNest: true
        }, unref(getProps).treeExpandProps);
    });

    const treeRowStyle = (({row}: TableRow) => {
        const pid = row[unref(treeExpandProps).pid!];
        return pid === 0 || treeExpands.value.includes(pid) ? '' : 'display:none;';
    })
    const handleExpandChange = (row: TableRow, isExpand: boolean) => {
        const id = row[unref(treeExpandProps).id!];
        const pid = row[unref(treeExpandProps).pid!];
        if (isExpand) {
            if (!treeExpands.value.includes(id)) {
                expandGroups.value.push([pid, id]);
            }
        } else {
            expandGroups.value = expandGroups.value.filter(([x, y]) => x !== id && y !== id);
        }
    }

    const {onExpandChange = (() => true)} = unref(getProps);
    const treeExpandClick = async (row: TableRow) => {
        const id = row[unref(treeExpandProps).id!];
        const pid = row[unref(treeExpandProps).pid!];
        if ((!id && id !== 0) || (!pid && pid !== 0)) {
            return warn('请设置treeExpandProps 或者 treeExpandProps 设置的 id 及 pid 不正确');
        }

        if (isFunction(onExpandChange)) {
            const isWillExpand = treeExpands.value.indexOf(id) === -1;
            const actions = [onExpandChange({row, isWillExpand})];
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
                expandGroups.value = (unref(getDataSourceRef) || [])
                    .filter(({is_leaf}) => !is_leaf)
                    .map((row) => [row[unref(treeExpandProps).pid!], row[unref(treeExpandProps).id!]] as number[]);
            }
        }
    )

    const handleTreeExpandAll = () => {
        expandGroups.value = (unref(getDataSourceRef) || [])
            .filter(({is_leaf}) => !is_leaf)
            .map((row) => [row[unref(treeExpandProps).pid!], row[unref(treeExpandProps).id!]] as number[]);
    }
    const handleTreeCollapseAll = () => {
        expandGroups.value = [];
    }


    return {
        treeExpandProps,
        treeRowStyle,
        treeExpands,
        treeExpandClick,
        handleTreeExpandAll,
        handleTreeCollapseAll
    }

}