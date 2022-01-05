<template>
    <el-col v-if="getIf" v-show="getShow" v-bind="colProps">
        <el-form-item v-bind="itemProps">
            <template #label v-if="itemProps.renderLabel">
                <slot :name="itemProps.renderLabel" v-bind="getValues"></slot>
            </template>
            <template #label v-if="itemProps.label && !itemProps.renderLabel && (itemProps.tip || itemProps.help)">
                <div class="el-form-item__label-custom">
                    <span class="el-form-item__label-text">{{ itemProps.label }}</span>
                    <span class="el-form-item__label-tip" v-if="itemProps.tip">{{ itemProps.tip }}</span>
                    <div class="el-form-item__label-help" v-if="itemProps.help && itemProps.help.length > 0">
                        <el-tooltip effect="light">
                            <template #content>
                                <p v-for="text in itemProps.help" class="el-form-item__label-help-text">{{ text }}</p>
                            </template>
                            <com-icon name="info"></com-icon>
                        </el-tooltip>
                    </div>
                </div>
            </template>
            <template v-if="itemProps.renderItem && $slots[itemProps.renderItem]">
                <slot :name="itemProps.renderItem" v-bind="getValues"></slot>
            </template>
            <template v-else>
                <template v-if="itemProps.component === 'Input'">
                    <el-input v-bind="comProps" v-model="formModel[itemProps.prop]">
                        <template #prefix v-if="itemProps.prefixIcon">
                            <div class="el-input-extra__wrap">
                                <com-icon :name="itemProps.prefixIcon"></com-icon>
                            </div>
                        </template>
                        <template #suffix v-if="itemProps.suffixIcon">
                            <div class="el-input-extra__wrap">
                                <com-icon :name="itemProps.suffixIcon"></com-icon>
                            </div>
                        </template>
                        <template #prepend v-if="itemProps.prependRender && $slots[itemProps.prependRender]">
                            <slot :name="itemProps.prependRender" v-bind="getValues"></slot>
                        </template>
                        <template #append v-if="itemProps.appendRender && $slots[itemProps.appendRender]">
                            <slot :name="itemProps.appendRender" v-bind="getValues"></slot>
                        </template>
                    </el-input>
                </template>
                <template v-if="itemProps.component === 'InputNumber'">
                    <el-input-number v-bind="comProps" v-model="formModel[schema.prop]"></el-input-number>
                </template>
                <template v-if="itemProps.component === 'Select'">
                    <el-select v-bind="comProps" v-model="formModel[itemProps.prop]">
                        <template v-if="comProps.group">
                            <el-option-group :label="option.label" v-for="option in comProps.options">
                                <el-option v-for="opt in option.children"
                                           :value="opt[comProps.optionProp.value] ?? opt"
                                           :label="opt[comProps.optionProp.label] ?? opt"
                                           :disabled="opt.disabled">{{ opt[comProps.optionProp.label] || opt }}
                                </el-option>
                            </el-option-group>
                        </template>
                        <template v-else>
                            <el-option v-for="option in comProps.options"
                                       :value="option[comProps.optionProp.value] ?? option"
                                       :label="option[comProps.optionProp.label] ?? option"
                                       :disabled="option.disabled">{{ option[comProps.optionProp.label] ?? option }}
                            </el-option>
                        </template>
                    </el-select>
                </template>
                <template v-if="itemProps.component === 'Checkbox' || itemProps.component === 'CheckBox'">
                    <template v-if="comProps.options && comProps.options.length > 0">
                        <el-checkbox-group v-bind="comProps" :class="{'is-button-type':comProps.type === 'button'}"
                                           v-model="formModel[itemProps.prop]">
                            <template v-if="comProps.type === 'button'">
                                <el-checkbox-button v-for="opt in comProps.options"
                                                    :label="opt[comProps.optionProp.value] ?? opt"
                                                    :disabled="opt.disabled">
                                    {{ opt[comProps.optionProp.label] ?? opt }}
                                </el-checkbox-button>
                            </template>
                            <template v-else>
                                <el-checkbox v-for="opt in comProps.options"
                                             :value="opt[comProps.optionProp.value] ?? opt"
                                             :label="opt[comProps.optionProp.label] ?? opt"
                                             :disabled="opt.disabled">{{ opt[comProps.optionProp.label] ?? opt }}
                                </el-checkbox>
                            </template>
                        </el-checkbox-group>
                    </template>
                    <template v-else>
                        <el-checkbox v-bind="comProps" v-model="formModel[itemProps.prop]">
                            {{ comProps.label || itemProps.label }}
                        </el-checkbox>
                    </template>
                </template>
                <template v-if="itemProps.component === 'Radio'">
                    <template v-if="comProps.options && comProps.options.length > 0">
                        <el-radio-group v-bind="comProps" :class="{'is-button-type':comProps.type === 'button'}"
                                        v-model="formModel[itemProps.prop]">
                            <template v-if="comProps.type === 'button'">
                                <el-radio-button v-for="opt in comProps.options"
                                                 :label="opt[comProps.optionProp.value] ?? opt"
                                                 :disabled="opt.disabled">{{ opt[comProps.optionProp.label] ?? opt }}
                                </el-radio-button>
                            </template>
                            <template v-else>
                                <el-radio v-for="opt in comProps.options"
                                          :value="opt[comProps.optionProp.value] ?? opt"
                                          :label="opt[comProps.optionProp.label] ?? opt"
                                          :disabled="opt.disabled">{{ opt[comProps.optionProp.label] ?? opt }}
                                </el-radio>
                            </template>
                        </el-radio-group>
                    </template>
                </template>
                <template v-if="itemProps.component === 'Switch'">
                    <el-switch :class="`el-switch_type-${comProps.type || 'circle'}`" v-bind="comProps"
                               v-model="formModel[itemProps.prop]"></el-switch>
                </template>
                <template v-if="itemProps.component === 'Cascader'">
                    <el-cascader v-bind="comProps" v-model="formModel[itemProps.prop]"></el-cascader>
                </template>
                <template v-if="itemProps.component === 'DatePicker'">
                    <el-date-picker v-bind="comProps" v-model="formModel[schema.prop]"></el-date-picker>
                </template>
                <template v-if="itemProps.component === 'TimePicker'">
                    <el-time-picker v-bind="comProps" v-model="formModel[schema.prop]"></el-time-picker>
                </template>
                <template v-if="itemProps.component === 'Divider'">
                    <el-divider v-bind="comProps">{{ comProps.content || '' }}</el-divider>
                </template>
            </template>
        </el-form-item>
    </el-col>
