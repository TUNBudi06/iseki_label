<script lang="ts">
    import {Button} from "$shadcn/components/ui/button";
    import A4Sheet from "$lib/print/A4Sheet.svelte";

    let { allSheets,ids} = $props();

</script>
{#snippet A4Render()}
    <div class="w-[210mm] max-w-full mx-auto px-6 md:px-0  space-y-2 pb-10">
        <A4Sheet />
        <Button class="w-full">Download This Page</Button>
    </div>
{/snippet}
<div class="space-y-6 w-full">
    <div class="flex justify-between">
        <Button>Download PDF</Button>
    </div>
    <div class="w-full bg-pink-300/60 pt-20 pb-10 items-center flex flex-col gap-y-6 z-0 overflow-x-scroll">
        {@render A4Render()}
        {@render A4Render()}
    </div>
</div>
