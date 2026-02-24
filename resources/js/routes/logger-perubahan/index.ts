import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LoggerPerubahanController::logIndex
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
export const logIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logIndex.url(options),
    method: 'get',
})

logIndex.definition = {
    methods: ["get","head"],
    url: '/logger-perubahan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoggerPerubahanController::logIndex
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
logIndex.url = (options?: RouteQueryOptions) => {
    return logIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoggerPerubahanController::logIndex
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
logIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoggerPerubahanController::logIndex
 * @see app/Http/Controllers/LoggerPerubahanController.php:11
 * @route '/logger-perubahan'
 */
logIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LoggerPerubahanController::logDestroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
 */
export const logDestroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: logDestroy.url(args, options),
    method: 'delete',
})

logDestroy.definition = {
    methods: ["delete"],
    url: '/logger-perubahan/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LoggerPerubahanController::logDestroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
 */
logDestroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return logDestroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoggerPerubahanController::logDestroy
 * @see app/Http/Controllers/LoggerPerubahanController.php:37
 * @route '/logger-perubahan/{id}'
 */
logDestroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: logDestroy.url(args, options),
    method: 'delete',
})
const loggerPerubahan = {
    logIndex: Object.assign(logIndex, logIndex),
logDestroy: Object.assign(logDestroy, logDestroy),
}

export default loggerPerubahan