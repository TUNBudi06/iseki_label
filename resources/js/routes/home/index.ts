import {
    queryParams,
    type RouteDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
export const markAsPrinted = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
});

markAsPrinted.definition = {
    methods: ['post'],
    url: '/home/mark-as-printed',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
markAsPrinted.url = (options?: RouteQueryOptions) => {
    return markAsPrinted.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\HomeController::markAsPrinted
 * @see app/Http/Controllers/HomeController.php:75
 * @route '/home/mark-as-printed'
 */
markAsPrinted.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markAsPrinted.url(options),
    method: 'post',
});
const home = {
    markAsPrinted: Object.assign(markAsPrinted, markAsPrinted),
};

export default home;
