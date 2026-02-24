import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RackPartListController::rackIndex
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
export const rackIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rackIndex.url(options),
    method: 'get',
})

rackIndex.definition = {
    methods: ["get","head"],
    url: '/rack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::rackIndex
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
rackIndex.url = (options?: RouteQueryOptions) => {
    return rackIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::rackIndex
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
rackIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rackIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::rackIndex
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
rackIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rackIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/rack/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/rack/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/rack/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::rackStore
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
export const rackStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rackStore.url(options),
    method: 'post',
})

rackStore.definition = {
    methods: ["post"],
    url: '/rack/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::rackStore
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
rackStore.url = (options?: RouteQueryOptions) => {
    return rackStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::rackStore
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
rackStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rackStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::rackUpdate
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
export const rackUpdate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rackUpdate.url(args, options),
    method: 'post',
})

rackUpdate.definition = {
    methods: ["post"],
    url: '/rack/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::rackUpdate
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
rackUpdate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return rackUpdate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::rackUpdate
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
rackUpdate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rackUpdate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::rackDestroy
 * @see app/Http/Controllers/RackPartListController.php:156
 * @route '/rack/delete/{id}'
 */
export const rackDestroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: rackDestroy.url(args, options),
    method: 'delete',
})

rackDestroy.definition = {
    methods: ["delete"],
    url: '/rack/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RackPartListController::rackDestroy
 * @see app/Http/Controllers/RackPartListController.php:156
 * @route '/rack/delete/{id}'
 */
rackDestroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return rackDestroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::rackDestroy
 * @see app/Http/Controllers/RackPartListController.php:156
 * @route '/rack/delete/{id}'
 */
rackDestroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: rackDestroy.url(args, options),
    method: 'delete',
})
const rack = {
    rackIndex: Object.assign(rackIndex, rackIndex),
export: Object.assign(exportMethod, exportMethod),
import: Object.assign(importMethod, importMethod),
template: Object.assign(template, template),
rackStore: Object.assign(rackStore, rackStore),
rackUpdate: Object.assign(rackUpdate, rackUpdate),
rackDestroy: Object.assign(rackDestroy, rackDestroy),
}

export default rack