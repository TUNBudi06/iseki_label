import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::authUser
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
export const authUser = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authUser.url(options),
    method: 'get',
})

authUser.definition = {
    methods: ["get","head"],
    url: '/user/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::authUser
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
authUser.url = (options?: RouteQueryOptions) => {
    return authUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::authUser
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
authUser.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authUser.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::authUser
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
authUser.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: authUser.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::authUserPost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
export const authUserPost = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authUserPost.url(options),
    method: 'post',
})

authUserPost.definition = {
    methods: ["post"],
    url: '/user/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::authUserPost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
authUserPost.url = (options?: RouteQueryOptions) => {
    return authUserPost.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::authUserPost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
authUserPost.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authUserPost.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logoutUser
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
export const logoutUser = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logoutUser.url(options),
    method: 'get',
})

logoutUser.definition = {
    methods: ["get","head"],
    url: '/user/logout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::logoutUser
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logoutUser.url = (options?: RouteQueryOptions) => {
    return logoutUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logoutUser
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logoutUser.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logoutUser.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::logoutUser
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logoutUser.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logoutUser.url(options),
    method: 'head',
})
const AuthController = { authUser, authUserPost, logoutUser }

export default AuthController