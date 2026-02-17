import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::destroy
 * @see app/Http/Controllers/HomeController.php:54
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
 * @see app/Http/Controllers/HomeController.php:54
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
 * @see app/Http/Controllers/HomeController.php:54
 * @route '/api/queue-label-prints/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const queueLabelPrints = {
    destroy: Object.assign(destroy, destroy),
}

export default queueLabelPrints