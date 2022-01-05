<template>
    <div class="com-description">
        <div class="com-description-header" v-if="getPropsRef.title || $slots.title || $slots.extra">
            <span class="com-description-title" v-if="getPropsRef.title || $slots.title">
                <slot name="title">{{ getPropsRef.title }}</slot>
            </span>
            <div class="com-description-extra" v-if="$slots.extra">
                <slot name="extra"></slot>
            </div>
        </div>
        <table class="com-description-table" :class="getTableClassRef">
            <template v-if="getIsLayoutVerticalRef">
                <template v-for="row in getRowsRef">
                    <tr class="com-description-row">
                        <com-description-item
                            :items="row"
                            :getProps="getPropsForItemRef"
                            :types="['th']">
                            <template #[slot]="scope" v-for="slot in Object.keys($slots)">
                                <slot :name="slot" v-bind="scope || {}"></slot>
                            </template>
                        </com-description-item>
                    </tr>
                    <tr class="com-description-row">
                        <com-description-item
                            :items="row"
                            :getProps="getPropsForItemRef"
                            :types="['td']">
                            <template #[slot]="scope" v-for="slot in Object.keys($slots)">
                                <slot :name="slot" v-bind="scope || {}"></slot>
                            </template>
                        </com-description-item>
                    </tr>
                </template>
            </template>
            <template v-else>
                <tr class="com-description-row" v-for="row in getRowsRef">
                    <com-description-item :items="row" :getProps="getPropsForItemRef">
                        <template #[slot]="scope" v-for="slot in Object.keys($slots)">
                            <slot :name="slot" v-bind="scope || {}"></slot>
                        </template>
                    </com-description-item>
                </tr>
            </template>
        </table>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, unref} from 'vue';
import {DescriptionInstance, DescriptionProps} from "/@/shared/components/Description/types/description";
import {useRows} from "/@/shared/components/Description/hooks/useRows";

export default defineComponent({
    name: "ComDescription",
    emits: ['register'],
    setup(props, {emit}) {

        // +----------------------------------------------------------------------
        // | 设置 属性
        // +----------------------------------------------------------------------

        const propsRef = ref<Partial<DescriptionProps> | null>({});
        const getPropsRef = computed(() => {
            return {
                ...props,
                ...(unref(propsRef))
            } as DescriptionProps
        })

        const setProps = (descriptionProps: Partial<DescriptionProps>): void => {
            propsRef.value = {
                ...unref(propsRef),
                ...descriptionProps
            } as DescriptionProps
        }

        const methods: DescriptionInstance = {
            setProps
        }

        emit('register', methods);

        const {getRowsRef} = useRows(getPropsRef)

        // +----------------------------------------------------------------------
        // | size
        // +----------------------------------------------------------------------

        const getSizeRef = computed(() => {
            const {size} = unref(getPropsRef);
            return size ?? 'medium'
        })

        const getBorderRef = computed(() => {
            const {border = true} = unref(getPropsRef);
            return border;
        })

        const getTableClassRef = computed(() => {
            let clazz = '';
            if (unref(getBorderRef)) clazz += ` com-description-border`;
            clazz += ` com-description-${unref(getSizeRef)}`;
            return clazz;
        })

        const getIsLayoutVerticalRef = computed(() => {
            const {layout = 'horizontal'} = unref(getPropsRef);
            return layout === 'vertical';
        })

        const getPropsForItemRef = computed(() => {
            return {
                ...unref(getPropsRef),
                border: unref(getBorderRef),
                isVertical: unref(getIsLayoutVerticalRef),
            }
        })

        return {
            getPropsRef,
            getRowsRef,
            getBorderRef,
            getTableClassRef,
            getIsLayoutVerticalRef,
            getPropsForItemRef
        }
    }
})

</script>

<style lang="scss" scoped>
.com-description-table {
    width: 100%;
    table-layout: auto;
}

.com-description-border {
    border: 1px solid var(--color-border-sep);

    .com-description-row {
        border-bottom: 1px solid var(--color-border-sep);
    }
}

.com-description-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    padding-top: 8px;
    user-select: none
}

.com-description-title {
    padding-left: 8px;
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    user-select: none;
}

.com-description-extra {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    min-height: 32px;
    padding-right: 8px;
}
</style>