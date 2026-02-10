<script lang="ts">
    import AutoFitText from "$lib/print/text/AutoFitText.svelte";
    import QRCodeGen from "$lib/print/QRCodeGen.svelte";

    let {
        rack = 'MM-M008',
        code = '18326112102D',
        name = 'CASE/TRANSMISSION/F/H/E4 – 1834201052',
        type = 'SXG324-SXG327/NT554/NT548/MF1650/MF1GC ALL/TXGS24FZJL1/NT540/NT536/NT542/MF1640/TLE3410 ALL/MF1741/TLE4550/MF1756/MF2E ALL/TXGS24 ALL/SXG216/MF1E ALL',
        timbangan = 'Non Timbangan',
        vendor = 'PT. MATSUMURA ITANO INDONESIA',
    } = $props();

    let codeParser = $derived(formatCode10(code));

    function formatCode10(s: string): string {
        return s.replace(/^(.{4})(.{3})(.{3})(.{2})$/, '$1-$2-$3-$4');
    }
</script>

<div
    class="relative font-mono border-25 w-[166mm] h-[130mm] border-yellow-500"
>
    <div class="flex w-full h-[13mm]">
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center">
            <span class="font-bold text-xl">ITEM CODE</span>
        </div>
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center">
            <span class="font-bold text-xl">PART NAME</span>
        </div>
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center">
            <span class="font-bold text-xl">SUPPLIER</span>
        </div>
    </div>
    <div class="flex w-full h-[13mm] border-t border-black">
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center border-b">
            <span class="font-bold font-serif text-2xl tracking-wide"><AutoFitText minPt={1} text={codeParser}/></span>
        </div>
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center border-b">
            <span class="font-bold text-md tracking-tight"><AutoFitText minPt={1} text={name} /></span>
        </div>
        <div class="basis-[52mm] content-center border-r border-black text-center justify-center border-b">
            <span class="font-bold text-md tracking-tight"><AutoFitText minPt={1} text={vendor} /></span>
        </div>
    </div>
    <div class="flex w-full h-[10mm] border-b border-black">
        <div class="basis-[26mm] content-center border-r border-black text-center justify-center">
            <span class="font-bold text-md">TYPE</span>
        </div>
        <div class="basis-[130mm] content-center border-r border-black text-center justify-center border-b">
            <span class="font-bold text-lg tracking-tight"><AutoFitText minPt={1} text={type} /></span>
        </div>
    </div>
    <div class="w-full h-[8mm] border-b content-center justify-center text-center border-black">
        <span class="font-bold tracking-wide text-xl">RACK NO.</span>
    </div>
    <div class="w-full h-[72mm] relative pt-[12mm] justify-center text-center border-black">
        <span class="text-8xl font-bold">{rack}</span>
        <div class="absolute bottom-[4mm] right-[7mm]">
            <QRCodeGen data={rack} size={10} class="mx-auto w-[24mm] h-[24mm]"></QRCodeGen>
        </div>
    </div>
</div>
