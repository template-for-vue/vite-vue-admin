<template>
    <template v-for="item in items">
        <template v-if="getProps.border">
            <th class="com-description-item__label" v-if="types.includes('th')" :style="{width : getLabelWidthRef}"
                :colspan="getLabelColSpan(item)">
                <div class="com-description-item__cell">
                    <slot :name="item.renderLabel" v-bind="item">
                        {{ item.label }}
                    </slot>
                </div>
            </th>
            <td class="com-description-item__content" v-if="types.includes('td')" :colspan="getContentColSpan(item)">
                <div class="com-description-item__cell">
                    <slot :name="item.renderContent" v-bind="item">
                        <span v-html="item.$value"></span>
                    </slot>
                </div>
            </td>
        </template>
        <template v-else>
            <td class="com-description-item" :colspan="getLabelColSpan(item)">
                <div class="com-description-item-container">
                    <template v-if="types.includes('th')">
                        <div class="com-description-item__label">
                            <slot :name="item.renderLabel" v-bind="item">
                                {{ item.label }}
                            </slot>
                        </div>
                        <div class="com-description-item__colon">
                            <span v-if="getLabelColonRef">:</span>
                        </div>
                    </template>
                    <div class="com-description-item__content" v-if="types.includes('td')">
                        <slot :name="item.renderContent" v-bind="item">
                            <span v-html="item.$value"></span>
                        </slot>
                    </div>
                </div>
            </td>
        </template>
    </template>
</template>

<script lang="ts">
import {PropType} from 'vue';
import {defineComponent, computed} from 'vue';
import {DescriptionItem, DescriptionProps} from "/@/shared/components/Description/types/description";

export default defineComponent({
    name: "ComDescriptionItem",
    props: {
        types: {
            type: Array,
            default: () => ['th', 'td']
        },
        getProps: {
            type: Object as PropType<DescriptionProps>,
            default: () => ({})
        },
        items: {
            type: Array as PropType<DescriptionItem>,
            default: () => []
        }
    },
    setup(props) {
        const getLabelWidthRef = computed(() => {
            const {labelWidth} = props.getProps;
            if (!labelWidth) return undefined;
            return typeof labelWidth === 'number' || parseFloat(labelWidth) == labelWidth ? `${labelWidth}px` : labelWidth;
        })

        const getLabelColonRef = computed(() => {
            const {colon = true} = props.getProps;
            return colon;
        })

        const getLabelColSpan = ({span}) => {
            const {isVertical, border} = props.getProps;
            return isVertical || !border ? span : 1
        }

        const getContentColSpan = ({span}) => {
            const {isVertical} = props.getProps;
            return isVertical ? span : span * 2 - 1;
        }


        return {
            getLabelWidthRef,
            getLabelColonRef,
            getLabelColSpan,
            getContentColSpan
        }
    }
})

</script>

<style lang="scss" scoped>


.com-description-item__label {
    color: rgba(0, 0, 0, .85);
    font-weight: normal;
    text-align: start;
}

.com-description-item__content {
    display: table-cell;
    flex: 1;
    color: rgba(0, 0, 0, .85);
    word-break: break-word;
    overflow-wrap: break-word;
}

.com-description-mini {
    .com-description-item__cell {
        padding: 4px 16px;
    }
}

.com-description-small {
    .com-description-item__cell {
        padding: 5px 16px;
    }
}

.com-description-medium {
    .com-description-item__cell {
        padding: 7px 16px;
    }
}

.com-description-large {
    .com-description-item__cell {
        padding: 9px 16px;
    }
}

.com-description-border {
    .com-description-item__label {
        border-right: 1px solid var(--color-border-sep);
        background-color: #fafafa;
    }

    .com-description-item__content {
        border-right: 1px solid var(--color-border-sep);
    }
}

.com-description-item__content:last-child {
    border-right: none;
}

.com-description-item-container {
    display: flex;
}

.com-description-item {
    padding-bottom: 8px;
}

.com-description-item__colon {
    margin: 0 8px 0 2px;
}
</style>