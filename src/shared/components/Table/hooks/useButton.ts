import type {ComputedRef} from "vue";
import {unref} from "vue";
import {TableColButton, TableColButtonPop, TableProps} from "/@/shared/components/Table/types/table";
import {isArray, isBoolean, isFunction} from "/@/shared/components/Table/utils";
import {warn} from "/@/shared/components/Table/utils/log";
import {isObject} from "/@/shared/utils/is";

export const useButton = (buttons: TableColButton[] = [], getProps: ComputedRef<TableProps>) => {

    const getPopProps = (pop: TableColButtonPop | boolean | string): TableColButtonPop => {
        const res: TableColButtonPop = {};
        res.message = ((pop as TableColButtonPop).message || (isBoolean(pop) ? '确定删除吗?' : pop || '确定删除吗?')) as string;
        res.cancelText = (pop as TableColButtonPop).cancelText || '取消';
        res.cancelType = (pop as TableColButtonPop).cancelType || undefined;
        res.okText = (pop as TableColButtonPop).cancelType || '确定';
        res.okType = (pop as TableColButtonPop).cancelType || 'primary';
        res.vif = (pop as TableColButtonPop).vif || (() => true);
        return res;
    }

    const tempButtons: TableColButton[] = [];
    const {vButtonAuth} = unref(getProps);
    const buttonAuths = (isFunction(vButtonAuth) ? vButtonAuth?.() : vButtonAuth) || [];
    const auths: string[] = isObject(buttonAuths) ? Object.keys(buttonAuths) : buttonAuths;
    for (const btn of buttons) {
        //auth
        if (auths.length > 0 && isArray(btn.vauth) && btn.vauth.length > 0) {
            if (!btn.vauth.find(auth => auths.includes(auth))) continue;
        }
        //pop
        if (btn.pop) btn.pop = getPopProps(btn.pop);
        //text
        const text = btn.text || '';
        if (!isFunction(text)) btn.text = (() => text) as any;
        //点击事件
        btn.click = isFunction(btn.click) ? btn.click : () => {
            warn('请设置click方法')
        }
        tempButtons.push(btn);
    }

    return {buttons: tempButtons}
}