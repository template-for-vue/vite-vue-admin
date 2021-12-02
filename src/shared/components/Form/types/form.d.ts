
export type NamePath = string | string[];

export interface FormActionType {
    setProps: (formProps: Partial<FormProps>) => Promise<void>;
    validateField: (nameList: NamePath) => Promise<void>;
    validate: (nameList?: NamePath) => Promise<any>;
    clearValidate: () => void;
    getFieldsValue: () => Recordable;
    setFieldsValue: (values: Recordable) => void;
    resetFields: () => void;
    removeSchemaByField: (fields: NamePath) => void;
    appendSchemaByField: (schema: FormSchema, options?: UseAppendSchemaOptions) => void;
    resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => void;
    updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => void;

}

export interface UseAppendSchemaOptions {
    prefixProp?: string;
    first?: boolean;
}

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];

export interface FormProps {
    formModel?: Rrecordable;
    labelPosition?: 'left' | 'right' | 'top';
    labelWidth?: string | number;
    hideRequiredAsterisk?: boolean;
    showMessage?: boolean;
    statusIcon?: boolean;
    size?: 'large' | 'mini' | 'small' | 'medium';
    disabled?: boolean;
    schemas: FormSchema[];
    rowProps?: RowProps;
    colProps?: ColProps;
    className?: string | string[];
}

export interface RenderCallbackParams {
    schema: FormSchema;
    model: Recordable;
    prop: string;
}

export interface FormSchema {
    prop?: string;
    label?: string;
    labelWidth?: string | number;
    placeholder?: string;
    tip?: string;
    help?:
        | string
        | string[]
        | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
    disabled?:
        | boolean
        | ((renderCallbackParams: RenderCallbackParams) => boolean);
    component?: ComponentType;
    componentProps?:
        | object
        | ((opt: { schema: FormSchema; formActionType: FormActionType; formModel: Recordable }) => Recordable);
    required?:
        | boolean
        | ((renderCallbackParams: RenderCallbackParams) => boolean);
    rules?:
        | any[]
        | ((renderCallbackParams: RenderCallbackParams) => any[]);
    defaultValue?: any;
    vshow?:
        | boolean
        | ((renderCallbackParams: RenderCallbackParams) => boolean);
    vif?:
        | boolean
        | ((renderCallbackParams: RenderCallbackParams) => boolean);
    renderLabel?: string;
    renderItem?: string;
    size?: 'mini' | 'small' | 'medium';
    colProps?: ColProps;
    class?: string | string[];
    prefixIcon?: string;
    suffixIcon?: string;
    prependRender?: string;
    appendRender?: string;
    hidden?: boolean;
}

export interface RowProps {
    gutter?: number;
    justify?:
        | 'start'
        | 'end'
        | 'center'
        | 'space-around'
        | 'space-between';
    align?:
        | 'top'
        | 'middle'
        | 'bottom';
    tag?: string
}

export interface ColProps {
    span?: number | string;
    offset?: number;
    push?: number;
    pull?: number;
    tag?: string;
    xs?: number | ColPropItem;
    sm?: number | ColPropItem;
    md?: number | ColPropItem;
    lg?: number | ColPropItem;
    xl?: number | ColPropItem;
    class?: string;
}

export interface ColPropItem {
    span?: number;
    offset?: number;
}

export type ComponentType =
    | 'Input'
    | 'InputPassword'
    | 'InputNumber'
    | 'InputTag'
    | 'Textarea'
    | 'Select'
    | 'Checkbox'
    | 'CheckBox'
    | 'Radio'
    | 'Switch'
    | 'Cascader'
    | 'DatePicker'
    | 'TimePicker'
    | 'Divider'
