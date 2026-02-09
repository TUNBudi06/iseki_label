<script>
    import '../../css/app.css';
    import { Link } from '@inertiajs/svelte';
    import {routeUrl,isCurrentRoute} from '@tunbudi06/inertia-route-helper';
    import { home, about } from '$routes';

    let { children } = $props();
</script>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Navigation -->
    <nav class="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center gap-8">
                    <h1 class="text-xl font-bold text-slate-900 dark:text-white">
                        Demo App
                    </h1>

                    <div class="flex gap-4">
                        <Link
                            href={routeUrl(home())}
                            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-white data-[active=true]:bg-slate-300 dark:hover:bg-slate-800"
                            data-active={isCurrentRoute(home().url)}
                        >
                            Home
                        </Link>
                        <Link
                            href={routeUrl(about())}
                            class="rounded-lg data-[active=true]:bg-slate-e00 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                            data-active={isCurrentRoute(about().url)}
                        >
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p class="text-center text-sm text-slate-600 dark:text-slate-400">
                © 2024 Demo App. Built with Laravel, Inertia & Svelte.
            </p>
        </div>
    </footer>
</div>

