<script>
    import { isCurrentRoute, routeUrl } from '@tunbudi06/inertia-route-helper';
    import { Link } from '@inertiajs/svelte';
    import { home, about } from '$routes';
    import DefaultLayout from '$/Layouts/DefaultLayout.svelte';
    import {login} from "$routes/user/index.ts";

    let { children = null,user } = $props();
</script>

{#snippet NavMenu(href, label)}
    <Link
        {href}
        class="rounded-lg px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-white data-[active=true]:bg-pink-400 dark:hover:bg-slate-800"
        data-active={isCurrentRoute(href, true, false)}
    >
        {label}
    </Link>
{/snippet}

<DefaultLayout>
    <div class="min-h-screen bg-linear-to-br">
        <!-- Navigation -->
        <nav
            class="border-b sticky top-0 border-slate-200 bg-pink-400/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 z-100"
        >
            <div class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div>
                        <h1
                            class="text-xl font-bold tracking-tighter text-slate-900 dark:text-white"
                        >
                            ISEKI LABEL
                        </h1>
                    </div>

                    {#if !user}
                    <div class="flex gap-4">
                        {@render NavMenu(routeUrl(home()), 'Home')}
                            {@render NavMenu(routeUrl(login()), 'Login')}
                        <!--{@render NavMenu(routeUrl(about()), 'About')}-->
                    </div>
                    {:else}
                        <div class="flex gap-4">
                            {@render NavMenu(routeUrl(home()), 'Home')}
                            <!--{@render NavMenu(routeUrl(about()), 'About')}-->
                        </div>
                        <div class="flex gap-4">
                            <!--{@render NavMenu(routeUrl(login()), 'Logout')}-->
                        </div>
                    {/if}
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="mx-auto max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
            {@render children?.()}
        </main>

        <!-- Footer -->
        <footer
            class="mt-auto border-t border-slate-200 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
            <div class="mx-auto max-w-9xl px-4 py-6 sm:px-6 lg:px-8">
                <p
                    class="text-center text-sm text-slate-600 dark:text-slate-400"
                >
                    © 2026 ISEKI LABEL. Built with Laravel, Inertia & Svelte.
                </p>
            </div>
        </footer>
    </div>
</DefaultLayout>
