import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:9
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
 * @see app/Http/Controllers/RackController.php:9
 * @route '/api/rack/table-fetching'
 */
dataFetching.url = (options?: RouteQueryOptions) => {
    return dataFetching.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:9
 * @route '/api/rack/table-fetching'
 */
dataFetching.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataFetching.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackController::dataFetching
 * @see app/Http/Controllers/RackController.php:9
 * @route '/api/rack/table-fetching'
 */
dataFetching.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dataFetching.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackController::getSingle
 * @see app/Http/Controllers/RackController.php:37
 * @route '/api/rack/single/{id}'
 */
export const getSingle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSingle.url(args, options),
    method: 'get',
})

getSingle.definition = {
    methods: ["get","head"],
    url: '/api/rack/single/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackController::getSingle
 * @see app/Http/Controllers/RackController.php:37
 * @route '/api/rack/single/{id}'
 */
getSingle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getSingle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackController::getSingle
 * @see app/Http/Controllers/RackController.php:37
 * @route '/api/rack/single/{id}'
 */
getSingle.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSingle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackController::getSingle
 * @see app/Http/Controllers/RackController.php:37
 * @route '/api/rack/single/{id}'
 */
getSingle.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSingle.url(args, options),
    method: 'head',
})
const rack = {
    dataFetching: Object.assign(dataFetching, dataFetching),
getSingle: Object.assign(getSingle, getSingle),
}

export default rack