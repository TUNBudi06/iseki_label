import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:14
 * @route '/multi-page'
 */
export const example = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: example.url(options),
    method: 'get',
})

example.definition = {
    methods: ["get","head"],
    url: '/multi-page',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:14
 * @route '/multi-page'
 */
example.url = (options?: RouteQueryOptions) => {
    return example.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:14
 * @route '/multi-page'
 */
example.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: example.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:14
 * @route '/multi-page'
 */
example.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: example.url(options),
    method: 'head',
})
const multipage = {
    example: Object.assign(example, example),
}

export default multipage