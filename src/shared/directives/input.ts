import type {App} from 'vue';

export function setupInputSelectDirective(app: App) {
    app.directive('select', {
        async mounted(el: HTMLInputElement) {
            const element = el.children[0] as HTMLInputElement;
            element.onfocus = () => {
                element.select()
            }
        }
    });
}
