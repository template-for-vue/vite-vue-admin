import {ComputedRef, Ref, toRaw} from 'vue';
import {unref} from 'vue';
import {FormActionType, FormSchema, NamePath, UseAppendSchemaOptions} from "/@/shared/components/Form/types/form";
import {handleInputNumberValue} from "/@/shared/components/Form/utils/helper";
import {
    deepClone,
    deepMerge,
    isArray,
    isNullOrUnDef,
    isObject,
    isString,
    isUnDef
} from "/@/shared/components/Form/utils";
import {error} from "/@/shared/components/Form/utils/log";

interface UseFormActionContext {
    emit: EmitType;
    formElRef: Ref<FormActionType>;
    formModel: Recordable;
    getSchema: ComputedRef<FormSchema[]>;
    schemaRef: Ref<FormSchema[]>;
    handleFormValues: Fn
}


export const useFormEvents = (
    {
        emit,
        formElRef,
        formModel,
        getSchema,
        schemaRef,
        handleFormValues
    }: UseFormActionContext) => {

    const removeSchemaByField = (props: string | string[]): void => {
        if (props) {
            const schemaList: FormSchema[] = deepClone(unref(getSchema));
            let fieldList: string[] = isString(props) ? [props] : props;
            for (const field of fieldList) {
                if (isString(field)) {
                    const index = schemaList.findIndex((schema) => schema.prop === field);
                    if (~index) {
                        delete formModel[field];
                        schemaList.splice(index, 1);
                    }
                }
            }
            schemaRef.value = schemaList;
        }
    }

    const appendSchemaByField = (schema: FormSchema, options: UseAppendSchemaOptions) => {
        const schemaList: FormSchema[] = deepClone(unref(getSchema));
        const hasInList = schemaList.some((item) => item.prop === schema.prop);
        if (hasInList) return;
        const {prefixProp, first = false} = options || {};
        let index = first ? -1 : schemaList.length - 1;
        if (index > -1 && prefixProp) {
            const targetIndex = schemaList.findIndex((schema) => schema.prop === prefixProp);
            if (targetIndex > -1) index = targetIndex;
        }
        schemaList.splice(index + 1, 0, schema);
        schemaRef.value = schemaList;
    }

    const resetSchema = (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
        let updateData: Partial<FormSchema>[] = [];
        if (isObject(data)) {
            updateData.push(data as FormSchema)
        }
        if (isArray(data)) {
            updateData = [...data]
        }
        const hasField = updateData.every((item) => item.component === 'Divider' || Reflect.has(item, 'prop') && item.prop);
        if (!hasField) {
            error('All children of the form Schema array that need to be updated must contain the `prop`');
            return;
        }
        schemaRef.value = updateData as FormSchema[];
    }

    const updateSchema = (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
        let updateData: Partial<FormSchema>[] = [];
        if (isObject(data)) {
            updateData.push(data as FormSchema)
        }
        if (isArray(data)) {
            updateData = [...data]
        }
        const hasField = updateData.every((item) => item.component === 'Divider' || Reflect.has(item, 'prop') && item.prop);
        if (!hasField) {
            error('All children of the form Schema array that need to be updated must contain the `prop`');
            return;
        }
        const schema: FormSchema[] = [];
        updateData.forEach((item) => {
            unref(getSchema).forEach((val) => {
                if (val.prop === item.prop) {
                    const newSchema = deepMerge(val, item);
                    schema.push(newSchema);
                } else {
                    schema.push(val)
                }
            })
        })
        schemaRef.value = schema;
    }

    const validate = async (nameList?: NamePath): Promise<any> => {
        let result :any;
        try{
            result = isUnDef(nameList) || isArray(nameList) && (nameList as []).length === 0 ?
                await unref(formElRef)?.validate() :
                await unref(formElRef)?.validateField(nameList!)
        }catch(e){
            result = e;
        }
        return result;
    }

    const validateField = async (nameList: NamePath): Promise<void> => {
        return await unref(formElRef)?.validateField(nameList)
    }

    const clearValidate = () => {
        unref(formElRef)?.clearValidate();
    }

    const setFieldsValue = (values: Recordable): void => {
        Object.keys(values).forEach(key => {
            const schema = unref(getSchema).find((item) => item.prop === key);
            if (schema) {
                formModel[key] = handleInputNumberValue(schema?.component, values[key]);
            }
        })
    }

    const getFieldsValue = (): Recordable => {
        return handleFormValues(toRaw(unref(formModel)))
    }


    const resetFields = () => {
        const defaultValues: Recordable = {};
        unref(getSchema).forEach((item) => {
            if (!isNullOrUnDef(item.defaultValue) && item.prop) {
                defaultValues[item.prop] = item.defaultValue
            }
        })
        Object.keys(formModel).forEach((key) => {
            formModel[key] = defaultValues[key];
        })
        clearValidate();
        emit('reset', toRaw(formModel))
    }

    return {
        setFieldsValue,
        removeSchemaByField,
        appendSchemaByField,
        resetSchema,
        updateSchema,
        getFieldsValue,
        validate,
        validateField,
        resetFields,
        clearValidate
    }
}