import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::destroy
 * @see app/Http/Controllers/HomeController.php:56
 * @route '/api/queue-label-prints/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/queue-label-prints/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HomeController::destroy
 * @see app/Http/Controllers/HomeController.php:56
 * @route '/api/queue-label-prints/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::destroy
 * @see app/Http/Controllers/HomeController.php:56
 * @route '/api/queue-label-prints/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HomeController::index
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/home'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/home',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HomeController::index
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/home'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::index
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/home'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HomeController::index
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/home'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
export const markAsPrinted = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
})

markAsPrinted.definition = {
    methods: ["post"],
    url: '/home/mark-as-printed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
markAsPrinted.url = (options?: RouteQueryOptions) => {
    return markAsPrinted.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
markAsPrinted.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
})
const HomeController = { destroy, index, markAsPrinted }

export default HomeController