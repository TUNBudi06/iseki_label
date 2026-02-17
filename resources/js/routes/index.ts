import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/home'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/home',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/home'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/home'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/home'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AboutController::about
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/home/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AboutController::about
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AboutController::about
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AboutController::about
 * @see app/Http/Controllers/AboutController.php:13
 * @route '/home/about'
 */
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})