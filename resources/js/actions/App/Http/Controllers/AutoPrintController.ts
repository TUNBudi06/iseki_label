import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AutoPrintController::getAutoPrintList
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
export const getAutoPrintList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAutoPrintList.url(options),
    method: 'get',
})

getAutoPrintList.definition = {
    methods: ["get","head"],
    url: '/api/auto-print/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AutoPrintController::getAutoPrintList
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
getAutoPrintList.url = (options?: RouteQueryOptions) => {
    return getAutoPrintList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AutoPrintController::getAutoPrintList
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
getAutoPrintList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAutoPrintList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AutoPrintController::getAutoPrintList
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
getAutoPrintList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAutoPrintList.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AutoPrintController::markAsPrinted
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
export const markAsPrinted = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
})

markAsPrinted.definition = {
    methods: ["post"],
    url: '/api/auto-print/mark-as-printed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AutoPrintController::markAsPrinted
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
markAsPrinted.url = (options?: RouteQueryOptions) => {
    return markAsPrinted.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AutoPrintController::markAsPrinted
 * @see app/Http/Controllers/AutoPrintController.php:29
 * @route '/api/auto-print/mark-as-printed'
 */
markAsPrinted.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AutoPrintController::index
 * @see app/Http/Controllers/AutoPrintController.php:11
 * @route '/home/print/automation'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/home/print/automation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AutoPrintController::index
 * @see app/Http/Controllers/AutoPrintController.php:11
 * @route '/home/print/automation'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AutoPrintController::index
 * @see app/Http/Controllers/AutoPrintController.php:11
 * @route '/home/print/automation'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AutoPrintController::index
 * @see app/Http/Controllers/AutoPrintController.php:11
 * @route '/home/print/automation'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const AutoPrintController = { getAutoPrintList, markAsPrinted, index }

export default AutoPrintController