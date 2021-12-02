import {ref} from "vue";
import {useCache} from "/@/shared/cache/useCache";

const {getSession, setSession} = useCache();
const COLLAPSE_CACHE_TOKE = 'LAYOUT_COLLAPSE_CACHE__';

const isCollapsed = ref(true);
const isLoading = ref(false);


export const useLayout = () => {

    // +----------------------------------------------------------------------
    // | 菜单展开
    // +----------------------------------------------------------------------

    isCollapsed.value = getSession<boolean>(COLLAPSE_CACHE_TOKE) ?? false;

    const getCollapseState = () => isCollapsed.value

    const setCollapseState = (state: boolean) => {
        isCollapsed.value = state;
        setSession(COLLAPSE_CACHE_TOKE, state);
    }

    // +----------------------------------------------------------------------
    // | LOADING
    // +----------------------------------------------------------------------

    const getPageLoadingState = () => isLoading.value;
    const setPageLoadingState = (state: boolean) => isLoading.value = state;


    return {
        getCollapseState,
        setCollapseState,
        getPageLoadingState,
        setPageLoadingState,

    }
}