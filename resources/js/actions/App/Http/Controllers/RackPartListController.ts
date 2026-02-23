import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:14
 * @route '/rack'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:14
 * @route '/rack'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:14
 * @route '/rack'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:14
 * @route '/rack'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:28
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
 * @see app/Http/Controllers/RackPartListController.php:28
 * @route '/rack/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:28
 * @route '/rack/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:28
 * @route '/rack/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:36
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
 * @see app/Http/Controllers/RackPartListController.php:36
 * @route '/rack/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:36
 * @route '/rack/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:47
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
 * @see app/Http/Controllers/RackPartListController.php:47
 * @route '/rack/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:47
 * @route '/rack/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:47
 * @route '/rack/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})
const RackPartListController = { index, exportMethod, importMethod, template, export: exportMethod, import: importMethod }

export default RackPartListController