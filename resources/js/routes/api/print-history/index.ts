import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PrintHistoryController::reprintSingle
 * @see app/Http/Controllers/PrintHistoryController.php:42
 * @route '/api/print-history/reprint/{id}'
 */
export const reprintSingle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reprintSingle.url(args, options),
    method: 'post',
})

reprintSingle.definition = {
    methods: ["post"],
    url: '/api/print-history/reprint/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrintHistoryController::reprintSingle
 * @see app/Http/Controllers/PrintHistoryController.php:42
 * @route '/api/print-history/reprint/{id}'
 */
reprintSingle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reprintSingle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrintHistoryController::reprintSingle
 * @see app/Http/Controllers/PrintHistoryController.php:42
 * @route '/api/print-history/reprint/{id}'
 */
reprintSingle.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reprintSingle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrintHistoryController::reprintMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:67
 * @route '/api/print-history/reprint-multiple'
 */
export const reprintMultiple = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reprintMultiple.url(options),
    method: 'post',
})

reprintMultiple.definition = {
    methods: ["post"],
    url: '/api/print-history/reprint-multiple',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrintHistoryController::reprintMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:67
 * @route '/api/print-history/reprint-multiple'
 */
reprintMultiple.url = (options?: RouteQueryOptions) => {
    return reprintMultiple.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrintHistoryController::reprintMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:67
 * @route '/api/print-history/reprint-multiple'
 */
reprintMultiple.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reprintMultiple.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrintHistoryController::destroy
 * @see app/Http/Controllers/PrintHistoryController.php:109
 * @route '/api/print-history/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/print-history/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrintHistoryController::destroy
 * @see app/Http/Controllers/PrintHistoryController.php:109
 * @route '/api/print-history/{id}'
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
* @see \App\Http\Controllers\PrintHistoryController::destroy
 * @see app/Http/Controllers/PrintHistoryController.php:109
 * @route '/api/print-history/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PrintHistoryController::destroyMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:139
 * @route '/api/print-history'
 */
export const destroyMultiple = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMultiple.url(options),
    method: 'delete',
})

destroyMultiple.definition = {
    methods: ["delete"],
    url: '/api/print-history',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrintHistoryController::destroyMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:139
 * @route '/api/print-history'
 */
destroyMultiple.url = (options?: RouteQueryOptions) => {
    return destroyMultiple.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrintHistoryController::destroyMultiple
 * @see app/Http/Controllers/PrintHistoryController.php:139
 * @route '/api/print-history'
 */
destroyMultiple.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMultiple.url(options),
    method: 'delete',
})
const printHistory = {
    reprintSingle: Object.assign(reprintSingle, reprintSingle),
reprintMultiple: Object.assign(reprintMultiple, reprintMultiple),
destroy: Object.assign(destroy, destroy),
destroyMultiple: Object.assign(destroyMultiple, destroyMultiple),
}

export default printHistory