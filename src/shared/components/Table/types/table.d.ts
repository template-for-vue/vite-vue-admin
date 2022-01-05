import {FormProps} from "/@/shared/components/Form/types/form";
import {DynamicProps} from "/@/shared/components/Form/types/utils";

export type RegisterFn = (formInstance: TableActionType) => void;

export type UseTableReturnType = [RegisterFn, TableActionType];

export type TableSize = 'medium' | 'small' | 'mini';

export interface TablePagination {
    page_index?: number;
    page_size?: number;
    total?: number;
    vshow?: boolean;
    isSimple?: boolean;
}

export interface TableQuery extends TablePagination {
    [key: string]: any;
}

export interface TableRow {
    disabled?: boolean;
    loading?: boolean;
    isTreeVisible?: boolean;

    [key: string]: any;
}


export interface TableColInput {
    placeholder?: string;
    disabled?: Fn | boolean;
    readonly?: Fn | boolean;
    onInput?: (row: TableRow, val: any) => any;
    onBlur?: (row: TableRow, val: any) => any;
}

type ButtonType = 'primary' | 'warning' | 'danger' | 'info' | 'success';

export interface TableColButtonPop {
    /**
     * 提示信息，default:`确认删除吗？`
     */
    message?: string | ((row: TableRow, rowIndex: number) => string);

    /**
     * 取消按钮文本内容
     */
    cancelText?: string;

    /**
     * 取消按钮类型
     */
    cancelType?: ButtonType;

    /**
     * 确认按钮文本
     */
    okText?: string;
    /**
     * 确认按钮样式
     */
    okType?: ButtonType;

    /**
     * 是否需要确认
     * vif = false时，无需再次确认
     * @param row
     * @param index
     */
    vif?: (row: TableRow, RowIndex: number) => boolean;
}

export interface TableColButton {

    /**
     * 按钮文字
     */
    text?: string | ((row: TableRow, rowIndex: number) => string);

    /**
     * 按钮点击事件
     * @param row
     * @param rowIndex
     */
    click?: (row: TableRow, rowIndex: number) => any;

    /**
     * 气泡确认弹窗,若`string`类型标识标题
     */
    pop?: boolean | string | TableColButtonPop;

    /**
     * 条件控制
     * @param row
     * @param rowIndex
     */
    vif?: (row: TableRow, rowIndex: number) => boolean;

    /**
     * 权限控制
     */
    vauth?: string[];

    /**
     * 按钮className
     */
    className?: string | string[];

    [key: string]: any;
}

/**
 * 标签/徽标信息
 */
export interface TableColStatus {
    [key: number]: TableColStatusValue;

    [key: string]: TableColStatusValue;
}

export interface TableColStatusValue {
    /**
     * 中文
     */
    name?: string;

    /**
     * 值
     */
    value?: string;

    /**
     * 类型
     */
    status?: 'primary' | 'success' | 'danger' | 'info' | 'warning';

    [key: string]: any;
}

export interface TableCol {
    /**
     * 获取数据的key
     */
    prop?: string;
    /**
     * 表头标题
     */
    label?: string;
    /**
     * 列宽度
     */
    width?: number | string;
    /**
     * 默认值
     */
    defaultValue?:
        | string
        | ((row: TableRow, col: TableCol, index: number) => string);
    /**
     * 格式化值
     * @param row
     * @param col
     * @param index
     */
    format?: (row: TableRow, col: TableCol, index: number) => string;
    /**
     * 对齐方式
     */
    align?:
        | 'center'
        | 'left'
        | 'right';
    /**
     * 表头对齐
     */
    headerAlign?:
        | 'center'
        | 'left'
        | 'right';
    //类型
    type?:
        | 'index'
        | 'radio'
        | 'selection'
        | 'button'
        | 'image'
        | 'link'
        | 'number'
        | 'date'
        | 'badge'
        | 'tag'
        | 'input'
        | 'tree'
        | 'expand';
    /**
     * type = index 时，索引的开始值
     */
    index?: number;
    /**
     * type = input 时，input的配置
     */
    input?: TableColInput;

