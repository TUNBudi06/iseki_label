import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LoggerPerubahanController::index
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/logger-perubahan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoggerPerubahanController::index
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoggerPerubahanController::index
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoggerPerubahanController::index
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LoggerPerubahanController::destroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/logger-perubahan/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LoggerPerubahanController::destroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
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
* @see \App\Http\Controllers\LoggerPerubahanController::destroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const LoggerPerubahanController = { index, destroy }

export default LoggerPerubahanController