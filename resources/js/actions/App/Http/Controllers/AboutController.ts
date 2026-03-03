import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/home/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const AboutController = { index }

export default AboutController