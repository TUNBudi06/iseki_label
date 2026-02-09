import { createInertiaApp, type ResolvedComponent } from '@inertiajs/svelte';
import createServer from '@inertiajs/svelte/server';
import { render } from 'svelte/server'
import {initRouteHelper} from "@tunbudi06/inertia-route-helper/init";

createServer(page =>
    createInertiaApp({
        page,
        resolve: (name: string) => {
            const pages = import.meta.glob<ResolvedComponent>('./Pages/**/*.svelte');
            return pages[`./Pages/${name}.svelte`]();
        },
        setup({ App, props }) {
            initRouteHelper(props);
            return render(App, { props })
        },
    }),
)
