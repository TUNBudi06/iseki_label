<script lang="ts">
    import AutoFitText from '$lib/print/text/AutoFitText.svelte';
    import { CircleCheck } from '@lucide/svelte';
    import QRCodeGen from "$lib/print/QRCodeGen.svelte";

    let {
        rack = 'MM-M008',
        code = '18326112102D',
        name = 'SWITCH/COMBINATION/E4          ASSY',
        type = 'SXG324-SXG327/NT554/NT548/MF1650/MF1GC ALL/TXGS24FZJL1/NT540/NT536/NT542/MF1640/TLE3410 ALL/MF1741/TLE4550/MF1756/MF2E ALL/TXGS24 ALL/SXG216/MF1E ALL',
        timbangan = 'Non Timbangan',
        vendor = 'Kakihara Meiban(Thai) CO., LTD',
    } = $props();

    let codeParser = $derived(formatCode10(code));

    function formatCode10(s: string): string {
        return s.replace(/^(.{4})(.{3})(.{3})(.{2})$/, '$1-$2-$3-$4');
    }
</script>

<div
    class="relative font-mono border-2 flex w-[80mm] h-[18mm] border-black"
>
    <div class="w-[62mm] h-[9mm]">
        <div class="flex h-[9mm] w-[62mm] border-r border-b border-black">
            <div class="w-[31mm] h-full content-center text-center justify-center-safe border-r border-black">
                <span class="font-bold tracking-tighter"><AutoFitText minPt={1} class="text-nowrap" text={codeParser} /></span>
            </div>
            <div class="w-[31mm] h-full content-center text-center justify-center-safe border-r border-black">
                <span class="font-bold text-xs"><AutoFitText minPt={1} text={name} /></span>
            </div>
        </div>
        <div class="h-[8mm] w-[62mm] border-b content-center text-center justify-center-safe border-r border-black">
            <span class="font-bold tracking-wide text-xl">{rack}</span>
        </div>
    </div>
    <div class="w-[18mm] h-full border-black">
        <QRCodeGen data={rack} size={10} class="mx-auto w-[17mm] h-[17mm]"></QRCodeGen>
    </div>
</div>
