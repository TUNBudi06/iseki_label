# 🚀 Laravel + Svelte 5 + Inertia.js Starter

A modern, full-stack web application starter template featuring Laravel 12, Svelte 5, and Inertia.js with TypeScript, Tailwind CSS 4, and shadcn-svelte components.

## ✨ Features

### Core Stack
- **[Laravel 12](https://laravel.com)** - Modern PHP framework with elegant syntax
- **[Svelte 5](https://svelte.dev)** - Reactive component framework with runes
- **[Inertia.js](https://inertiajs.com)** - Monolithic SPA without API complexity
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool

### Developer Experience
- **[Laravel Wayfinder](https://github.com/laravel/wayfinder)** - Type-safe routing with auto-generated TypeScript routes
- **[shadcn-svelte](https://www.shadcn-svelte.com/)** - Beautiful, accessible UI components (bits-ui)
- **[Laravel Pint](https://laravel.com/docs/pint)** - Opinionated PHP code style fixer
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - JavaScript/TypeScript linting and formatting
- **[Pest PHP](https://pestphp.com/)** - Elegant testing framework
- **[Laravel Sail](https://laravel.com/docs/sail)** - Docker development environment
- **[Laravel Boost](https://boost.laravel.com/)** - Enhanced AI development experience

### UI/UX Features
- **Dark Mode Support** - Built-in dark mode with `mode-watcher`
- **Responsive Design** - Mobile-first design approach
- **Icon Library** - Lucide icons integration
- **Toast Notifications** - Svelte Sonner for elegant notifications
- **Optimized Builds** - Vendor code splitting for optimal performance

## 📋 Requirements

- **PHP** 8.2 or higher
- **Composer** 2.x
- **Node.js** 18.x or higher (Bun is also supported)
- **MySQL** 8.0 or higher (or other supported databases)

## 🎯 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url> my-project
cd my-project

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
# or
bun install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate
```

### 2. Configure Environment

Edit your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Start Development Servers

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
# or
bun run dev
```

Visit [http://localhost:8000](http://localhost:8000) to see your application!

## 📦 Project Structure

```
├── app/
│   ├── Http/Controllers/          # Laravel controllers
│   ├── Models/                    # Eloquent models
│   └── Providers/                 # Service providers
├── resources/
│   ├── css/
│   │   └── app.css               # Global styles & Tailwind imports
│   ├── js/
│   │   ├── app.ts                # Application entry point
│   │   ├── Layouts/              # Svelte layout components
│   │   ├── Pages/                # Svelte page components
│   │   ├── routes/               # Auto-generated TypeScript routes
│   │   ├── shadcn/               # shadcn-svelte components
│   │   └── lib/                  # Utility functions
│   └── views/
│       └── app.blade.php         # Root HTML template
├── routes/
│   └── web.php                   # Application routes
└── tests/
    ├── Feature/                   # Feature tests
    └── Unit/                      # Unit tests
```

## 🛠️ Available Commands

### Development
```bash
npm run dev              # Start Vite dev server
php artisan serve        # Start Laravel dev server
```

### Building
```bash
npm run build           # Build for production (client + SSR)
```

### Code Quality
```bash
# PHP
./vendor/bin/pint       # Fix PHP code style
./vendor/bin/pest       # Run tests

# JavaScript/TypeScript
npm run lint            # Lint code
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting
```

### Type Checking
```bash
npx svelte-check        # Check Svelte component types
```

## 🎨 Creating Pages

### 1. Create a Controller

```php
// app/Http/Controllers/ExampleController.php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ExampleController extends Controller
{
    public function index()
    {
        return Inertia::render('Example', [
            'message' => 'Hello from Laravel!'
        ]);
    }
}
```

### 2. Add a Route

```php
// routes/web.php
use App\Http\Controllers\ExampleController;

Route::get('/example', [ExampleController::class, 'index'])->name('example');
```

### 3. Create a Svelte Page

```svelte
<!-- resources/js/Pages/Example.svelte -->
<script lang="ts">
    import DefaultLayout from '@/Layouts/DefaultLayout.svelte';
    
    interface Props {
        message: string;
    }
    
    let { message }: Props = $props();
</script>

<DefaultLayout>
    <h1>{message}</h1>
</DefaultLayout>
```

### 4. Use Type-Safe Routes

```svelte
<script>
    import { Link } from '@inertiajs/svelte';
    import { route } from '@tunbudi06/inertia-route-helper';
    import { example } from '$routes';
</script>

<Link href={route(example()).url}>Go to Example</Link>
```

## 🧩 UI Components

This starter includes shadcn-svelte components. To add more components:

```bash
npx shadcn-svelte@latest add button
npx shadcn-svelte@latest add card
npx shadcn-svelte@latest add dialog
```

Components will be added to `resources/js/shadcn/components/`.

## 🌐 Routing

This project uses Laravel Wayfinder for type-safe routing:

```typescript
// Auto-generated routes are available in resources/js/routes/
import { home, about } from '$routes';
import { route } from '@tunbudi06/inertia-route-helper';

// Use in components
const homeUrl = route(home()).url;
const aboutUrl = route(about()).url;
```

To regenerate routes after adding new Laravel routes:

```bash
php artisan wayfinder:generate
```

## 🧪 Testing

```bash
# Run all tests
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/ExampleTest.php

# Run with coverage
./vendor/bin/pest --coverage
```

## 🚢 Deployment

### Build for Production

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Setup

Ensure your production `.env` has:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

## 🔧 Configuration

### Vite Base Path

Update `vite.config.js` if deploying to a subdirectory:

```javascript
export default defineConfig({
    base: '/your-subdirectory/public/build',
    // ...
});
```

### TypeScript Paths

Path aliases are configured in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./resources/js/*"],
            "$routes": ["./resources/js/routes"]
        }
    }
}
```

## 📚 Learn More

### Official Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [Svelte 5 Documentation](https://svelte.dev/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Video Tutorials
- [Laracasts](https://laracasts.com) - Laravel & PHP screencasts
- [Svelte Tutorial](https://learn.svelte.dev) - Interactive Svelte tutorial

## 🐛 Troubleshooting

### Common Issues

**Vite not connecting in development:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**TypeScript errors with routes:**
```bash
# Regenerate Wayfinder routes
php artisan wayfinder:generate
```

**Styles not loading:**
```bash
# Rebuild assets
npm run build
```

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Credits

Built with amazing open-source technologies:
- [Laravel](https://laravel.com)
- [Svelte](https://svelte.dev)
- [Inertia.js](https://inertiajs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn-svelte](https://www.shadcn-svelte.com/)

---

Made with ❤️ using Laravel, Svelte, and Inertia.js
