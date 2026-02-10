<script lang="ts">
    import DefaultLayout from '../Layouts/DefaultLayout.svelte';
    import { Button } from '$shadcn/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '$shadcn/components/ui/card';
    import { route, routeUrl } from '@tunbudi06/inertia-route-helper';
    import { Link } from '@inertiajs/svelte';
    import { home } from '$routes';
    import Navbar from '$/Layouts/Navbar.svelte';

    interface Props {
        title?: string;
        description?: string;
    }

    let {
        title = 'About This Project',
        description = 'Learn more about the technologies used in this demo',
    }: Props = $props();

    const technologies = [
        {
            name: 'Laravel',
            version: '12.x',
            description:
                'A PHP framework for web artisans with elegant syntax and powerful features.',
            link: 'https://laravel.com',
        },
        {
            name: 'Svelte',
            version: '5.x',
            description:
                'Cybernetically enhanced web apps with runes and modern reactivity.',
            link: 'https://svelte.dev',
        },
        {
            name: 'Inertia.js',
            version: '2.x',
            description:
                'Build single-page apps without building an API. Uses server-side routing.',
            link: 'https://inertiajs.com',
        },
        {
            name: 'Wayfinder',
            version: '0.1.x',
            description:
                'Laravel package that generates TypeScript route helpers for type-safe routing.',
            link: 'https://github.com/laravel/wayfinder',
        },
        {
            name: 'shadcn-svelte',
            version: 'Latest',
            description:
                'Beautiful, accessible UI components built with Radix UI and Tailwind CSS.',
            link: 'https://shadcn-svelte.com',
        },
        {
            name: 'Tailwind CSS',
            version: '4.x',
            description:
                'A utility-first CSS framework for rapidly building custom user interfaces.',
            link: 'https://tailwindcss.com',
        },
    ];

    const routeHelperFeatures = [
        'Absolute URL generation with baseUrl support',
        'Query parameter building',
        'Route validation against current path',
        'TypeScript type safety',
        'Works with Laravel Ziggy and Wayfinder',
        'SSR compatible',
    ];
</script>

<Navbar>
    <div class="space-y-8">
        <!-- Header -->
        <div class="text-center">
            <h1
                class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
                {title}
            </h1>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
                {description}
            </p>
            <div class="mt-6">
                <Link href={routeUrl(home())}>
                    <Button variant="outline">← Back to Home</Button>
                </Link>
            </div>
        </div>

        <!-- Technologies Grid -->
        <div>
            <h2 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                Technologies Used
            </h2>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each technologies as tech}
                    <Card>
                        <CardHeader>
                            <CardTitle>{tech.name}</CardTitle>
                            <CardDescription class="font-mono text-xs">
                                v{tech.version}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p
                                class="text-sm text-slate-600 dark:text-slate-400"
                            >
                                {tech.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <a
                                href={tech.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Visit website →
                            </a>
                        </CardFooter>
                    </Card>
                {/each}
            </div>
        </div>

        <!-- Route Helper Features -->
        <Card>
            <CardHeader>
                <CardTitle>Inertia Route Helper Features</CardTitle>
                <CardDescription>
                    @tunbudi06/inertia-route-helper powers the routing in this
                    demo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul class="space-y-2">
                    {#each routeHelperFeatures as feature}
                        <li class="flex items-start gap-2">
                            <span
                                class="text-green-600 dark:text-green-400 mt-0.5"
                                >✓</span
                            >
                            <span class="text-slate-700 dark:text-slate-300"
                                >{feature}</span
                            >
                        </li>
                    {/each}
                </ul>
            </CardContent>
        </Card>

        <!-- Code Example -->
        <Card>
            <CardHeader>
                <CardTitle>Usage Example</CardTitle>
                <CardDescription>
                    How we're using the route helper in this demo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="rounded-lg bg-slate-900 p-4 font-mono text-sm">
                    <pre class="text-slate-100"><code
                            >{`// Import route helpers
import { route, routeUrl } from '@tunbudi06/inertia-route-helper';
import { home, about } from '$routes';

// Get full route object with absolute URL
const homeRoute = route(home());
// { url: 'http://localhost/home', method: 'GET' }

// Get just the URL string
const aboutUrl = routeUrl(about());
// 'http://localhost/about'

// Use in Link component
<Link href={route(home()).url}>Home</Link>
<Link href={routeUrl(about())}>About</Link>`}</code
                        ></pre>
                </div>
            </CardContent>
        </Card>

        <!-- Current Route Info -->
        <Card>
            <CardHeader>
                <CardTitle>Current Route Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="space-y-2 font-mono text-sm">
                    <div class="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                        <p class="text-slate-600 dark:text-slate-400">
                            Current Page:
                        </p>
                        <p class="font-semibold text-slate-900 dark:text-white">
                            About
                        </p>
                    </div>
                    <div class="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                        <p class="text-slate-600 dark:text-slate-400">
                            Home URL (generated):
                        </p>
                        <p class="font-semibold text-slate-900 dark:text-white">
                            {routeUrl(home())}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</Navbar>
