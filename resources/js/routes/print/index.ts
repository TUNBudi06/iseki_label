import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:16
 * @route '/home/print-history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/home/print-history',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:16
 * @route '/home/print-history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:16
 * @route '/home/print-history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:16
 * @route '/home/print-history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PagePrintController::label
 * @see app/Http/Controllers/PagePrintController.php:11
 * @route '/home/print-label'
 */
export const label = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: label.url(options),
    method: 'get',
})

label.definition = {
    methods: ["get","head"],
    url: '/home/print-label',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagePrintController::label
 * @see app/Http/Controllers/PagePrintController.php:11
 * @route '/home/print-label'
 */
label.url = (options?: RouteQueryOptions) => {
    return label.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagePrintController::label
 * @see app/Http/Controllers/PagePrintController.php:11
 * @route '/home/print-label'
 */
label.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: label.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagePrintController::label
 * @see app/Http/Controllers/PagePrintController.php:11
 * @route '/home/print-label'
 */
label.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: label.url(options),
    method: 'head',
})
const print = {
    history: Object.assign(history, history),
label: Object.assign(label, label),
}

export default print