<script lang="ts">
    import { cn } from '$shadcn/utils.ts';

    let { children = null, class: className = '', ref = $bindable() } = $props();
    const defaultClass =
        'relative font-mono bg-white border-[1.6px] border-black min-w-[210mm] w-[210mm] z-0 h-[297mm] min-h-[297mm] box-border flex flex-col';

    let stylingClass = $derived(cn(defaultClass, className));
</script>

<div bind:this={ref} class={stylingClass}>
    {@render children?.()}
</div>
