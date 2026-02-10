import { createInertiaApp, type ResolvedComponent } from '@inertiajs/svelte';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
import { hydrate, mount } from 'svelte';
import './bootstrap';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<ResolvedComponent>(
            './Pages/**/*.svelte',
        );
        return pages[`./Pages/${name}.svelte`]();
    },
    setup({ el, App, props }) {
        console.log('Inertia props:', props);
        initRouteHelper(props);
        if (el && el.dataset.serverRendered === 'true') {
            hydrate(App, { target: el, props });
        } else if (el) {
            mount(App, { target: el, props });
        }
    },
});
