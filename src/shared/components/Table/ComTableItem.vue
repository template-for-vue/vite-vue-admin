<template>
    <el-table-column
        v-if="column.type === 'selection'"
        v-bind="column"
        :reserve-selection="true"
        :selectable="({disabled}) => !disabled">
    </el-table-column>
    <el-table-column
        v-else-if="column.type === 'radio'"
        v-bind="column">
        <template #default="scope">
            <el-radio class="com-table__radio" v-model="radioSelectionRef" :label="scope.row[tableProps.rowKey]"></el-radio>
        </template>
    </el-table-column>
    <el-table-column
        v-else-if="column.type === 'tree'"
        v-bind="column"
        type="default">
        <template #default="scope">
            <com-expand
                v-if="scope.row.isTreeVisible"
                :loading="scope.row.loading"
                :is-expand="treeExpands?.includes(scope.row[treeExpandProps.id])"
                @click="treeExpandClick(scope.row)"></com-expand>
        </template>
    </el-table-column>
    <template v-else-if="column.type === 'expand'">
        <el-table-column type="expand" width="1px">
            <template #default="scope">
                <slot name="expand" v-bind="scope"></slot>
            </template>
        </el-table-column>
        <el-table-column
            v-bind="column"
            type="default">
            <template #default="scope">
                <com-expand
                    :loading="scope.row.loading"
                    :is-expand="expands?.includes(scope.row[getRowKey])"
                    @click="expandClick(scope.row)"></com-expand>
            </template>
        </el-table-column>
    </template>
    <el-table-column
        v-else
        v-bind="column"
        :resizable="false"
        :width="column.width || null"
        :prop="column.prop">
        <!-- 表头 -->
        <template #header v-if="column.label || column.renderLabel">
            <slot :name="column.renderLabel" v-bind="{column}">{{ column.label }}</slot>
        </template>
        <!-- 单元格 -->
        <template #default="scope">
            <slot :name="column.renderCell" v-bind="scope">
                <!-- input -->
                <template v-if="column.type === 'input'">
                    <el-input v-model="scope.row[`${column.prop}_input`]"
                              :placeholder="column.input?.placeholder || `${column.label}`"
                              :disabled="scope.row[`${column.prop}_disabled`]"
                              size="mini"
                              @blur="handleBlur($event,scope.row,column.input?.onBlur)"
                              @input="handleInput($event,scope.row,column.input?.onInput)"></el-input>
                </template>
                <!-- button -->
                <template v-else-if="column.type === 'button'">
                    <template v-for="btn in column.buttons">
                        <template v-if="!btn.vif || btn.vif(scope.row,scope.$index)">
                            <el-button
                                type="text"
                                :class="btn.className"
                                @click.stop="handleButtonClick(scope.row,scope.$index,btn)"
                            >{{ btn.text(scope.row) }}
                            </el-button>
                        </template>
                    </template>
                </template>
                <!-- link -->
                <a v-else-if="column.type === 'link'" class="el-table-column__link"
                   @click.stop.prevent="column?.click?.(scope.row,scope.$index)">
                    {{ scope.row[getColumnKey(column)] }}
                </a>
                <!-- tag -->
                <el-tag v-else-if="column.type === 'tag'" :type="scope.row[`${column.prop}_status`]"
                        :size="getTagSizeRef">
                    {{ scope.row[`${ column.prop }_name`] }}
                </el-tag>
                <!-- badge -->
                <com-badge v-else-if="column.type === 'badge'" :type="scope.row[`${column.prop}_status`]">
                    {{ scope.row[`${ column.prop }_name`] }}
                </com-badge>
                <!-- 普通内容 -->
                <template v-else>
                    <span class="el-table-column__unset"
                          v-if="!scope.row[getColumnKey(column)] && scope.row[getColumnKey(column)] !== 0">未设置</span>
                    <template v-else-if="column.showOverflowTooltip">
                        <span @click.prevent="column?.click?.(scope.row,scope.$index)">
                            {{ scope.row[getColumnKey(column)] }}
                        </span>
                    </template>
                    <div v-else v-html="scope.row[getColumnKey(column)]"
                         @click.prevent="column?.click?.(scope.row,scope.$index)"></div>
                </template>
            </slot>
        </template>
    </el-table-column>