    /**
     * type = button 时，针对button的配置
     */
    buttons?: TableColButton[];

    /**
     * 日期格式，`type = date` 有效，默认:`YYYY-MM-dd`
     */
    dateFormat?: string;

    /**
     * 标签配置项 / 徽标配置项
     */
    statusMap?: TableColStatus | any;

    /**
     * 是否超出显示省略
     */
    ellipsis?: boolean;
    /**
     * 同ellipsis
     */
    showOverflowTooltip?: boolean;
    /**
     * 是否展示列
     */
    vshow?: boolean | ((column: TableCol) => boolean);
    /**
     * 列固定
     */
    fixed?: 'left' | 'right' | boolean;
    /**
     * 自定义列类名
     */
    className?: string | string[];
    /**
     * 自定义列表头类名
     */
    labelClassName?: string | string[];
    /**
     * 自定义单元格渲染
     */
    renderCell?: string;
    /**
     * 自定义表头渲染
     */
    renderLabel?: string;

    /**
     * 是否开启排序
     * 只能开启服务器排序
     * 值传 true时，会被转换成 custom
     */
    sortable?: boolean | string

    /**
     * 标识索引列还是功能列
     */
    flag?: string;

    click?: (row: TableRow, index: number) => void;

    /**
     * 未处理过滤
     * 由于可以使用query直接查询，所以这里不实现过滤功能
     */

    [key: string]: any;
}

export interface TreeExpandProps {
    id: string;
    pid: string;
    isNest: boolean;
}

interface TableRowParams {
    row?: TableRow;
    rowIndex?: number;
}

interface TableParams extends TableRowParams {
    column?: TableCol;
    columnIndex?: number;
}

interface TableSpanMethodReturnObject {
    rowspan: number;
    colspan: number;
}

type TableSpanMethodReturnArray = [number, number];

type TableSpanMethodReturnType = TableSpanMethodReturnObject | TableSpanMethodReturnArray;

interface SortMap {
    ascending?: string;
    descending?: string;
}

export interface TableHeader {
    title?: string;
    toolbar?: boolean;
    buttonRender?: string;
}

export interface TableProps {

    /**
     * 表单配置
     */
    form?: Partial<DynamicProps<FormProps>>;

    /**
     * 获取表单查询数据的方法
     */
    formMethods?: Recordable;
    /**
     * 标题及操作栏配置
     */
    header?: TableHeader;

    /**
     * 表格列配置
     */
    columns?: TableCol[];
    /**
     * 表格数据
     */
    data?: TableRow[];

    dataSource?: RemoteDataSource | TableRow[];

    /**
     * 分页配置
     */
    pagination?: TablePagination;
    /**
     * 固定表格高度
     */
    height?: number | string;
    /**
     * 表格最大高度
     */
    maxHeight?: number | string;
    /**
     * 显示斑马纹
     */
    stripe?: boolean;
    /**
     * 显示边框
     */
    border?: boolean;
    /**
     * 表格尺寸
     */
    size?: 'large' | 'medium' | 'small' | 'mini';
    /**
     * 表格列是否自适应宽度
     */
    fit?: boolean;
    /**
     * 表格 key
     */
    rowKey?: string;
    /**
     * 是否展示表头
     */
    showHeader?: boolean;
    /**
     * 是否高亮当前行
     */
    highlightCurrentRow?: boolean;
    /**
     * 默认选中行的key值，高亮显示
     */
    currentRowKey?: string | number;
    /**
     * 设置行类名
     */
    rowClassName?: string | (({row, rowIndex}: TableRowParams) => string);
    /**
     * 设置行样式
     */
    rowStyle?: Recordable | (({row, rowIndex}: TableRowParams) => string);
    /**
     * 设置单元格类名
     */
    cellClassName?: string | (({row, column, rowIndex, columnIndex}: TableParams) => string);
    /**
     * 设置单元格样式
     */
    cellStyle?: Recordable | (({row, column, rowIndex, columnIndex}: TableParams) => string);
    /**
     * 设置表头行类名
     */
    headerRowClassName?: string | (({row, rowIndex}: TableRowParams) => string);
    /**
     * 设置表头行样式
     */
    headerRowStyle?: Recordable | (({row, rowIndex}: TableRowParams) => string);
    /**
     * 设置表头单元格类名
     */
    headerCellClassName?: string | (({row, column, rowIndex, columnIndex}: TableParams) => string);
    /**
     * 设置表头单元格样式
     */
    headerCellStyle?: Recordable | (({row, column, rowIndex, columnIndex}: TableParams) => string);
    /**
     * 无数据时展示的文字提示
     */
    emptyText?: string;
    /**
     * 是否默认展开全部
     */
    defaultExpandAll?: boolean;
    /**
     * 设置默认展开的行
     */
    expandRowKeys?: any[];
    /**
     * 树展开配置
     */
    treeExpandProps?: TreeExpandProps;

