<script lang="ts">
    import {cn} from "$shadcn/utils.ts";

    let { children,class: className = '',ref = $bindable()} = $props();
    const defaultClass = "relative font-mono bg-white border-[1.6px] border-black w-[210mm] h-[297mm] box-border flex flex-col"

    let stylingClass = $derived(cn(defaultClass, className ));
</script>

<div bind:this={ref}
    class={stylingClass}
>
    {@render children?.()}
</div>
