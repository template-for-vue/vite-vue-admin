import {computed, ComputedRef, unref} from 'vue';
import {DescriptionItem, DescriptionProps} from "/@/shared/components/Description/types/description";
import {isProdMode} from "/@/shared/components/Description/utils/env";

const DEFAULT_COLUMN = 3;

export const useRows = (getPropsRef: ComputedRef<DescriptionProps>) => {

    const {
        column = DEFAULT_COLUMN,
        schema,
    } = unref(getPropsRef);

    const getDataSourceRef = computed(() => {
        return unref(getPropsRef).dataSource
    })

    const getFilledItem = (item: DescriptionItem, rowRestCol: number) => {
        const {span} = item;
        if (span === undefined || span > rowRestCol) {
            item.span = rowRestCol;
            if (!isProdMode()) {
                console.warn(`Sum of column 'span' is a line not match 'column' of descriptions`)
            }
        }
        if (span && span < rowRestCol) {
            item.span = rowRestCol
        }
        return item;
    }

    const getRowValue = (item: DescriptionItem, dataSource: Recordable) => {
        const {prop, defaultValue, format} = item;

        let value = prop ? dataSource[prop] ?? defaultValue : '';
        if (typeof format === 'function') {
            value = format(dataSource)
        }
        return value;
    }

    const getVisitedRow = computed(() => {
        return schema?.filter((item) => {
            let {vshow = true} = item;
            if (typeof vshow === 'function') {
                vshow = vshow(item, unref(getDataSourceRef))
            }
            return vshow;
        })
    })

    const getRowsRef = computed(() => {
        const rows: DescriptionItem[][] = [];

        let tmpRow: DescriptionItem[] = [];
        let rowRestCol = column;

        unref(getVisitedRow)?.forEach((item: DescriptionItem, index: number) => {

            const span: number | undefined = item.span;
            const mergedSpan = span || 1;
            item.span = mergedSpan;
            item.$value = getRowValue(item, unref(getDataSourceRef));

            if (index === schema.length - 1) {
                tmpRow.push(getFilledItem(item, rowRestCol));
                rows.push(tmpRow);
                rowRestCol = column;
                tmpRow = []
                return;
            }
            if (mergedSpan < rowRestCol) {
                rowRestCol -= mergedSpan;
                tmpRow.push(item)
            } else {
                tmpRow.push(getFilledItem(item, rowRestCol));
                rows.push(tmpRow);
                rowRestCol = column;
                tmpRow = []
            }
        })
        return rows;
    })

    return {
        getRowsRef
    }
}