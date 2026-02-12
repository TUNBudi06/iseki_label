<script>
    import '../../css/app.css';
    import {Toaster} from "$shadcn/components/ui/sonner/index.ts"
    let { children = null } = $props();
</script>

<Toaster position="top-right" richColors></Toaster>

{@render children?.()}
