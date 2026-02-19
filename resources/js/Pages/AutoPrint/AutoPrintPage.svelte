<script lang="ts">
    import {
        printModule,
        type PrintModuleState,
    } from '$lib/print-module-svelte.ts';
    import * as NativeSelect from '$shadcn/components/ui/native-select';
    import { onMount, tick } from 'svelte';
    import Navbar from '$/Layouts/Navbar.svelte';
    import * as Card from '$shadcn/components/ui/card';
    import * as Field from '$shadcn/components/ui/field';
    import type { Printer as PrinterType } from '$lib/print-module.ts';
    import {
        PrinterCheck as PCIcon,
        Play as PlayIcon,
        SquareIcon,
        User as UserIcon,
        Database as DatabaseIcon,
        SearchIcon,
        CalendarClock as CalendarClockIcon,
        ChevronLeft,
        BetweenHorizonalStart,
        Shredder,
        HardDriveUpload,
    } from '@lucide/svelte';
    import { Button } from '$shadcn/components/ui/button';
    import { useInterval, IsMounted } from 'runed';
    import { Input } from '$shadcn/components/ui/input';
    import AnimatedBeam from '$lib/Beam/AnimatedBeam.svelte';
    import {isEmptyObject} from "tailwind-variants/utils";

    let printerState = $state<PrintModuleState | null>(null);
    let mounted = new IsMounted();
    let usedPrinter = $state<string | null>(null);
    let printerUsedState = $state<PrinterType | null>(null);
    let intervalSetting = $state<number>(5000);

    const printer = printModule();

    $effect(() => {
        if (
            mounted &&
            usedPrinter &&
            printerState &&
            printerState.printer_list.some((p) => p.name === usedPrinter)
        ) {
            printerUsedState =
                printerState.printer_list.find((p) => p.name === usedPrinter) ??
                null;
        }
    });

    async function fetchPrinterState() {
        printerState = await printer.init();
        usedPrinter = printerState?.default_printer?.name ?? null;
    }

    onMount(() => {
        fetchPrinterState();
        mounted = true;
    });

    let startTask = $state(false);
    let containerRef: HTMLElement | null = $state(null);
    let webClient: HTMLElement | null = $state(null);
    let scheduler: HTMLElement | null = $state(null);
    // additional element refs
    let fetchingRef: HTMLElement | null = $state(null);
    let databaseRef: HTMLElement | null = $state(null);
    let arrayRef: HTMLElement | null = $state(null);
    let dataListRef: HTMLElement | null = $state(null);
    let generatingRef: HTMLElement | null = $state(null);
    let uploadingRef: HTMLElement | null = $state(null);
    let resultRef: HTMLElement | null = $state(null);

    let taskIsRunning = $state(false);
    let databaseData = $state<any[]>([]);
    async function webTask() {
        if(taskIsRunning) return;
        taskIsRunning = true;
        await tick();
        startTask = true;
    }

    let startScanDb = $state(false);
    let startPrinting = $state(false);
    async function schedulerTask() {
        startTask = false;
        if(databaseData && databaseData.length == 0) {
            startScanDb = true;
        } else {
            startPrinting = true;
        }

    }

    const interval = useInterval(() => intervalSetting, {
        immediate: false,
        callback: ()=> webTask(),
    });

    let durationAnimation = $derived.by(()=>{
        const interval = intervalSetting/1000;
        if(interval <= 0) {
            return 1;
        }
        return Math.min(interval * 0.8, 5);
    })
</script>

