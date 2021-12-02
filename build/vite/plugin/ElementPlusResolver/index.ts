import type {ComponentInfo, ComponentResolver, SideEffectsInfo} from 'unplugin-vue-components/types';
import {kebabCase} from "./utils";

export interface ElementPlusResolverOptions {
    importStyle?: boolean | 'css' | 'sass';
    directives?: boolean;
}

type ElementPlusResolverOptionsResolved = Required<ElementPlusResolverOptions>

function getSideEffects(dirName: string, options: ElementPlusResolverOptionsResolved): SideEffectsInfo | undefined {
    const {importStyle} = options;
    const esComponentsFolder = 'element-plus/es/components'
    if (importStyle === 'sass') {
        return `${esComponentsFolder}/${dirName}/style/index`;
    } else if (importStyle === true || importStyle === 'css') {
        return `${esComponentsFolder}/${dirName}/style/css`;
    }
}

//item group panel button menu item-group
const pathMap: Record<string, string> = {
    'base': 'container',
    'main': 'container',
    'aside': 'container',
    'header': 'container',
    'footer': 'container',
    'breadcrumb-item': 'breadcrumb',
    'button-group': 'button',
    'carousel-item': 'carousel',
    'checkbox-button': 'checkbox',
    'checkbox-group': 'checkbox',
    'collapse-item': 'collapse',
    'descriptions-item': 'descriptions',
    'dropdown-item': 'dropdown',
    'dropdown-menu': 'dropdown',
    'form-item': 'form',
    'menu-item': 'menu',
    'menu-item-group': 'menu',
    'option': 'select',
    'option-group': 'select',
    'radio-button': 'radio',
    'radio-group': 'radio',
    'skeleton-item': 'skeleton',
    'step': 'steps',
    'sub-menu': 'menu',
    'tab-pane': 'tabs',
    'table-column': 'table',
    'timeline-item': 'timeline',
}

function getComponentPath(name: string) {
    return pathMap[name] ?? name;
}

function resolveComponent(name: string, options: ElementPlusResolverOptionsResolved): ComponentInfo | undefined {
    if (!name.match(/^El[A-Z]/)) return;
    const partialName = kebabCase(name.slice(2));
    const componentPath = getComponentPath(partialName);
    return {
        importName: name,
        path: `element-plus/es/components/${componentPath}/index.mjs`,
        sideEffects: getSideEffects(partialName, options),
    }
}

function resolveDirective(name: string, options: ElementPlusResolverOptionsResolved): ComponentInfo | undefined {
    if (!options.directives) return

    const directives: Record<string, { importName: string; styleName: string }> = {
        Loading: {importName: 'ElLoadingDirective', styleName: 'loading'},
        Popover: {importName: 'ElPopoverDirective', styleName: 'popover'},
        InfiniteScroll: {importName: 'ElInfiniteScroll', styleName: 'infinite-scroll'},
    }

    const directive = directives[name]
    if (!directive) return
    return {
        importName: directive.importName,
        path: `element-plus/es`,
        sideEffects: getSideEffects(directive.styleName, options),
    }
}


export function ElementPlusResolver(options: ElementPlusResolverOptions = {}): ComponentResolver {
    const optionsResolved = {
        importStyle: 'sass',
        directives: true,
        ...options
    } as ElementPlusResolverOptionsResolved

    return (name, type) => {
        switch (type) {
            case "component":
                return resolveComponent(name, optionsResolved);
            case "directive":
                return resolveDirective(name, optionsResolved);
        }
    }

}