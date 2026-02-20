<script lang="ts">
    import AutoFitText from '$lib/print/text/AutoFitText.svelte';
    import { CircleCheck } from '@lucide/svelte';
    import QRCodeGen from '$lib/print/QRCodeGen.svelte';
    import { formatCode10 } from '$lib/print/text/text-formatter.ts';

    let {
        rack = 'MM-M008',
        code = '18326112102D',
        name = 'SWITCH/COMBINATION/E4          ASSY',
        type = 'SXG324-SXG327/NT554/NT548/MF1650/MF1GC ALL/TXGS24FZJL1/NT540/NT536/NT542/MF1640/TLE3410 ALL/MF1741/TLE4550/MF1756/MF2E ALL/TXGS24 ALL/SXG216/MF1E ALL',
        timbangan = 'Non Timbangan',
        vendor = 'Kakihara Meiban(Thai) CO., LTD',
        hydrolis = true,
    } = $props();

    let codeParser = $derived(formatCode10(code));
</script>

<div
    class="relative font-serif flex w-[190mm] h-[35mm] box-border border-2 gap-0 border-black"
>
    <div
        class="grid-rows-4 font-bold text-lg text-center w-[28mm] border-r border-black flex flex-col justify-center items-center box-border"
    >
        <h2 class="border-b-2 w-full">Rack No</h2>
        <h2 class="border-b-2 w-full">Code</h2>
        <h2 class="border-b-2 w-full">Name</h2>
        <h2 class="border-b-2 w-full">Type</h2>
    </div>
    <div
        class="flex flex-col font-bold text-lg text-center w-[86mm] border-r border-black justify-center items-center box-border"
    >
        <h2
            class="border-b-2 font-sans font-bold text-xl text-blue-700 tracking-widest w-full"
        >
            {rack}
        </h2>
        <h2 class="border-b-2 font-serif text-red-500 w-full">{codeParser}</h2>
        <h2
            class="border-b-2 text-xs font-normal text-orange-300 font-sans w-full"
        >
            <AutoFitText minPx={12} maxPx={20} text={name} />
        </h2>
        <h2
            class="border-b-2 w-full font-normal tracking-tighter font-sans text-xs m-y-1"
        >
            <AutoFitText minPx={12} maxPx={18} text={type} />
        </h2>
    </div>
    <div
        class="grid grid-rows-4 font-bold text-lg border-r border-black text-center w-[24mm] h-[35mm] items-center box-border"
    >
        <div class="border-b border-black w-full">Remark</div>
        <div class="border-b-2 w-full font-sans font-normal tracking-tight">
            <AutoFitText minPx={15} text={timbangan ?? ''} />
        </div>
        <div
            class="w-full text-sm font-normal font-sans row-span-2 tracking-tighter"
        >
            <AutoFitText minPx={12} maxPx={16} fillSpace={true} balance={false} text={vendor} />
        </div>
    </div>
    <div
        class="grid grid-rows-4 font-bold text-lg border-r border-black text-center w-[30mm] h-[35mm] items-center box-border"
    >
        <div class="border-b border-black w-full">QR Code</div>
        <div class="w-full text-sm row-span-3">
            <QRCodeGen
                data={rack}
                size={10}
                class="mx-auto w-[24mm] h-[24mm]"
            />
        </div>
    </div>
    <div
        class="grid grid-rows-4 text-center h-[35mm] w-[22mm] items-center box-border"
    >
        <div class="border-b border-black w-full font-bold">Hydrolis</div>
        <div
            class="row-span-3 text-center w-full h-full flex justify-center items-center"
        >
            {#if hydrolis}
                <CircleCheck class="text-pink-600 size-13" />
            {/if}
        </div>
    </div>
</div>
