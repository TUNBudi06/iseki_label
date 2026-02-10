# Demo Pages Documentation

## Overview

This project now includes 2 demo pages showcasing Laravel + Svelte + Inertia.js + Wayfinder integration with shadcn-ui components.

---

## Project Structure

```
resources/
├── css/
│   └── app.css                    # Tailwind CSS styles (imported in Layout)
├── js/
│   ├── Layouts/
│   │   └── DefaultLayout.svelte   # Default layout with navigation
│   ├── Pages/
│   │   ├── Home.svelte            # Home page demo
│   │   └── About.svelte           # About page demo
│   ├── routes/
│   │   └── index.ts               # Generated Wayfinder routes
│   └── app.ts                     # Inertia app entry point

app/Http/Controllers/
├── HomeController.php              # Home page controller
└── AboutController.php             # About page controller

routes/
└── web.php                         # Route definitions
```

---

## Key Features Implemented

### ✅ 1. Default Layout Component

**File:** `resources/js/Layouts/DefaultLayout.svelte`

- **Imports `app.css`** at the top of the component
- Navigation bar with Home and About links
- Uses **Wayfinder route helper** for navigation
- Uses **Inertia Link component** for SPA navigation
- Responsive design with Tailwind CSS
- Footer section
- Children slot for page content

### ✅ 2. Home Page

**File:** `resources/js/Pages/Home.svelte`

**Features:**

- Hero section with dynamic message prop
- Feature cards using **shadcn Card component**
- Call-to-action buttons using **shadcn Button component**
- Route helper demo section showing:
    - `routeUrl()` usage
    - `route()` usage with JSON output
- Uses `about` route from Wayfinder

**Props:**

- `message` (optional): Welcome message text

### ✅ 3. About Page

**File:** `resources/js/Pages/About.svelte`

**Features:**

- Technologies grid with 6 cards
- Each card shows technology name, version, description
- External links to documentation
- Route helper features list
- Code example section with syntax highlighting
- Current route information display
- Uses `home` route from Wayfinder

**Props:**

- `title` (optional): Page title
- `description` (optional): Page description

---

## Route Helper Implementation

### Inertia Route Helper

**Package:** `@tunbudi06/inertia-route-helper`

**Initialization** (`resources/js/app.ts`):

```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
    setup({ el, App, props }) {
        initRouteHelper(props);
        // ...
    },
});
```

**Usage in Components:**

```typescript
import { route, routeUrl } from '@tunbudi06/inertia-route-helper';
import { home, about } from '$routes';

// Get full route object
const homeRoute = route(home());
// { url: 'http://localhost/home', method: 'GET' }

// Get just the URL string
const aboutUrl = routeUrl(about());
// 'http://localhost/about'

// Use in Link component
<Link href={route(home()).url}>Home</Link>
<Link href={routeUrl(about())}>About</Link>
```

### Wayfinder Integration

**Package:** `@laravel/vite-plugin-wayfinder`

**Configuration** (`vite.config.js`):

```javascript
wayfinder({
    command: 'php artisan wayfinder:generate',
    routes: true,
    actions: false,
}),
```

**Generated Routes** (`resources/js/routes/index.ts`):

```typescript
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
});
```

---

## shadcn-ui Components Used

### Button Component

**Import:**

```typescript
import { Button } from '$shadcn/components/ui/button';
```

**Usage:**

```svelte
<Button size="lg">Learn More</Button>
<Button variant="outline" size="lg">View Documentation</Button>
```

### Card Components

**Import:**

```typescript
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '$shadcn/components/ui/card';
```

**Usage:**

```svelte
<Card>
    <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>Content here</CardContent>
    <CardFooter>Footer content</CardFooter>
</Card>
```

---

## Backend Setup

### Controllers

**HomeController.php:**

```php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [
            'message' => 'Welcome to the Home Page!',
        ]);
    }
}
```

**AboutController.php:**

```php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('About', [
            'title' => 'About This Project',
            'description' => 'Learn more about the technologies used in this demo',
        ]);
    }
}
```

### Routes

**web.php:**

```php
use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
```

### Middleware

**HandleInertiaRequests.php:**

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'baseUrl' => rtrim(config('app.url'), '/'),
    ];
}
```

---

## Path Aliases Configuration

**tsconfig.json:**

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "$/*": ["resources/js/*"],
            "$shadcn": ["resources/js/shadcn"],
            "$shadcn/*": ["resources/js/shadcn/*"],
            "$routes": ["resources/js/routes"],
            "$routes/*": ["resources/js/routes/*"],
            "$lib/*": ["resources/js/lib/*"]
        }
    }
}
```

**vite.config.js:**

```javascript
resolve: {
    alias: {
        '$': path.resolve(__dirname, './resources/js'),
        '$shadcn': path.resolve(__dirname, './resources/js/shadcn'),
        '$routes': path.resolve(__dirname, './resources/js/routes'),
        '$lib': path.resolve(__dirname, './resources/js/lib'),
    }
}
```

---

## Running the Application

### 1. Generate Wayfinder Routes

