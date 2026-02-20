import {
    queryParams,
    type RouteDefinition,
    type RouteQueryOptions,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
export const listAuto = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: listAuto.url(options),
    method: 'get',
});

listAuto.definition = {
    methods: ['get', 'head'],
    url: '/api/auto-print/list',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.url = (options?: RouteQueryOptions) => {
    return listAuto.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAuto.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\AutoPrintController::listAuto
 * @see app/Http/Controllers/AutoPrintController.php:17
 * @route '/api/auto-print/list'
 */
listAuto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listAuto.url(options),
    method: 'head',
});
const autoPrint = {
    listAuto: Object.assign(listAuto, listAuto),
};

export default autoPrint;
