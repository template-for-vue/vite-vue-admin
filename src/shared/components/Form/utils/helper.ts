import {ComponentType} from "/@/shared/components/Form/types/form";
import {isNumber} from "/@/shared/components/Form/utils/index";

export function handleInputNumberValue(component?: ComponentType, val?: any) {
    if (!component) return val;
    if (['Input', 'InputPassword', 'InputSearch', 'Textarea'].includes(component)) {
        return val && isNumber(val) ? `${val}` : val;
    }
    return val;
}