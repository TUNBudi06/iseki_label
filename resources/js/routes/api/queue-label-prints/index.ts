import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::destroy
 * @see app/Http/Controllers/HomeController.php:57
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
 * @see app/Http/Controllers/HomeController.php:57
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
 * @see app/Http/Controllers/HomeController.php:57
 * @route '/api/queue-label-prints/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HomeController::toggleAutoPrint
 * @see app/Http/Controllers/HomeController.php:98
 * @route '/api/queue-label-prints/{id}/toggle-auto-print'
 */
export const toggleAutoPrint = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAutoPrint.url(args, options),
    method: 'patch',
})

toggleAutoPrint.definition = {
    methods: ["patch"],
    url: '/api/queue-label-prints/{id}/toggle-auto-print',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HomeController::toggleAutoPrint
 * @see app/Http/Controllers/HomeController.php:98
 * @route '/api/queue-label-prints/{id}/toggle-auto-print'
 */
toggleAutoPrint.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleAutoPrint.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::toggleAutoPrint
 * @see app/Http/Controllers/HomeController.php:98
 * @route '/api/queue-label-prints/{id}/toggle-auto-print'
 */
toggleAutoPrint.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAutoPrint.url(args, options),
    method: 'patch',
})
const queueLabelPrints = {
    destroy: Object.assign(destroy, destroy),
toggleAutoPrint: Object.assign(toggleAutoPrint, toggleAutoPrint),
}

export default queueLabelPrints