import type {App} from 'vue';
import {setupPermissionDirective} from "/@/shared/directives/permission";
import {setupInputSelectDirective} from "/@/shared/directives/input";

export function setupDirectives(app: App) {
    setupPermissionDirective(app);
    setupInputSelectDirective(app);
}