```bash
php artisan wayfinder:generate
```

### 2. Start Vite Dev Server

```bash
npm run dev
# or
bun run dev
```

### 3. Start Laravel Server

```bash
php artisan serve
```

### 4. Access the Application

- **Home Page:** http://localhost:8000/
- **About Page:** http://localhost:8000/about

---

## Development Workflow

### Adding New Routes

1. **Create Controller:**

```bash
php artisan make:controller MyPageController
```

2. **Add Route in `routes/web.php`:**

```php
Route::get('/my-page', [MyPageController::class, 'index'])->name('myPage');
```

3. **Generate Wayfinder Routes:**

```bash
php artisan wayfinder:generate
```

4. **Create Svelte Page:**

```svelte
<!-- resources/js/Pages/MyPage.svelte -->
<script lang="ts">
    import DefaultLayout from '../Layouts/DefaultLayout.svelte';
</script>

<DefaultLayout>
    <h1>My Page</h1>
</DefaultLayout>
```

5. **Use in Components:**

```typescript
import { myPage } from '$routes';
import { routeUrl } from '@tunbudi06/inertia-route-helper';

<Link href={routeUrl(myPage())}>My Page</Link>
```

### Adding shadcn Components

```bash
npx shadcn-svelte@latest add [component-name]
```

Example:

```bash
npx shadcn-svelte@latest add button card input form
```

---

## Technologies Stack

| Technology           | Version | Purpose                         |
| -------------------- | ------- | ------------------------------- |
| Laravel              | 12.x    | Backend framework               |
| PHP                  | 8.2+    | Server-side language            |
| Svelte               | 5.x     | Frontend framework              |
| Inertia.js           | 2.x     | Bridge between Laravel & Svelte |
| Wayfinder            | 0.1.x   | TypeScript route generation     |
| inertia-route-helper | 2.x     | Route URL building              |
| shadcn-svelte        | Latest  | UI component library            |
| Tailwind CSS         | 4.x     | Utility-first CSS framework     |
| Vite                 | 7.x     | Build tool                      |
| TypeScript           | 5.x     | Type safety                     |

---

## Features Demonstrated

### ✅ Inertia.js Features

- Server-side routing
- Props passing from controller to component
- SPA navigation with Link component
- Page components

### ✅ Wayfinder Features

- Type-safe route generation
- Automatic route updates on file change
- Named route support
- HTTP method typing

### ✅ Route Helper Features

- Absolute URL generation with `baseUrl`
- `route()` function for full route objects
- `routeUrl()` function for URL strings
- Works seamlessly with Wayfinder routes

### ✅ Svelte 5 Features

- Runes (`$props`, `$state`)
- Snippet rendering (`{@render children()}`)
- TypeScript support
- Reactive imports

### ✅ shadcn-ui Features

- Button variants (default, outline)
- Card components with sections
- Responsive design
- Dark mode support
- Tailwind CSS integration

### ✅ Layout System

- Shared layout component
- CSS imported once in layout
- Navigation with active states
- Consistent header/footer

---

## Troubleshooting

### Routes Not Found

```bash
# Regenerate Wayfinder routes
php artisan wayfinder:generate

# Clear Laravel cache
php artisan cache:clear
php artisan route:clear
```

### TypeScript Errors for `$routes`

- Restart your IDE/editor
- Restart TypeScript server
- Check `tsconfig.json` includes the routes path

### Styles Not Loading

- Ensure `app.css` is imported in Layout
- Check Vite is running (`npm run dev`)
- Clear browser cache

### 404 Errors

- Ensure Laravel server is running
- Check route names match Wayfinder output
- Verify controller methods exist

---

## Next Steps

### Suggested Enhancements

1. Add authentication with Laravel Breeze/Jetstream
2. Implement forms with validation
3. Add more shadcn components (Dialog, Dropdown, etc.)
4. Create nested layouts
5. Add loading states
6. Implement dark mode toggle
7. Add API routes with Wayfinder actions
8. Create shared components library

---

## Resources

- **Laravel Docs:** https://laravel.com/docs
- **Svelte Docs:** https://svelte.dev/docs
- **Inertia.js Docs:** https://inertiajs.com
- **Wayfinder:** https://github.com/laravel/wayfinder
- **Route Helper:** https://github.com/tunbudi06/inertia-route-helper
- **shadcn-svelte:** https://shadcn-svelte.com
- **Tailwind CSS:** https://tailwindcss.com

---

## Summary

This demo project successfully implements:

✅ **2 Demo Pages** (Home & About)  
✅ **Default Layout** with `app.css` import  
✅ **Inertia Route Helper** integration  
✅ **Wayfinder** TypeScript routes  
✅ **shadcn-ui** components (Button, Card)  
✅ **Type-safe routing** with full IDE support  
✅ **SPA navigation** with Inertia Links  
✅ **Props passing** from Laravel controllers  
✅ **Responsive design** with Tailwind CSS

The application is ready for development and demonstrates best practices for Laravel + Svelte + Inertia.js applications! 🚀
