import type {ComputedRef} from "vue";
import {unref} from "vue";
import {FormProps, FormSchema} from "/@/shared/components/Form/types/form";
import {isArray, isFunction, isNullOrUnDef, isObject, isString} from "/@/shared/components/Form/utils";

interface UseFormValuesContext {
    getSchema?: ComputedRef<FormSchema[]>;
    getProps?: ComputedRef<FormProps>;
    formModel: Recordable;
}

const valueToArray = <T = any>(value: T): T | T[] => {
    return isArray(value) ? value : (value ? [value] : []);
}

export const useFormValues = ({getSchema, getProps, formModel}: UseFormValuesContext) => {

    const handleFormValues = (values: Recordable) => {

        if (!isObject(values)) return {}

        const schemaMap: Recordable = {};
        const schemas = (unref(getSchema) || []) as FormSchema[];
        schemas.forEach((schema) => {
            if (schema.prop) {
                schemaMap[schema.prop] = schema;
            }
        })
        const res: Recordable = {};
        for (const item of Object.entries(values)) {
            let [key, value] = item;
            if (!key || key === 'undefined' || isFunction(value)) {
                continue
            }
            if (isString(value)) {
                value = value.trim();
            }
            res[key] = value ?? '';
        }
        return res;
    }

    const initDefault = () => {
        const schemas = (unref(getSchema) || []) as FormSchema[];
        schemas.forEach(schema => {
            let {defaultValue = '', prop} = schema;

            switch (schema.component) {
                case 'InputNumber':
                    defaultValue = defaultValue || 0;
                    break;
                case 'InputTag':
                case 'TimePicker':
                    defaultValue && (defaultValue = valueToArray(defaultValue));
                    break;
                case 'Checkbox':
                    const options = (schema.componentProps as any)?.options;
                    if (options && options.length > 0) {
                        defaultValue = valueToArray(defaultValue);
                    }
                    break;
            }
            if (!isNullOrUnDef(defaultValue) && prop) {
                formModel[prop] = unref(getProps)?.formModel?.[prop] ?? defaultValue;
            }
        })
    }

    return {handleFormValues, initDefault}
}