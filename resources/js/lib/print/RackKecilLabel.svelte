<script lang="ts">
    import AutoFitText from '$lib/print/text/AutoFitText.svelte';
    import QRCodeGen from '$lib/print/QRCodeGen.svelte';
    import { formatCode10 } from '$lib/print/text/text-formatter.ts';

    let {
        rack = 'MM-M008',
        code = '18326112102D',
        name = 'LABEL/CONTROL/SUB',
    } = $props();

    let codeParser = $derived(formatCode10(code));
</script>

<div class="relative font-mono border-2 flex w-[72mm] h-[11mm] border-black">
    <div class="w-[62mm] h-[10mm]">
        <div class="flex h-[5mm] w-[62mm] border-r border-b border-black">
            <div
                class="w-[31mm] h-full content-center text-center justify-center-safe border-r border-black"
            >
                <span class="font-bold tracking-tighter"
                    ><AutoFitText
                        minPt={1}
                        class="text-nowrap"
                        text={codeParser}
                    /></span
                >
            </div>
            <div
                class="w-[31mm] h-full content-center text-center justify-center-safe border-r border-black"
            >
                <span class="font-bold text-xs"
                    ><AutoFitText minPt={1} text={name} /></span
                >
            </div>
        </div>
        <div
            class="h-[4mm] w-[62mm] content-center text-center justify-center border-r border-black"
        >
            <span class="font-bold tracking-wider text-sm p-0 m-0">{rack}</span>
        </div>
    </div>
    <div class="w-[18mm] h-full border-black">
        <QRCodeGen data={rack} size={10} class="mx-auto w-[9mm] h-[9mm]"
        ></QRCodeGen>
    </div>
</div>
