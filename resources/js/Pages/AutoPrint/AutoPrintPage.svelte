<script lang="ts">
    import {printModule, type PrintModuleState} from "$lib/print-module-svelte.ts";
    import * as NativeSelect from "$shadcn/components/ui/native-select";
    import {onMount} from "svelte";
    import Navbar from "$/Layouts/Navbar.svelte";
    import * as Card from "$shadcn/components/ui/card";
    import type {Printer as PrinterType} from "$lib/print-module.ts";
    import {PrinterCheck as PCIcon,Play as PlayIcon, SquareIcon} from "@lucide/svelte";
    import {Button} from "$shadcn/components/ui/button";
    import {toast} from "svelte-sonner";
    import AnimatedBeam from "$lib/Beam/AnimatedBeam.svelte";
    import BeamPrinter from "$/Pages/AutoPrint/BeamPrinter.svelte";

    let printerState = $state<PrintModuleState | null>(null);
    let mounted = $state(false);
    let usedPrinter = $state<string | null>(null);
    let printerUsedState = $state<PrinterType | null>(null);
    let isPrintingAuto = $state(false);

    const printer = printModule();

    $effect(()=>{
        if (mounted && usedPrinter && printerState && printerState.printer_list.some(p=>p.name === usedPrinter)) {
            printerUsedState = printerState.printer_list.find(p=>p.name === usedPrinter) ?? null;
        }
    });

    async function fetchPrinterState(){
        printerState = await printer.init();
        usedPrinter = printerState?.default_printer?.name ?? null;
    }

    onMount(()=>{
        fetchPrinterState();
        mounted = true;
    });

    async function startAutoPrint(){
        if (!printerState) {
            toast.error('Printer state is not initialized yet. Please wait and try again.');
            return;
        }
        isPrintingAuto = true;
    }

    async function stopAutoPrint(){
        isPrintingAuto = false;
    }
</script>

<Navbar>
    <div class="space-y-4">
        <div class="flex flex-col items-center justify-center w-full">
            <h1 class="text-4xl font-bold mb-4">Auto Print Page Mode</h1>
            <p class="text-lg text-gray-600 mb-8">This page will automatically print when auto print from client is used.</p>
        </div>

        <Card.Root>
            <Card.Header>
                <Card.Title>Print Module State</Card.Title>
                <Card.Description>
                    Checking client state are Connected and Ready to Print, and the print module is initialized successfully.
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="w-full h-max p-4 rounded-xl bg-pink-50 flex">
                    <div class="grid grid-cols-2 w-[30%]">
                        <p class="text-lg font-medium w-40">Client Initialized </p>
                        <p class="text-lg font-medium">: {printerState?.initialized ?? 'No'}</p>
                        <p class="text-lg font-medium w-40">Client Os</p>
                        <p class="text-lg font-medium">: {printerState?.os ?? 'Null'}</p>
                        <p class="text-lg font-medium w-40">Client Host</p>
                        <p class="text-lg font-medium">: {printerState?.hostname ?? 'Null'}</p>
                        <p class="text-lg font-medium w-40">Client Id</p>
                        <p class="text-lg font-medium">: {printerState?.client_id ?? 'Null'}</p>
                    </div>
                    <div class="w-[40%] grid grid-cols-2 gap-x-2">
                        <p class="text-lg font-medium w-40">Printer Name</p>
                        <p class="text-lg font-medium">: {printerUsedState?.name ?? 'Null'}</p>
                        <p class="text-lg font-medium w-40">Printer Status</p>
                        <p class="text-lg font-medium">: {printerUsedState?.status ?? 'Null'}</p>
                        <div class="row-span-2 col-span-2 w-full flex">
                            <p class="text-lg font-medium w-40">Printer Used:</p>
                            <NativeSelect.Root bind:value={usedPrinter} class="w-90 bg-pink-50 text-black">
                                {#each printerState?.printer_list ?? [] as p}
                                    <NativeSelect.Option value={p.name}>{p.name}</NativeSelect.Option>
                                {/each}
                            </NativeSelect.Root>
                        </div>
                    </div>
                    <div class="w-[30%] content-center text-center justify-center items-center flex">
                        {#if printerState?.initialized && printerUsedState?.status === 'Ready'}
                            <div class="flex flex-col items-center gap-2">
                                <PCIcon class="text-green-500" size={48}/>
                                <p class="text-green-500 font-medium">Ready to Print</p>
                            </div>
                        {:else}
                            <button onclick={fetchPrinterState} class="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition">Refresh State</button>
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>


        <Card.Root>
            <Card.Header>
                <Card.Title class="text-2xl">Auto Print Service</Card.Title>
                {#if isPrintingAuto}
                    <Button variant="outline" onclick={stopAutoPrint} class="border-orange-300 w-40"><SquareIcon  class="text-green-800" /> Stop</Button>
                {:else}
                    <Button variant="outline" onclick={startAutoPrint} class="border-orange-300 w-40"><PlayIcon class="text-green-800" /> Start</Button>
                {/if}
            </Card.Header>
            <Card.Content class="bg-pink-500/40">
                <BeamPrinter />
            </Card.Content>
        </Card.Root>
    </div>
</Navbar>
