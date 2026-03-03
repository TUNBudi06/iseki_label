import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::index
 * @see app/Http/Controllers/RackPartListController.php:16
 * @route '/rack'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/rack/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::exportMethod
 * @see app/Http/Controllers/RackPartListController.php:30
 * @route '/rack/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/rack/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::importMethod
 * @see app/Http/Controllers/RackPartListController.php:38
 * @route '/rack/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/rack/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RackPartListController::template
 * @see app/Http/Controllers/RackPartListController.php:93
 * @route '/rack/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RackPartListController::store
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/rack/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::store
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::store
 * @see app/Http/Controllers/RackPartListController.php:116
 * @route '/rack/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::update
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/rack/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RackPartListController::update
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RackPartListController::update
 * @see app/Http/Controllers/RackPartListController.php:135
 * @route '/rack/update/{id}'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RackPartListController::destroy
 * @see app/Http/Controllers/RackPartListController.php:166
 * @route '/rack/delete/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/rack/delete/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RackPartListController::destroy
 * @see app/Http/Controllers/RackPartListController.php:166
 * @route '/rack/delete/{id}'
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
* @see \App\Http\Controllers\RackPartListController::destroy
 * @see app/Http/Controllers/RackPartListController.php:166
 * @route '/rack/delete/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const RackPartListController = { index, exportMethod, importMethod, template, store, update, destroy, export: exportMethod, import: importMethod }

export default RackPartListController