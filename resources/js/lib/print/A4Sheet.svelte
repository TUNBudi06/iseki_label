<script lang="ts">
    import { cn } from '$shadcn/utils.ts';
    import RackKecilLabel from "$lib/print/RackKecilLabel.svelte";
    import RackAssyLabel from "$lib/print/RackAssyLabel.svelte";
    import PalletAssyLabel from "$lib/print/PalletAssyLabel.svelte";

    let { children = null, class: className = '', ref = $bindable(),sheet } = $props();
    const defaultClass =
        'relative font-mono bg-white border-[1.6px] border-black min-w-[210mm] w-[210mm] z-0 h-[297mm] min-h-[297mm] box-border flex flex-col gap-y-10 p-[12mm]';

    let stylingClass = $derived(cn(defaultClass, className));
    // first i will define the render however small label need to seperate render i mean 2 col
    // then i will define the render for the big label which is 1 col
    // however i need to sort the data if that contain a small label
    // then i will need to find the small label and put it in the same array
    // then i will render it accordingly
    let _rack = $derived.by(() =>{
        if(!sheet || sheet.length === 0) return [];
        let newRack = [];
        let rack = [...sheet];


        while (rack.length > 0) {
            var data = rack.pop();
            if (data.label_type === 'kecil') {
                let pairData = null;
                // find another small label
                for (let i = rack.length - 1; i >= 0; i--) {
                    if (rack[i].label_type === 'kecil') {
                        pairData = rack.splice(i, 1)[0];
                        break;
                    }
                }
                newRack.push(pairData ? [data, pairData] : [data]);
            } else {
                newRack.push(data);
            }
        }
        console.log(newRack);
        return newRack;
    })
</script>

<div bind:this={ref} class={stylingClass}>
    {#each _rack as row, rowIndex (rowIndex)}
        {#if (row instanceof Array)}
            <div class="flex items-center justify-between gap-4">
                {#each row as label, labelIndex (labelIndex)}
                    <RackKecilLabel code={label.item_code} name={label.item_name} rack={label.rack_code} />
                {/each}
            </div>
        {:else}
            {#if row instanceof Object}
                {#if row.label_type === 'besar'}
                    <RackAssyLabel code={row.item_code} name={row.item_name} rack={row.rack_code} timbangan={row.sample} type={row.type_tractor} hydrolis={row.hydrolist} vendor={row.vendor} />
                {/if}
                {#if row.label_type === 'pallet'}
                    <PalletAssyLabel code={row.item_code} name={row.item_name} rack={row.rack_code} type={row.type_tractor} vendor={row.vendor} />
                {/if}
            {/if}
        {/if}
    {/each}
</div>
