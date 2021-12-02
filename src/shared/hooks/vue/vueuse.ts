import {getCurrentInstance, nextTick, onActivated, onBeforeUnmount, onMounted, onUnmounted} from "vue"

export const tryOnMounted = (fn: Fn, sync: boolean = true) => {
    if (getCurrentInstance()) {
        onMounted(fn)
    } else if (sync) {
        fn();
    } else {
        nextTick(fn);
    }
}

export const tryOnUnmounted = (fn: Fn) => {
    if (getCurrentInstance()) {
        onUnmounted(fn)
    }
}

export const tryOnBeforeUnmount = (fn: Fn) => {
    if (getCurrentInstance()) {
        onBeforeUnmount(fn);
    }
}

export const tryOnActivated = (fn: Fn) => {
    if (getCurrentInstance()) {
        onActivated(fn);
    }
}

export const tryOnMountedOrActivated = (fn: Fn) => {
    let mounted: boolean;
    tryOnMounted(() => {
        fn();
        nextTick(() => mounted = true)
    })

    tryOnActivated(() => {
        if (mounted) {
            fn()
        }
    })
}