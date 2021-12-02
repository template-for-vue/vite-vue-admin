import {computed, ComputedRef, unref} from 'vue';
import {TableProps, TableRow, TreeExpandProps} from "/@/shared/components/Table/types/table";
import {duplicateRemove, listToMap} from "/@/shared/components/Table/utils/array";
import {isFunction} from "/@/shared/components/Table/utils";

interface UseTableSelectionContext {
    getProps: ComputedRef<TableProps>;
    treeExpandProps: ComputedRef<TreeExpandProps>;
    toggleRowSelection: (row: TableRow, selected: boolean) => void;
}

export const useSelection = (
    {
        getProps,
        treeExpandProps,
        toggleRowSelection
    }: UseTableSelectionContext) => {

    /**
     * 将数据构建成Record<pkey,row|row[]>
     */
    const getDataSourceMapByPkey = computed(() => {
        const {pid} = unref(treeExpandProps);
        const {data = []} = unref(getProps);
        return listToMap(data, pid)
    })
    /**
     * 将数据构建成Record<key,row|row[]>
     */
    const getDataSourceMapByKey = computed(() => {
        const {id} = unref(treeExpandProps);
        const {data = []} = unref(getProps);
        return listToMap(data, id)
    })

    /**
     * 根据pid获取数据
     * @param pid
     */
    const getParentsByPkey = (pid: any) => {
        let parents: any[] = [];
        const {pid: pkey} = unref(treeExpandProps);

        function _getParents(pid: any) {
            [].concat(unref(getDataSourceMapByKey)[pid] || []).forEach((parent: any) => {
                parents = parents.concat(parent);
                _getParents(parent[pkey])
            })
        }

        _getParents(pid);
        return parents;
    }

    /**
     * 根据id获取数据
     * @param id
     */
    const getChildrenByKey = (id: any) => {
        let children: any[] = [];
        const {id: key} = unref(treeExpandProps);

        function _getChildren(id: any) {
            [].concat(unref(getDataSourceMapByPkey)[id] || []).forEach((child: any) => {
                children = children.concat(child);
                _getChildren(child[key])
            })
        }

        _getChildren(id);
        return children;
    }


    const onSelectionChange = (selection: any, row: TableRow) => {
        let resSelection = [...selection];
        const {columns = []} = unref(getProps);
        const isTree = columns[0].type === 'tree';
        const {id: key, pid: pkey, isNest = false} = unref(treeExpandProps);

        if (isTree && isNest) {
            const currId = row[key!];
            const currPid = row[pkey!];
            if ((!currId && currId !== 0) || (!currPid && currPid !== 0)) {
                return console.warn('请设置 treeExpandProps 或者 treeExpandProps 设置的id及pid不正确');
            }
            const selectedIds = new Set(selection.map((item: any) => item[key!]))
            const isSelected = selectedIds.has(currId);
            const parents = getParentsByPkey(currPid);
            const children = getChildrenByKey(currId);
            let needToChecked = [row].concat(children);
            if (isSelected) {
                needToChecked = needToChecked.concat(parents);
                resSelection = duplicateRemove(resSelection.concat(needToChecked), key);
            } else {
                const isParentEmpty = !([].concat(unref(getDataSourceMapByPkey)[currPid]).some((item) => selectedIds.has(item?.[key])));
                const selectedPids = new Set();
                selection.forEach((item: any) => {
                    if (!isParentEmpty || unref(getDataSourceMapByKey)[currPid]?.[key] !== item[key]) {
                        selectedPids.add(item[pkey])
                    }
                })
                needToChecked = needToChecked.concat(parents.filter((item) => !selectedPids.has(item[key])))
                const needToDeleteIds = needToChecked.map((item) => item[key]);
                resSelection = selection.filter((item: any) => needToDeleteIds.indexOf(item[key]) === -1);
            }
            needToChecked.forEach((item) => toggleRowSelection(item, isSelected))
        }
        const {onSelectionChange} = unref(getProps);
        if (isFunction(onSelectionChange)) {
            onSelectionChange({selection: resSelection, row})
        }
    }

    const onSelectAll = (selection:TableRow[]) => {
        const {onSelectAll} = unref(getProps);
        if (isFunction(onSelectAll)) {
            onSelectAll(selection)
        }
    }

    return {
        onSelectionChange,
        onSelectAll,
        getDataSourceMapByPkey,
        getDataSourceMapByKey
    }
}