<Navbar>
    <div class="space-y-4">
        <div class="flex flex-col items-center justify-center w-full">
            <h1 class="text-4xl font-bold mb-4">Auto Print Page Mode</h1>
            <p class="text-lg text-gray-600 mb-8">
                This page will automatically print when auto print from client
                is used.
            </p>
        </div>

        <Card.Root>
            <Card.Header>
                <Card.Title>Print Module State</Card.Title>
                <Card.Description>
                    Checking client state are Connected and Ready to Print, and
                    the print module is initialized successfully.
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="w-full h-max p-4 rounded-xl bg-pink-50 flex">
                    <div class="grid grid-cols-2 w-[30%]">
                        <p class="text-lg font-medium w-40">
                            Client Initialized
                        </p>
                        <p class="text-lg font-medium">
                            : {printerState?.initialized ?? 'No'}
                        </p>
                        <p class="text-lg font-medium w-40">Client Os</p>
                        <p class="text-lg font-medium">
                            : {printerState?.os ?? 'Null'}
                        </p>
                        <p class="text-lg font-medium w-40">Client Host</p>
                        <p class="text-lg font-medium">
                            : {printerState?.hostname ?? 'Null'}
                        </p>
                        <p class="text-lg font-medium w-40">Client Id</p>
                        <p class="text-lg font-medium">
                            : {printerState?.client_id ?? 'Null'}
                        </p>
                    </div>
                    <div class="w-[40%] grid grid-cols-2 gap-x-2">
                        <p class="text-lg font-medium w-40">Printer Name</p>
                        <p class="text-lg font-medium">
                            : {printerUsedState?.name ?? 'Null'}
                        </p>
                        <p class="text-lg font-medium w-40">Printer Status</p>
                        <p class="text-lg font-medium">
                            : {printerUsedState?.status ?? 'Null'}
                        </p>
                        <div class="row-span-2 col-span-2 w-full flex">
                            <p class="text-lg font-medium w-40">
                                Printer Used:
                            </p>
                            <NativeSelect.Root
                                bind:value={usedPrinter}
                                class="w-90 bg-pink-50 text-black"
                            >
                                {#each printerState?.printer_list ?? [] as p}
                                    <NativeSelect.Option value={p.name}
                                        >{p.name}</NativeSelect.Option
                                    >
                                {/each}
                            </NativeSelect.Root>
                        </div>
                    </div>
                    <div
                        class="w-[30%] content-center text-center justify-center items-center flex"
                    >
                        {#if printerState?.initialized && printerUsedState?.status === 'Ready'}
                            <div class="flex flex-col items-center gap-2">
                                <PCIcon class="text-green-500" size={48} />
                                <p class="text-green-500 font-medium">
                                    Ready to Print
                                </p>
                            </div>
                        {:else}
                            <button
                                onclick={fetchPrinterState}
                                class="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition"
                                >Refresh State</button
                            >
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="text-2xl">Auto Print Service</Card.Title>
                {#if interval.isActive}
                    <Button
                        variant="outline"
                        onclick={() => interval.pause()}
                        class="border-orange-300 w-40"
                        ><SquareIcon class="text-green-800" /> Stop</Button
                    >
                {:else}
                    <Button
                        variant="outline"
                        onclick={() => interval.resume()}
                        class="border-orange-300 w-40"
                        ><PlayIcon class="text-green-800" /> Start</Button
                    >
                {/if}
                <Field.Field>
                    <Field.Label for="interval">Interval</Field.Label>
                    <Input
                        id="interval"
                        bind:value={intervalSetting}
                        autocomplete="on"
                        placeholder="Evil Rabbit"
                    />
                    <Field.Description>
                        Set the interval for auto print checking, in
                        milliseconds. <span class="text-sm text-gray-600"
                            >(counter: {interval.counter})</span
                        >
                    </Field.Description>
                </Field.Field>
            </Card.Header>
            <Card.Content class=" m-2">
                <div
                    class="w-full bg-pink-500/40 h-128 rounded-xl relative"
                    bind:this={containerRef}
                >
                    <div
                        bind:this={webClient}
                        class="absolute w-28 flex h-16 top-20 left-20 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <UserIcon />
                        <span class="text-xs text-gray-100 text-shadow-2xs"
                            >Web Client</span
                        >
                    </div>

                    <div
                        bind:this={scheduler}
                        class="absolute w-28 flex h-16 top-20 left-90 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <CalendarClockIcon />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Scheduler</span
                        >
                    </div>

                    <div
                        bind:this={fetchingRef}
                        class="absolute w-28 flex h-16 top-20 left-160 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <SearchIcon />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Fetching</span
                        >
                    </div>

                    <div
                        bind:this={databaseRef}
                        class="absolute w-28 flex h-16 top-20 left-240 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <DatabaseIcon />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Database</span
                        >
                    </div>

                    <div
                        bind:this={arrayRef}
                        class="absolute w-28 flex h-16 top-20 left-320 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <ChevronLeft /><ChevronLeft class="rotate-180" />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Array</span
                        >
                    </div>

                    <div
                        bind:this={dataListRef}
                        class="absolute w-28 flex h-16 top-60 left-90 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <BetweenHorizonalStart />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Data List</span
                        >
                    </div>

                    <div
                        bind:this={generatingRef}
                        class="absolute w-28 flex h-16 top-60 left-160 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <Shredder />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Generating Rendering</span
                        >
                    </div>

                    <div
                        bind:this={uploadingRef}
                        class="absolute w-28 flex h-16 top-60 left-240 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <HardDriveUpload />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Uplouding</span
                        >
                    </div>

                    <div
                        bind:this={resultRef}
                        class="absolute w-28 flex h-16 top-60 left-320 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                    >
                        <ChevronLeft /><ChevronLeft class="rotate-180" />
                        <span class="text-xs text-gray-100 text-shadow-2xs ps-2"
                            >Result</span
                        >
                    </div>

                    <AnimatedBeam
                        duration={durationAnimation}
                        trigger={startTask}
                        pathColor="black"
                        startXOffset={60}
                        endXOffset={-50}
                        bind:containerRef
                        bind:fromRef={webClient}
                        gradientStartColor="#2b7cff"
                        gradientStopColor="#00e5ff"
                        pathWidth={4}
                        bind:toRef={scheduler}
                        onAnimationComplete={() => schedulerTask()}
                    />
                    <AnimatedBeam
                        duration={durationAnimation}
                        trigger={startScanDb}
                        pathColor="black"
                        startXOffset={60}
                        endXOffset={-50}
                        bind:containerRef
                        bind:fromRef={scheduler}
                        bind:toRef={fetchingRef}
                        gradientStartColor="#2b7cff"
                        gradientStopColor="#00e5ff"
                        pathWidth={4}
                        onAnimationComplete={() => {
                            startScanDb = false;
                            taskIsRunning = false;
                        }}
                    />
                    <AnimatedBeam
                        duration={durationAnimation}
                        trigger={startPrinting}
                        pathColor="black"
                        startYOffset={35}
                        endYOffset={-35}
                        bind:containerRef
                        bind:fromRef={scheduler}
                        bind:toRef={dataListRef}
                        gradientStartColor="#2b7cff"
                        gradientStopColor="#00e5ff"
                        pathWidth={4}
                        onAnimationComplete={() => {
                            startPrinting = false;
                            taskIsRunning = false;
                        }}
                    />
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</Navbar>
