import {computed, ref, toRaw, unref} from 'vue';
import type {ComputedRef} from 'vue';
import {TablePagination, TableProps} from "/@/shared/components/Table/types/table";

interface usePaginationContext {
    getProps: ComputedRef<TableProps>;
}

export const usePagination = (
    {
        getProps
    }: usePaginationContext
) => {

    const paginationRef = ref<TablePagination>({});

    const getPaginationRef = computed(() => {
        const {pagination} = unref(getProps)
        const res = {
            page_index: 1,
            page_size: 15,
            vshow: true,
            ...pagination,
            ...unref(paginationRef)
        } as any;
        ['page_index', 'page_size', 'total'].forEach((key) => {
            if(res[key]){
                res[key] = parseInt(`${res[key]}`)
            }
        })
        return res;
    });

    const setPagination = (pagination: TablePagination) => {
        return paginationRef.value = {...unref(getPagination),...unref(paginationRef), ...pagination}
    }

    const getPagination = () => {
        return toRaw(unref(getPaginationRef));
    }

    const getPaginationLayout = computed(() => {
        return unref(getPaginationRef).isSimple ? '->,prev,pager,next' : 'total,->,prev,pager,next,sizes,jumper';
    })

    return {
        getPaginationRef,
        getPagination,
        setPagination,
        getPaginationLayout
    }
}