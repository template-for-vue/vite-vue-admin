import type {App} from 'vue';
import {setupPermissionDirective} from "/@/shared/directives/permission";

export function setupDirectives(app: App) {
    setupPermissionDirective(app);
}