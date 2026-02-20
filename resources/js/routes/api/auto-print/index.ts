import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
export const listAuto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAuto.url(options),
    method: 'get',
})

listAuto.definition = {
    methods: ["get","head"],
    url: '/api/auto-print/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.url = (options?: RouteQueryOptions) => {
    return listAuto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAuto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listAuto.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AutoPrintController::markAutoPrint
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
export const markAutoPrint = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAutoPrint.url(options),
    method: 'post',
})

markAutoPrint.definition = {
    methods: ["post"],
    url: '/api/auto-print/mark-as-printed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AutoPrintController::markAutoPrint
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
markAutoPrint.url = (options?: RouteQueryOptions) => {
    return markAutoPrint.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AutoPrintController::markAutoPrint
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
markAutoPrint.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAutoPrint.url(options),
    method: 'post',
})
const autoPrint = {
    listAuto: Object.assign(listAuto, listAuto),
markAutoPrint: Object.assign(markAutoPrint, markAutoPrint),
}

export default autoPrint