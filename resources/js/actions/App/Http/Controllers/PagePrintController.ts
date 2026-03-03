import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PagePrintController::index
 * @see app/Http/Controllers/PagePrintController.php:12
 * @route '/home/print/label'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/home/print/label',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagePrintController::index
 * @see app/Http/Controllers/PagePrintController.php:12
 * @route '/home/print/label'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagePrintController::index
 * @see app/Http/Controllers/PagePrintController.php:12
 * @route '/home/print/label'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagePrintController::index
 * @see app/Http/Controllers/PagePrintController.php:12
 * @route '/home/print/label'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const PagePrintController = { index }

export default PagePrintController