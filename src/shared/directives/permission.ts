import type {App} from 'vue';
import {isArray, isEmpty, isNotEmpty} from '/@/shared/utils/is';
import {getAuthStore} from "/@/service/AuthRuleService";


async function isAuth(el: Element, binding: any) {
    let value = binding.value;
    if (isEmpty(value)) return;
    if (!isArray(value)) value = [value];
    const auths: Recordable = await getAuthStore();
    if (!value.find((auth: string) => isNotEmpty(auths[auth]))) {
        el.parentNode && el.parentNode.removeChild(el);
    }
}

export function setupPermissionDirective(app: App) {
    app.directive('auth', {
        async mounted(el: Element, binding) {
            await isAuth(el, binding);
        }
    });
}
