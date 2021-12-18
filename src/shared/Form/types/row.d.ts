export type GutterRecordKey = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export interface RowProps {
    gutter?:
        | number
        | Partial<Record<GutterRecordKey, number>>;
    justify?:
        | 'start'
        | 'center'
        | 'end'
        | 'space-around'
        | 'space-between';
    align?: 'start' | 'center' | 'end' | 'stretch';
    div?: boolean;
}

export interface ColProps {
    span?: number;
    offset?: number;
    order?: number;
    xxl?: number | Recordable
    xl?: number | Recordable
    lg?: number | Recordable
    md?: number | Recordable
    sm?: number | Recordable
    xs?: number | Recordable
}