    /**
     * 显示汇总
     */
    showSummary?: boolean;
    /**
     * 汇总行文字显示
     */
    sumText?: string;
    /**
     * 自定义汇总方法
     * @param TableCol
     * @param TableRow
     */
    summaryMethod?: ({column: TableCol, row: TableRow}) => void;
    /**
     * 合并行和列的配置
     * 注意合并时，被合并的单元格要设置为 {rowSpan:0,colSpan:0}
     * @param row
     * @param rowIndex
     */
    spanMethod?: ({row, rowIndex}: TableRowParams) => TableSpanMethodReturnType;

    /**
     * 排序的规则映射
     * 默认 {'ascending':'asc','descending':'desc'}
     */
    sortMap?: SortMap;

    /**
     * radio 单选变更时触发
     */
    onRadioChange?: Fn;

    /**
     * 单选默认选中项
     */
    defaultRadio?: string | number;

    /**
     * selection变更时触发
     */
    onSelectionChange?: Fn;

    /**
     * 全选时触发
     */
    onSelectAll?: Fn;

    /**
     * 默认选中项
     */
    defaultSelection?: string[];

    /**
     * 展开时触发的方法
     */
    onExpandChange?: Fn;

    /**
     * 排序发生变更时触发
     */
    onSort?: Fn;

    /**
     * 表格行点击事件
     */
    onRowClick?: Fn;

    /**
     * 页数变化时触发
     */
    onPageIndexChange?: Fn;

    /**
     * 每页数量变化时触发
     */
    onPageSizeChange?: Fn;

    /**
     * 每页数量变化时触发
     */
    onReset?: Fn;

    /**
     * 获取远程数据的方法
     */
    getRemoteDataSource?: (query: Recordable) => Promise<RemoteDataSource>;

    /**
     * 列权限控制，返回字段列表
     * 优先于 vExColumnAuth
     */
    vColumnAuth?: (() => Recordable | string[]) | Recordable | string[];

    /**
     * 列权限控制，返回排除列
     */
    vExColumnAuth?: (() => Recordable | string[]) | Recordable | string[];

    /**
     * 按钮权限控制，返回操作授权列表
     */
    vButtonAuth?: (() => Recordable | string[]) | Recordable | string[];
}

export interface RemoteDataSource {
    list?: TableRow[];
    total?: number;
}

export interface TableActionType {
    setProps: (props: Partial<TableProps>) => void;
    handleReset: () => Promise<TableRow[]>;
    handleSearch: (query: Recordable) => Promise<TableRow[]>;
    getDataSource: () => Promise<TableRow[]> | TableRow[];
    setDataSource: (data: TableRow[]) => void;
    getColumns: (params?: GetColumnsParams) => Promise<TableCol[]> | TableCol[];
    setColumns: (columnList: TableCol[] | string[]) => void;
    getPagination: () => Promise<TablePagination> | TablePagination;
    setPagination: (pagination: TablePagination) => void;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    handleTreeExpandAll?: () => void;
    handleTreeCollapseAll?: () => void;
    toggleRowSelection: (row: TableRow, selected?: boolean) => void;
    toggleAllSelection: () => void;
    clearSort: () => void;
    doLayout: () => void;
    getTableRef: () => any;
}

export interface GetColumnsParams {
    ignoreIndex?: boolean;
    ignoreAction?: boolean;
}