</template>

<script lang="ts">
import type {PropType} from 'vue';
import {computed, defineComponent, unref} from 'vue';
import {FormActionType, FormProps, FormSchema, RenderCallbackParams} from "/@/shared/components/Form/types/form";
import {isArray, isBoolean, isFunction} from "/@/shared/components/Form/utils";
import {
    ElCascader,
    ElCheckbox,
    ElCheckboxButton,
    ElCheckboxGroup,
    ElCol,
    ElDatePicker,
    ElDivider,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElOption,
    ElOptionGroup,
    ElRadio,
    ElRadioButton,
    ElRadioGroup,
    ElSelect,
    ElSwitch,
    ElTimePicker,
    ElTooltip,
} from 'element-plus';

export default defineComponent({
    name: "ComFormItem",
    components: {
        ElCol,
        ElFormItem,
        ElTooltip,
        ElInput,
        ElInputNumber,
        ElSelect,
        ElOptionGroup,
        ElOption,
        ElCheckbox,
        ElCheckboxButton,
        ElCheckboxGroup,
        ElRadio,
        ElRadioButton,
        ElRadioGroup,
        ElSwitch,
        ElCascader,
        ElDatePicker,
        ElTimePicker,
        ElDivider
    },
    inheritAttrs: false,
    props: {
        schema: {
            type: Object as PropType<FormSchema>,
            default: () => ({})
        },
        formProps: {
            type: Object as PropType<FormProps>,
            default: () => ({})
        },
        formModel: {
            type: Object as PropType<Recordable>,
            default: () => ({})
        },
        formActionType: {
            type: Object as PropType<FormActionType>,
            default: () => ({})
        }
    },
    setup(props) {
        // +----------------------------------------------------------------------
        // | 基础变量
        // +----------------------------------------------------------------------

        const getValues = computed(() => {
            const {formModel, schema} = props || {};
            return {
                prop: schema.prop,
                model: formModel || {},
                schema
            } as RenderCallbackParams
        })

        const getComponentsProps = computed(() => {
            const {schema, formModel, formActionType} = props;
            let {componentProps = {}} = schema;
            if (isFunction(componentProps)) {
                componentProps = componentProps({schema, formModel, formActionType}) ?? {};
            }
            if (schema.component === 'Divider') {
                componentProps = Object.assign(componentProps, {'contentPosition': 'left'})
            }
            return componentProps as Recordable;
        })

        const getDisabled = computed(() => {
            const {disabled: formDisabled} = props.formProps;
            const {disabled: schemaDisabled} = props.schema;
            let disabled = !!formDisabled;
            if (isBoolean(schemaDisabled)) {
                disabled = schemaDisabled
            }
            if (isFunction(schemaDisabled)) {
                disabled = schemaDisabled(unref(getValues))
            }
            return disabled
        });

        const getShow = computed(() => {
            const {vshow = true, hidden = false} = props.schema;
            return !hidden && (isFunction(vshow) ? vshow(unref(getValues)) : vshow);
        })
        const getIf = computed(() => {
            const {vif = true} = props.schema;
            return isFunction(vif) ? vif(unref(getValues)) : vif;
        })

        // +----------------------------------------------------------------------
        // | 校验规则配置
        // +----------------------------------------------------------------------

        const getRequired = computed(() => {
            const {required} = props.schema;
            return isFunction(required) ? required(unref(getValues)) : required;
        })

        const getRules = computed(() => {
            const {rules: defRules = [], prop, label} = props.schema;
            let rules: any[] = [];
            if (unref(getIf) && unref(getShow)) {
                rules = isFunction(defRules) ? defRules(unref(getValues)) : defRules;
                const isRequired = rules.some((rule) => rule.required);
                if (!isRequired && unref(getRequired)) {
                    rules.push({required: true, message: `${label || prop || ''}不能为空`})
                }
            }
            return rules
        })
        // +----------------------------------------------------------------------
        // | grid布局
        // +----------------------------------------------------------------------

        const {colProps: formColProps} = props.formProps;
        const {colProps: schemaColProps} = props.schema;
        const colProps = Object.assign({}, formColProps || {}, schemaColProps || {});

        // +----------------------------------------------------------------------
        // | 组织 form-item 属性 及 组件属性
        // +----------------------------------------------------------------------

        const {size, labelWidth: formLabelWidth} = props.formProps;
        const {placeholder, help, component, label, labelWidth} = props.schema;

        const itemProps = computed(() => {
            return {
                ...props.schema,
                help: help && !isArray(help) ? [help] : help,
                size,
                rules: unref(getRules),
                labelWidth:labelWidth || formLabelWidth,
                required: unref(getRequired) && unref(getIf) && unref(getShow)
            } as FormSchema
        })

        const dateFormatMap: any = {
            'year': 'YYYY',
            'month': 'YYYY-MM',
            'monthrange': 'YYYY-MM',
        }
        const comProps: Recordable = computed(() => {
            const comProps = unref(getComponentsProps);
            const props = {
                placeholder: placeholder ?? `请输入${label || ''}`,
                disabled: unref(getDisabled),
                ...comProps
            } as any
            if (
                component === 'Select' ||
                component === 'Radio' ||
                component === 'Checkbox' ||
                component === 'CheckBox'
            ) {
                props.optionProp = Object.assign({
                    label: 'label',
                    value: 'value'
                }, props.optionProp);
            }
            if (component === 'Switch') {
                props.type = props.type ?? 'round'
            }
            if (component === 'DatePicker' && !props.valueFormat) {
                props.valueFormat = dateFormatMap[comProps.type] || 'X';
            }
            if (component === 'TimePicker' && !props.valueFormat) {
                props.valueFormat = 'HH:mm:ss'
            }
            return props;
        })

        return {
            getIf,
            getShow,
            colProps,
            itemProps,
            comProps,
            getValues
        }
    }
})

</script>
<style lang="scss">
.el-form-item__label-custom {
    display: inline-flex;
    align-items: center
}

.el-form--label-right .el-form-item__label-custom {
    justify-content: flex-end;
}

.el-form-item__label-tip {
    margin-left: 2px;
    color: var(--text-color-secondary);
}

.el-form-item__label-help {
    display: flex;
    align-items: center;
    margin-left: 4px;

    .com-icon {
        color: var(--el-text-color-placeholder) !important;
        cursor: pointer;
    }
}

.el-form-item__label-help-text {
    font-size: 12px;
    color: var(--text-color-secondary);
}

.el-form-item__label-help-text + .el-form-item__label-help-text {
    margin-top: 4px;
}

.el-input-extra__wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
}
</style>