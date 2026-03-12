<script>
    import { isCurrentRoute, routeUrl } from '@tunbudi06/inertia-route-helper';
    import { Link } from '@inertiajs/svelte';
    import { home, about } from '$routes';
    import DefaultLayout from '$/Layouts/DefaultLayout.svelte';
    import { login, logout, manage } from '$routes/user/index.ts';
    import { page } from '@inertiajs/svelte';
    import {
        Tag,
        Home,
        LogIn,
        User,
        Info,
        LogOut,
        SquareLibrary,
        FileClock,
        ClipboardList,
        Menu,
        X,
    } from '@lucide/svelte';
    import { rackIndex } from '$routes/rack/index.ts';
    import { logIndex } from '$routes/logger-perubahan/index.ts';
    import { index as importLabelIndex } from '$routes/import-label/index.ts';

    let { children = null } = $props();

    let mobileMenuOpen = $state(false);

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

{#snippet NavMenu(href, label, Icon, mobile = false)}
    <Link
        {href}
        onclick={closeMobileMenu}
        class="{mobile
            ? 'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-900 transition-colors hover:bg-pink-50 dark:text-white dark:hover:bg-slate-800'
            : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'} data-[active=true]:bg-pink-400"
        data-active={isCurrentRoute(href, true, false)}
    >
        {#if Icon}
            <Icon class="{mobile ? 'size-5' : 'size-4'} opacity-80" aria-hidden="true" title={label} />
        {/if}
        <span>{label}</span>
    </Link>
{/snippet}

<DefaultLayout>
    <div class="min-h-screen bg-linear-to-br">
        <!-- Navigation -->
        <nav
            class="sticky top-0 z-50 border-b border-slate-200 bg-pink-400/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
            <div class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <!-- Logo -->
                    <h1
                        class="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900 dark:text-white"
                    >
                        <Tag class="h-6 w-6 text-pink-600" />
                        <span>ISEKI LABEL</span>
                    </h1>

                    <!-- Desktop nav -->
                    <div class="hidden items-center gap-1 md:flex">
                        {#if !$page.props.user}
                            {@render NavMenu(routeUrl(home()), 'Home', Home)}
                            {@render NavMenu(routeUrl(importLabelIndex()), 'Request Label', ClipboardList)}
                            {@render NavMenu(routeUrl(login()), 'Login', LogIn)}
                        {:else}
                            {#if $page.props.user.role === 'admin'}
                                {@render NavMenu(routeUrl(manage()), 'User', User)}
                            {/if}
                            {@render NavMenu(routeUrl(home()), 'Home', Home)}
                            {@render NavMenu(routeUrl(rackIndex()), 'Rack List', SquareLibrary)}
                            {@render NavMenu(routeUrl(logIndex()), 'Logs', FileClock)}
                            {@render NavMenu(routeUrl(importLabelIndex()), 'Request Label', ClipboardList)}
                            <div class="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
                            {@render NavMenu(routeUrl(logout()), 'Logout', LogOut)}
                        {/if}
                    </div>

                    <!-- Mobile hamburger -->
                    <button
                        type="button"
                        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                        class="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-pink-100 focus:outline-none md:hidden dark:text-white"
                        aria-label="Toggle menu"
                    >
                        {#if mobileMenuOpen}
                            <X class="size-6" />
                        {:else}
                            <Menu class="size-6" />
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Mobile menu dropdown -->
            {#if mobileMenuOpen}
                <div
                    class="border-t border-slate-200 bg-white/95 backdrop-blur-sm md:hidden dark:border-slate-700 dark:bg-slate-900/95"
                >
                    <div class="space-y-1 px-4 py-3">
                        {#if !$page.props.user}
                            {@render NavMenu(routeUrl(home()), 'Home', Home, true)}
                            {@render NavMenu(routeUrl(rackIndex()), 'Rack List', SquareLibrary, true)}
                            {@render NavMenu(routeUrl(login()), 'Login', LogIn, true)}
                        {:else}
                            {#if $page.props.user.role === 'admin'}
                                {@render NavMenu(routeUrl(manage()), 'User', User, true)}
                            {/if}
                            {@render NavMenu(routeUrl(home()), 'Home', Home, true)}
                            {@render NavMenu(routeUrl(rackIndex()), 'Rack List', SquareLibrary, true)}
                            {@render NavMenu(routeUrl(logIndex()), 'Logs', FileClock, true)}
                            {@render NavMenu(routeUrl(importLabelIndex()), 'Request Label', ClipboardList, true)}
                            <div class="my-2 border-t border-slate-200 dark:border-slate-700"></div>
                            {@render NavMenu(routeUrl(logout()), 'Logout', LogOut, true)}
                        {/if}
                    </div>
                </div>
            {/if}
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
                <p class="text-center text-sm text-slate-600 dark:text-slate-400">
                    © 2026 ISEKI LABEL. Built with Laravel, Inertia & Svelte.
                </p>
            </div>
        </footer>
    </div>
</DefaultLayout>
