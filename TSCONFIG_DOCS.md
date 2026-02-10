# TypeScript Configuration Documentation

## Overview

This project uses two TypeScript configuration files:

- `tsconfig.json` - Main TypeScript compiler configuration
- `tsconfig.eslint.json` - ESLint-specific TypeScript configuration

---

## `tsconfig.json` - Main TypeScript Configuration

### Purpose

The main TypeScript configuration file used by:

- TypeScript compiler (`tsc`)
- IDEs (VS Code, JetBrains, etc.) for IntelliSense
- Vite for building and type-checking
- Svelte Language Server for `.svelte` files

### Configuration

```json
{
    "extends": "@tsconfig/svelte/tsconfig.json",
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "lib": ["DOM", "ES2022"],
        "types": ["svelte", "vite/client"],
        "allowJs": true,
        "checkJs": false,
        "isolatedModules": true,
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "noEmit": true,
        "jsx": "preserve",
        "baseUrl": ".",
        "paths": {
            "$/*": ["resources/js/*"],
            "$shadcn": ["resources/js/shadcn"],
            "$shadcn/*": ["resources/js/shadcn/*"],
            "$routes": ["resources/js/routes"],
            "$routes/*": ["resources/js/routes/*"],
            "$lib/*": ["resources/js/lib/*"]
        }
    },
    "include": [
        "resources/js/**/*.ts",
        "resources/js/**/*.js",
        "resources/js/**/*.svelte",
        "resources/js"
    ],
    "exclude": ["node_modules", "public", "storage"]
}
```

### Key Settings Explained

#### Compiler Options

| Option                       | Value                            | Purpose                                         |
| ---------------------------- | -------------------------------- | ----------------------------------------------- |
| `extends`                    | `@tsconfig/svelte/tsconfig.json` | Inherits base Svelte TypeScript settings        |
| `target`                     | `ES2022`                         | Compiles to ES2022 JavaScript (modern syntax)   |
| `module`                     | `ESNext`                         | Uses latest ECMAScript module system            |
| `moduleResolution`           | `bundler`                        | Module resolution for bundlers (Vite)           |
| `allowImportingTsExtensions` | `true`                           | Allows importing `.ts` files explicitly         |
| `lib`                        | `["DOM", "ES2022"]`              | Includes DOM and ES2022 type definitions        |
| `types`                      | `["svelte", "vite/client"]`      | Type definitions for Svelte and Vite            |
| `allowJs`                    | `true`                           | Allows JavaScript files in the project          |
| `checkJs`                    | `false`                          | Doesn't type-check JavaScript files             |
| `isolatedModules`            | `true`                           | Each file must be independently transpilable    |
| `resolveJsonModule`          | `true`                           | Allows importing `.json` files                  |
| `esModuleInterop`            | `true`                           | Better CommonJS/ES Module interop               |
| `skipLibCheck`               | `true`                           | Skips type-checking of declaration files        |
| `noEmit`                     | `true`                           | Doesn't emit compiled files (Vite handles this) |
| `jsx`                        | `preserve`                       | Preserves JSX for Vite to transform             |

#### Path Aliases

Custom path mappings for cleaner imports:

```typescript
// Instead of:
import Button from '../../../shadcn/components/ui/button';

// You can write:
import Button from '$shadcn/components/ui/button';
```

| Alias       | Maps To                 | Usage               |
| ----------- | ----------------------- | ------------------- |
| `$/*`       | `resources/js/*`        | General JS/TS files |
| `$shadcn`   | `resources/js/shadcn`   | shadcn components   |
| `$shadcn/*` | `resources/js/shadcn/*` | shadcn subpaths     |
| `$routes`   | `resources/js/routes`   | Wayfinder routes    |
| `$routes/*` | `resources/js/routes/*` | Route subpaths      |
| `$lib/*`    | `resources/js/lib/*`    | Utility libraries   |

#### Include/Exclude

- **Include**: All TypeScript, JavaScript, and Svelte files in `resources/js/`
- **Exclude**: `node_modules`, `public`, `storage` (not part of source code)

---

## `tsconfig.eslint.json` - ESLint Configuration

### Purpose

Extended TypeScript configuration specifically for ESLint to:

- Lint configuration files (`.js`, `.cjs`, `.mjs`)
- Lint files outside the main `include` pattern
- Apply consistent linting rules across all project files

### Configuration

```json
{
    "extends": "./tsconfig.json",
    "include": [
        "resources/js/**/*.ts",
        "resources/js/**/*.js",
        "resources/js/**/*.svelte",
        "*.js",
        "*.cjs",
        "*.mjs",
        "*.ts"
    ],
    "exclude": ["node_modules", "public", "storage"]
}
```

### Key Differences from `tsconfig.json`

| Feature      | `tsconfig.json`             | `tsconfig.eslint.json`           |
| ------------ | --------------------------- | -------------------------------- |
| Purpose      | Type-checking & compilation | ESLint analysis only             |
| Extends      | `@tsconfig/svelte`          | `./tsconfig.json`                |
| Root files   | ❌ Not included             | ✅ Includes `*.js`, `*.ts`, etc. |
| Config files | ❌ Not included             | ✅ Includes `.cjs`, `.mjs`       |
| Used by      | TypeScript, IDEs, Vite      | ESLint only                      |

### Why Two Separate Files?

#### 1. **Different Scopes**

- `tsconfig.json`: Only source code in `resources/js/`
- `tsconfig.eslint.json`: Source code + configuration files

#### 2. **Configuration Files**

Root-level config files like `vite.config.js`, `eslint.config.js` need to be linted but aren't in the `resources/js/` directory:

