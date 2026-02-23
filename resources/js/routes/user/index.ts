import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/user/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:12
 * @route '/user/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::loginpost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
export const loginpost = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loginpost.url(options),
    method: 'post',
})

loginpost.definition = {
    methods: ["post"],
    url: '/user/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::loginpost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
loginpost.url = (options?: RouteQueryOptions) => {
    return loginpost.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::loginpost
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/user/login'
 */
loginpost.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loginpost.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logout.url(options),
    method: 'get',
})

logout.definition = {
    methods: ["get","head"],
    url: '/user/logout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:41
 * @route '/user/logout'
 */
logout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logout.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::manage
 * @see app/Http/Controllers/UserController.php:11
 * @route '/user/list'
 */
export const manage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(options),
    method: 'get',
})

manage.definition = {
    methods: ["get","head"],
    url: '/user/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::manage
 * @see app/Http/Controllers/UserController.php:11
 * @route '/user/list'
 */
manage.url = (options?: RouteQueryOptions) => {
    return manage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::manage
 * @see app/Http/Controllers/UserController.php:11
 * @route '/user/list'
 */
manage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::manage
 * @see app/Http/Controllers/UserController.php:11
 * @route '/user/list'
 */
manage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::userStore
 * @see app/Http/Controllers/UserController.php:22
 * @route '/user/list/store'
 */
export const userStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userStore.url(options),
    method: 'post',
})

userStore.definition = {
    methods: ["post"],
    url: '/user/list/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::userStore
 * @see app/Http/Controllers/UserController.php:22
 * @route '/user/list/store'
 */
userStore.url = (options?: RouteQueryOptions) => {
    return userStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::userStore
 * @see app/Http/Controllers/UserController.php:22
 * @route '/user/list/store'
 */
userStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::userUpdate
 * @see app/Http/Controllers/UserController.php:41
 * @route '/user/list/update'
 */
export const userUpdate = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: userUpdate.url(options),
    method: 'put',
})

userUpdate.definition = {
    methods: ["put"],
    url: '/user/list/update',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserController::userUpdate
 * @see app/Http/Controllers/UserController.php:41
 * @route '/user/list/update'
 */
userUpdate.url = (options?: RouteQueryOptions) => {
    return userUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::userUpdate
 * @see app/Http/Controllers/UserController.php:41
 * @route '/user/list/update'
 */
userUpdate.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: userUpdate.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserController::userDestroy
 * @see app/Http/Controllers/UserController.php:69
 * @route '/user/list/delete'
 */
export const userDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userDestroy.url(options),
    method: 'post',
})

userDestroy.definition = {
    methods: ["post"],
    url: '/user/list/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::userDestroy
 * @see app/Http/Controllers/UserController.php:69
 * @route '/user/list/delete'
 */
userDestroy.url = (options?: RouteQueryOptions) => {
    return userDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::userDestroy
 * @see app/Http/Controllers/UserController.php:69
 * @route '/user/list/delete'
 */
userDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: userDestroy.url(options),
    method: 'post',
})
const user = {
    login: Object.assign(login, login),
loginpost: Object.assign(loginpost, loginpost),
logout: Object.assign(logout, logout),
manage: Object.assign(manage, manage),
userStore: Object.assign(userStore, userStore),
userUpdate: Object.assign(userUpdate, userUpdate),
userDestroy: Object.assign(userDestroy, userDestroy),
}

export default user