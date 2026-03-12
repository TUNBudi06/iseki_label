import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImportLabelController::index
 * @see app/Http/Controllers/ImportLabelController.php:17
 * @route '/home/import-label'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/home/import-label',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImportLabelController::index
 * @see app/Http/Controllers/ImportLabelController.php:17
 * @route '/home/import-label'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportLabelController::index
 * @see app/Http/Controllers/ImportLabelController.php:17
 * @route '/home/import-label'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImportLabelController::index
 * @see app/Http/Controllers/ImportLabelController.php:17
 * @route '/home/import-label'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImportLabelController::store
 * @see app/Http/Controllers/ImportLabelController.php:47
 * @route '/home/import-label/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/home/import-label/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImportLabelController::store
 * @see app/Http/Controllers/ImportLabelController.php:47
 * @route '/home/import-label/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportLabelController::store
 * @see app/Http/Controllers/ImportLabelController.php:47
 * @route '/home/import-label/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImportLabelController::importFromExcel
 * @see app/Http/Controllers/ImportLabelController.php:82
 * @route '/home/import-label/import-excel'
 */
export const importFromExcel = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importFromExcel.url(options),
    method: 'post',
})

importFromExcel.definition = {
    methods: ["post"],
    url: '/home/import-label/import-excel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImportLabelController::importFromExcel
 * @see app/Http/Controllers/ImportLabelController.php:82
 * @route '/home/import-label/import-excel'
 */
importFromExcel.url = (options?: RouteQueryOptions) => {
    return importFromExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportLabelController::importFromExcel
 * @see app/Http/Controllers/ImportLabelController.php:82
 * @route '/home/import-label/import-excel'
 */
importFromExcel.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importFromExcel.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImportLabelController::template
 * @see app/Http/Controllers/ImportLabelController.php:111
 * @route '/home/import-label/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/home/import-label/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImportLabelController::template
 * @see app/Http/Controllers/ImportLabelController.php:111
 * @route '/home/import-label/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportLabelController::template
 * @see app/Http/Controllers/ImportLabelController.php:111
 * @route '/home/import-label/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImportLabelController::template
 * @see app/Http/Controllers/ImportLabelController.php:111
 * @route '/home/import-label/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImportLabelController::searchRack
 * @see app/Http/Controllers/ImportLabelController.php:25
 * @route '/api/import-label/search-rack'
 */
export const searchRack = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchRack.url(options),
    method: 'get',
})

searchRack.definition = {
    methods: ["get","head"],
    url: '/api/import-label/search-rack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImportLabelController::searchRack
 * @see app/Http/Controllers/ImportLabelController.php:25
 * @route '/api/import-label/search-rack'
 */
searchRack.url = (options?: RouteQueryOptions) => {
    return searchRack.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImportLabelController::searchRack
 * @see app/Http/Controllers/ImportLabelController.php:25
 * @route '/api/import-label/search-rack'
 */
searchRack.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchRack.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImportLabelController::searchRack
 * @see app/Http/Controllers/ImportLabelController.php:25
 * @route '/api/import-label/search-rack'
 */
searchRack.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchRack.url(options),
    method: 'head',
})
const ImportLabelController = { index, store, importFromExcel, template, searchRack }

export default ImportLabelController