```
laravel-svelte-inertia-starter/
├── vite.config.js           # ✅ Linted by tsconfig.eslint.json
├── eslint.config.js         # ✅ Linted by tsconfig.eslint.json
├── svelte.config.js         # ✅ Linted by tsconfig.eslint.json
└── resources/js/
    └── app.ts               # ✅ Type-checked & linted by both
```

#### 3. **ESLint TypeScript Parser**

ESLint's TypeScript parser (`@typescript-eslint`) needs to understand TypeScript syntax in all files, not just source code.

---

## When Each File Is Used

### `tsconfig.json` Usage

1. **IDE Type-Checking**

    ```typescript
    // VS Code/JetBrains shows errors based on tsconfig.json
    import { home } from '$routes'; // ✅ Path alias works
    ```

2. **Build Process (Vite)**

    ```bash
    npm run build
    # Vite uses tsconfig.json for type-checking
    ```

3. **Type-Checking Command**
    ```bash
    tsc --noEmit
    # Uses tsconfig.json
    ```

### `tsconfig.eslint.json` Usage

1. **ESLint Configuration**

    ```javascript
    // eslint.config.js
    export default {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json', // 👈 Used here
            },
        },
    };
    ```

2. **Linting Commands**

    ```bash
    npm run lint
    # ESLint uses tsconfig.eslint.json
    ```

3. **IDE Linting**
    - ESLint plugin in VS Code/JetBrains uses `tsconfig.eslint.json`

---

## Best Practices

### ✅ Do's

1. **Keep `tsconfig.json` for source code only**

    ```json
    {
        "include": ["resources/js/**/*"]
    }
    ```

2. **Use `tsconfig.eslint.json` for broader linting**

    ```json
    {
        "extends": "./tsconfig.json",
        "include": ["resources/js/**/*", "*.js", "*.ts"]
    }
    ```

3. **Maintain path aliases in `tsconfig.json`**
    - These are inherited by `tsconfig.eslint.json`

4. **Update both files together**
    - If you add a new path alias, add it to `tsconfig.json`
    - It will automatically be available in `tsconfig.eslint.json`

### ❌ Don'ts

1. **Don't duplicate compiler options**
    - Use `extends` in `tsconfig.eslint.json`

2. **Don't lint `node_modules`**
    - Always exclude in both files

3. **Don't include build artifacts**
    - Exclude `public`, `storage`, `build`, `dist`

---

## Troubleshooting

### Path Aliases Not Working

**Problem**: Imports like `import X from '$routes'` show errors

**Solution**:

1. Check `tsconfig.json` has the path mapping
2. Restart TypeScript server in IDE
    - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
    - JetBrains: Invalidate Caches and Restart

### ESLint Errors on Config Files

**Problem**: ESLint can't find config files like `vite.config.js`

**Solution**:

1. Ensure `tsconfig.eslint.json` includes root files:

    ```json
    {
        "include": ["*.js", "*.ts", "*.cjs", "*.mjs"]
    }
    ```

2. Update `eslint.config.js`:
    ```javascript
    export default {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json',
            },
        },
    };
    ```

### Slow IDE Performance

**Problem**: TypeScript type-checking is slow

**Solution**:

1. Enable `skipLibCheck` in `tsconfig.json`
2. Exclude unnecessary directories
3. Use `isolatedModules: true`

---

## Related Files

### Vite Configuration (`vite.config.js`)

Vite respects TypeScript path aliases from `tsconfig.json`:

```javascript
export default {
    resolve: {
        alias: {
            $: path.resolve(__dirname, 'resources/js'),
            $shadcn: path.resolve(__dirname, 'resources/js/shadcn'),
            $routes: path.resolve(__dirname, 'resources/js/routes'),
            $lib: path.resolve(__dirname, 'resources/js/lib'),
        },
    },
};
```

### ESLint Configuration (`eslint.config.js`)

ESLint uses `tsconfig.eslint.json`:

```javascript
export default {
    languageOptions: {
        parserOptions: {
            project: './tsconfig.eslint.json',
            extraFileExtensions: ['.svelte'],
        },
    },
};
```

---

## Summary

| Aspect           | `tsconfig.json`           | `tsconfig.eslint.json`           |
| ---------------- | ------------------------- | -------------------------------- |
| **Purpose**      | Type-checking source code | Linting all project files        |
| **Scope**        | `resources/js/**/*`       | `resources/js/**/*` + root files |
| **Used By**      | TypeScript, IDEs, Vite    | ESLint                           |
| **Path Aliases** | Defines them              | Inherits them                    |
| **Config Files** | Excluded                  | Included                         |
| **Primary Use**  | Development & Build       | Code Quality                     |

Both files work together to provide:

- ✅ Type safety in source code
- ✅ Consistent linting across all files
- ✅ Clean import paths
- ✅ Better developer experience

---

## Quick Reference

### Adding a New Path Alias

1. Edit `tsconfig.json`:

    ```json
    {
        "compilerOptions": {
            "paths": {
                "$components/*": ["resources/js/components/*"]
            }
        }
    }
    ```

2. Update `vite.config.js`:

    ```javascript
    {
        resolve: {
            alias: {
                '$components': path.resolve(__dirname, 'resources/js/components')
            }
        }
    }
    ```

3. Restart TypeScript server

### Checking Configuration

```bash
# Verify TypeScript configuration
tsc --showConfig

# Check what files are included
tsc --listFiles | grep "resources/js"

# Test ESLint configuration
npm run lint
```

---

## Additional Resources

- [TypeScript tsconfig.json Reference](https://www.typescriptlang.org/tsconfig)
- [Svelte TypeScript Support](https://svelte.dev/docs/typescript)
- [Vite TypeScript Guide](https://vitejs.dev/guide/features.html#typescript)
- [ESLint TypeScript Parser](https://typescript-eslint.io/packages/parser)
