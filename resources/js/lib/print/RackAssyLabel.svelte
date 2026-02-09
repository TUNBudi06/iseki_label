<script lang="ts">


    import AutoFitText from "$lib/print/AutoFitText.svelte";

    let {rack='MM_M008',code='18326112102D',name='ENGINE ASSY / SF237 (E3FH-TDEG01)',type='' } = $props();

    let codeParser = $derived(formatCode10(code))

    function formatCode10(s:string): string {
        return s.replace(/^(.{4})(.{3})(.{3})(.{2})$/, "$1-$2-$3-$4");
    }
</script>

<div
    class="relative font-mono bg-white border-[1.6px] border-black w-[210mm] h-[297mm] box-border p-[5mm] flex flex-col justify-between"
>
    <div class="relative font-serif flex w-[190mm] h-[35mm] box-border border-2 gap-0 border-black ">
        <div class="grid-rows-4 font-bold text-lg text-center w-[28mm] border-r border-black flex flex-col justify-center items-center box-border">
            <h2 class="border-b-2 w-full">Rack No</h2>
            <h2 class="border-b-2 w-full">Code</h2>
            <h2 class="border-b-2 w-full">Name</h2>
            <h2 class="border-b-2 w-full">Type</h2>
        </div>
        <div class="flex flex-col font-bold text-lg text-center w-[80mm] border-r border-black justify-center items-center box-border">
            <h2 class="border-b-2 font-sans text-xl text-blue-700 tracking-widest w-full">{rack}</h2>
            <h2 class="border-b-2 font-serif text-red-500 w-full">{codeParser}</h2>
            <h2 class="border-b-2 text-xs font-normal font-sans w-full"><AutoFitText minPt={1} text={name}/></h2>
            <h2 class="border-b-2 w-full">Type A</h2>
        </div>
        <div class="grid grid-rows-4 font-bold text-lg border-r border-black text-center w-[24mm] h-[35mm] items-center box-border">
            <div class="border-b border-black w-full">Remark</div>
            <div class="border-b-2 w-full">S:10</div>
            <div class="w-full text-sm row-span-2">Main Server Rack</div>
        </div>
        <div class="grid grid-rows-4 font-bold text-lg border-r border-black text-center w-[30mm] h-[35mm] items-center box-border">
            <div class="border-b border-black w-full">QR Code</div>
            <div class="w-full text-sm row-span-3">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=30x35&data=RACK-001" alt="QR Code" class="mx-auto w-[24mm] h-[24mm]"/>
            </div>
        </div>
    </div>
</div>
