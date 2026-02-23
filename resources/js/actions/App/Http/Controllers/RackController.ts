import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:20
 * @route '/api/rack/table-fetching'
 */
export const dataFetching = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataFetching.url(options),
    method: 'get',
})

dataFetching.definition = {
    methods: ["get","head"],
    url: '/api/rack/table-fetching',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:20
 * @route '/api/rack/table-fetching'
 */
dataFetching.url = (options?: RouteQueryOptions) => {
    return dataFetching.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:20
 * @route '/api/rack/table-fetching'
 */
dataFetching.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataFetching.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:20
 * @route '/api/rack/table-fetching'
 */
dataFetching.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dataFetching.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackController::getSingleRack
 * @see app/Http/Controllers/RackController.php:46
 * @route '/api/rack/single/{id}'
 */
export const getSingleRack = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSingleRack.url(args, options),
    method: 'get',
})

getSingleRack.definition = {
    methods: ["get","head"],
    url: '/api/rack/single/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackController::getSingleRack
 * @see app/Http/Controllers/RackController.php:46
 * @route '/api/rack/single/{id}'
 */
getSingleRack.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getSingleRack.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackController::getSingleRack
 * @see app/Http/Controllers/RackController.php:46
 * @route '/api/rack/single/{id}'
 */
getSingleRack.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSingleRack.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackController::getSingleRack
 * @see app/Http/Controllers/RackController.php:46
 * @route '/api/rack/single/{id}'
 */
getSingleRack.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSingleRack.url(args, options),
    method: 'head',
})
const RackController = { dataFetching, getSingleRack }

export default RackController