</template>

<script lang="ts">
import {defineComponent, computed, inject, PropType} from 'vue';
import {
    TableCol,
    TableColButton,
    TableColButtonPop,
    TableProps,
    TableRow
} from "/@/shared/components/Table/types/table";
import {isFunction} from "/@/shared/components/Table/utils";
import {useConfirm} from "/@/shared/components/hook/confirm/useConfirm";
import {ElTableColumn, ElTag, ElButton, ElInput, ElRadio} from 'element-plus';

export default defineComponent({
    name: "ComTableItem",
    inheritAttrs: false,
    components: {ElTableColumn, ElTag, ElButton, ElInput, ElRadio},
    props: {
        tableProps: {
            type: Object as PropType<TableProps>,
            default: () => ({})
        },
        column: {
            type: Object as PropType<TableCol>,
            default: () => ({})
        },
        colIndex: Number
    },
    setup(props) {

        // +----------------------------------------------------------------------
        // | 输入
        // +----------------------------------------------------------------------

        const handleInput = (e: Event, row: TableRow, callback: Fn) => {
            if (isFunction(callback)) callback(row, e);
        };
        const handleBlur = (e: any, row: TableRow, callback: Fn) => {
            if (isFunction(callback)) callback(row, e?.target?.value);
        };

        // +----------------------------------------------------------------------
        // | 单选
        // +----------------------------------------------------------------------

        const {radioSelectionRef} = inject('USE_RADIO') as any;

        // +----------------------------------------------------------------------
        // | 展开
        // +----------------------------------------------------------------------

        //树展开
        const {treeExpandClick, treeExpands, treeExpandProps} = inject('USE_TREE') as any;
        //行展开
        const {expandClick, expands, getRowKey} = inject('USE_EXPAND') as any;

        // +----------------------------------------------------------------------
        // | 点击按钮
        // +----------------------------------------------------------------------

        const {createConfirm, closeConfirm} = useConfirm();
        const handleButtonClick = async (row: TableRow, rowIndex: number, btn: TableColButton) => {
            const pop = btn.pop as TableColButtonPop;
            let {click} = btn;
            if (!isFunction(click)) click = () => {
            };
            if (pop && isFunction(pop.vif) && pop.vif(row, rowIndex)) {
                const message = (isFunction(pop.message)) ? pop.message(row, rowIndex) : pop.message;
                if (await createConfirm({message, autoClose: false})) {
                    try {
                        await click(row, rowIndex);
                    } catch (e) {
                    }
                }
                closeConfirm();
            } else {
                await click(row, rowIndex);
            }
        }

        // +----------------------------------------------------------------------
        // | tag
        // +----------------------------------------------------------------------

        const getTagSizeRef = computed(() => {
            const {size = 'small'} = props.tableProps;
            const sizeMap = {
                mini: 'mini',
                small: 'mini',
                medium: 'small',
                large: 'medium'
            }
            return sizeMap[size];
        })

        const getColumnKey = (col: TableCol) => {
            return col.isFormat ? `${col.prop}_format` : col.prop
        }

        return {
            handleInput,
            handleBlur,
            treeExpandClick,
            treeExpands,
            treeExpandProps,
            expandClick,
            expands,
            getRowKey,
            getTagSizeRef,
            handleButtonClick,
            getColumnKey,
            radioSelectionRef
        }
    }
})

</script>
<style lang="scss" scoped>
.el-table-column__unset {
    color: #bbb;
}

.el-table-column__link {
    cursor: pointer;
}

.el-button {
    padding: 0;
    min-height: unset;
}
</style>