import {tryOnMounted, tryOnUnmounted} from "/@/shared/hooks/vue/vueuse";
import {useDebounce} from "/@/shared/hooks/web/useDebounce";

interface WindowSizeOptions {
    once?: boolean;
    immediate?: boolean;
    listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
    let handler = () => {
        fn();
    };
    const [debounceFn] = useDebounce(handler, wait);
    handler = debounceFn;
    const start = () => {
        if (options && options.immediate) {
            handler();
        }
        window.addEventListener('resize', handler);
    };

    const stop = () => {
        window.removeEventListener('resize', handler);
    };

    tryOnMounted(() => {
        start();
    });

    tryOnUnmounted(() => {
        stop();
    });
    return [start, stop];
}
