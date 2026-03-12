import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
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
const importLabel = {
    searchRack: Object.assign(searchRack, searchRack),
}

export default importLabel