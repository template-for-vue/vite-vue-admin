export interface DescriptionProps {
    /**
     * 标题
     */
    title?: string;

    /**
     * 列信息
     */
    schema: DescriptionItem[],

    /**
     * 数据
     */
    dataSource: Recordable,

    /**
     * 标题宽度
     */
    labelWidth?: number | string;

    /**
     * 是否展示边框
     */
    border?: boolean;

    /**
     * 配置item的 colon 的默认值
     */
    colon?: boolean;
    /**
     * 每一行item的数量
     * 默认 3
     */
    column?: number;

    /**
     * 布局
     */
    layout?: 'horizontal' | 'vertical';

    /**
     * 展示尺寸
     */
    size?: 'mini' | 'small' | 'medium' | 'large';

}

export interface DescriptionItem {
    /**
     * 列标题
     */
    label: string;

    /**
     * 对应 key
     */
    prop?: string;

    /**
     * 列占用宽度
     * default 1
     */
    span?: number;

    /**
     * 默认值
     */
    defaultValue?: string | number;

    /**
     * 对值进行转换
     * @param item
     */
    format?: (dataSource: Recordable) => string;

    /**
     * 控制 item 是否展示
     * @param arg
     */
    vshow?: ((...arg: any) => boolean) | boolean;

    /**
     * 自定义label slotName
     */
    renderLabel?: string;

    /**
     * 自定义content slotName
     */
    renderContent?: string;

    [key: string]: any;
}


export interface DescriptionInstance {
    setProps(descriptionProps: Partial<DescriptionProps>): void;
}

export type DescriptionRegister = (instance: DescriptionInstance) => void;

export type UseDescriptionReturnType = [DescriptionRegister, DescriptionInstance]