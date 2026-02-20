<script lang="ts">
    import {
        printModule,
        type PrintModuleState,
    } from '$lib/print-module-svelte.ts';
    import {
        Root as NativeSelectRoot,
        Option as NativeSelectOption,
    } from '$shadcn/components/ui/native-select';
    import { onMount, tick } from 'svelte';
    import Navbar from '$/Layouts/Navbar.svelte';
    import {
        Root as CardRoot,
        Header as CardHeader,
        Content as CardContent,
        Title as CardTitle,
        Description as CardDescription,
    } from '$shadcn/components/ui/card';
    import {
        Field as FieldRoot,
        Label as FieldLabel,
        Description as FieldDescription,
    } from '$shadcn/components/ui/field';
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
    import { routeUrl } from '@tunbudi06/inertia-route-helper';
    import { listAuto } from '$routes/api/auto-print';
    import RenderEngine from '$lib/print/RenderEngine.svelte';
    import AutoRender from '$/Pages/AutoPrint/AutoRender.svelte';

    // Page: Auto Print Service
    // Responsibilities:
    // - show print module / client state
    // - periodically trigger `webTask` which animates the workflow and
    //   fetches a list from the server to start printing.

    let printerState = $state<PrintModuleState | null>(null);
    let mounted = new IsMounted();
    let usedPrinter = $state<string | null>(null);
    let printerUsedState = $state<PrinterType | null>(null);
    let intervalSetting = $state<number>(1000);

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
        if (taskIsRunning) return;
        taskIsRunning = true;
        await tick();
        startTask = true;
    }

    let startScanDb = $state(false);
    let startPrinting = $state(false);
    async function schedulerTask() {
        startTask = false;
        if (databaseData && databaseData.length == 0) {
            startScanDb = true;
        } else {
            startPrinting = true;
        }
    }

    const interval = useInterval(() => intervalSetting, {
        immediate: false,
        callback: () => webTask(),
    });

    // let durationAnimation = $derived.by(()=>{
    //     const interval = intervalSetting/1000;
    //     if(interval <= 0) {
    //         return 1;
    //     }
    //     return Math.min(interval * 0.3, 5);
    // })
    // $inspect(durationAnimation, 'durationAnimation')

    const durationAnimation = 2; //let's keep it simple for now, can be derived from intervalSetting if needed

    let startedFetching = $state(false);
    async function fetchingDataFunction() {
        startedFetching = true;
        startScanDb = false;
        const fetchdata = await fetch(routeUrl(listAuto()), {
            method: 'get',
        })
            .then((res) => {
                if (res.ok) {
                    // @ts-ignore
                    return res.json();
                }
                throw new Error('Failed to fetch data');
            })
            .catch((err) => {
                console.error(err);
                return [];
            })
            .finally(() => {
                startedFetching = false;
            });
        console.log('Fetched data:', fetchdata);
        databaseData = fetchdata;
        arrayCount = databaseData ? databaseData.length : 0;
    }

    let arrayFetched = $state(false);
    let arrayCount = $state(0);
    async function resultTask() {
        startedFetching = false;
        arrayFetched = true;
    }

    let dataBind = $state<any[]>([]);
    async function DataBaseListParse() {
        startPrinting = false;
        dataBind = databaseData ? databaseData : [];
        taskIsRunning = false;
    }

    let labelContainer = $state<HTMLElement>();
    function LabelRenderEngine() {
        if (!labelContainer) {
            taskIsRunning = false;
            return;
        }

        let query = labelContainer.querySelectorAll('.A4-print-page')
        console.log('Found pages:', query.length);
        taskIsRunning = false;
    }
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

        <CardRoot>
            <CardHeader>
                <CardTitle>Print Module State</CardTitle>
                <CardDescription>
                    Checking client state are Connected and Ready to Print, and
                    the print module is initialized successfully.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div
                    class="w-full p-4 rounded-xl bg-pink-50 flex flex-col gap-6 md:flex-row md:gap-6"
                >
                    <!-- LEFT COLUMN -->
                    <div
                        class="grid grid-cols-2 gap-y-2 text-sm sm:text-base md:w-1/3"
                    >
                        <p class="font-medium">Client Initialized</p>
                        <p class="font-medium">
                            : {printerState?.initialized ?? 'No'}
                        </p>

                        <p class="font-medium">Client OS</p>
                        <p class="font-medium">
                            : {printerState?.os ?? 'Null'}
                        </p>

                        <p class="font-medium">Client Host</p>
                        <p class="font-medium">
                            : {printerState?.hostname ?? 'Null'}
                        </p>

                        <p class="font-medium">Client Id</p>
                        <p class="font-medium">
                            : {printerState?.client_id ?? 'Null'}
                        </p>
                    </div>

                    <!-- MIDDLE COLUMN -->
                    <div
                        class="grid grid-cols-2 gap-y-2 gap-x-3 text-sm sm:text-base md:w-1/3"
                    >
                        <p class="font-medium">Printer Name</p>
                        <p class="font-medium">
                            : {printerUsedState?.name ?? 'Null'}
                        </p>

                        <p class="font-medium">Printer Status</p>
                        <p class="font-medium">
                            : {printerUsedState?.status ?? 'Null'}
                        </p>

                        <div
                            class="col-span-2 flex flex-col sm:flex-row gap-2 mt-2"
                        >
                            <p class="font-medium sm:w-40">Printer Used:</p>

                            <NativeSelectRoot
                                bind:value={usedPrinter}
                                class="w-full sm:w-auto bg-pink-50 text-black"
                            >
                                {#each printerState?.printer_list ?? [] as p}
                                    <NativeSelectOption value={p.name}>
                                        {p.name}
                                    </NativeSelectOption>
                                {/each}
                            </NativeSelectRoot>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN -->
                    <div
                        class="flex justify-center items-center text-center md:w-1/3"
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
                            >
                                Refresh State
                            </button>
                        {/if}
                    </div>
                </div>
            </CardContent>
        </CardRoot>

        <CardRoot>
            <CardHeader>
                <CardTitle class="text-2xl">Auto Print Service</CardTitle>
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
                <FieldRoot>
                    <FieldLabel for="interval">Interval</FieldLabel>
                    <Input
                        id="interval"
                        bind:value={intervalSetting}
                        autocomplete="on"
                        placeholder="Evil Rabbit"
                    />
                    <FieldDescription>
                        Set the interval for auto print checking, in
                        milliseconds. <span class="text-sm text-gray-600"
                            >(counter: {interval.counter})</span
                        >
                    </FieldDescription>
                </FieldRoot>
            </CardHeader>
            <CardContent class=" m-2">
                <div class="overflow-x-auto w-full">
                    <div
                        class="w-380 bg-pink-500/40 h-128 rounded-xl relative"
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
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Scheduler</span
                            >
                        </div>

                        <div
                            bind:this={fetchingRef}
                            class="absolute w-28 flex h-16 top-20 left-160 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <SearchIcon />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Fetching</span
                            >
                        </div>

                        <div
                            bind:this={databaseRef}
                            class="absolute w-28 flex h-16 top-20 left-240 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <DatabaseIcon />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Database</span
                            >
                        </div>

                        <div
                            bind:this={arrayRef}
                            class="absolute w-28 flex h-16 top-20 left-320 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <ChevronLeft />{arrayCount}<ChevronLeft
                                class="rotate-180"
                            />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Array</span
                            >
                        </div>

                        <div
                            bind:this={dataListRef}
                            class="absolute w-28 flex h-16 top-60 left-90 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <BetweenHorizonalStart />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Data List</span
                            >
                        </div>

                        <div
                            bind:this={generatingRef}
                            class="absolute w-28 flex h-16 top-60 left-160 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <Shredder />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Generating Rendering</span
                            >
                        </div>

                        <div
                            bind:this={uploadingRef}
                            class="absolute w-28 flex h-16 top-60 left-240 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <HardDriveUpload />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
                                >Uploading</span
                            >
                        </div>

                        <div
                            bind:this={resultRef}
                            class="absolute w-28 flex h-16 top-60 left-320 bg-linear-to-br justify-center content-center text-center items-center from-pink-400 p-1 to-purple-400 rounded-2xl"
                        >
                            <ChevronLeft /><ChevronLeft class="rotate-180" />
                            <span
                                class="text-xs text-gray-100 text-shadow-2xs ps-2"
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
                            onAnimationComplete={() => fetchingDataFunction()}
                        />
                        <AnimatedBeam
                            duration={durationAnimation}
                            trigger={startedFetching}
                            pathColor="black"
                            startXOffset={60}
                            endXOffset={-50}
                            bind:containerRef
                            bind:fromRef={fetchingRef}
                            bind:toRef={databaseRef}
                            gradientStartColor="#2b7cff"
                            gradientStopColor="#00e5ff"
                            pathWidth={4}
                            onAnimationComplete={() => resultTask()}
                        />
                        <AnimatedBeam
                            duration={durationAnimation}
                            trigger={arrayFetched}
                            pathColor="black"
                            startXOffset={60}
                            endXOffset={-50}
                            bind:containerRef
                            bind:fromRef={databaseRef}
                            bind:toRef={arrayRef}
                            gradientStartColor="#2b7cff"
                            gradientStopColor="#00e5ff"
                            pathWidth={4}
                            onAnimationComplete={() => DataBaseListParse()}
                        />

                        <!--                    PRINTING BEAM-->
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
                            pathWidth={6}
                            onAnimationComplete={()=> LabelRenderEngine()}
                        />
                    </div>
                </div>
            </CardContent>
        </CardRoot>

        <CardRoot>
            <CardHeader>
                <CardTitle>📋 Catatan & Dokumentasi</CardTitle>
                <CardDescription>
                    Referensi komprehensif untuk menggunakan, mengoperasikan,
                    dan mengembangkan Halaman Layanan Cetak Otomatis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-6 text-sm text-gray-700">
                    <!-- OVERVIEW -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            📌 Ikhtisar
                        </h3>
                        <p>
                            <strong>Halaman Cetak Otomatis</strong> berfungsi sebagai
                            panel kontrol utama untuk sistem pencetakan label otomatis.
                            Halaman ini menghubungkan browser (Klien Web) ke modul
                            cetak Python lokal melalui mekanisme polling terjadwal.
                            Pada setiap siklus, sistem mengambil data dari server
                            untuk pekerjaan cetak yang tertunda dan, jika ditemukan,
                            mengarahkannya melalui pipeline render/unggah sebelum
                            mengirim ke printer fisik.
                        </p>
                        <p>
                            Diagram alur kerja visual (kotak + berkas animasi)
                            mencerminkan secara tepat apa yang terjadi di balik
                            layar pada setiap tahap proses cetak. Gunakan
                            diagram ini untuk memahami dengan cepat di mana
                            posisi pekerjaan dalam pipeline saat ini.
                        </p>
                    </section>

                    <!-- WORKFLOW STAGES -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            🔄 Penjelasan Tahapan Alur Kerja
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-xs border-collapse">
                                <thead>
                                    <tr class="bg-pink-100 text-left">
                                        <th
                                            class="px-3 py-2 border border-pink-200 font-semibold w-32"
                                            >Tahap</th
                                        >
                                        <th
                                            class="px-3 py-2 border border-pink-200 font-semibold"
                                            >Fungsi</th
                                        >
                                        <th
                                            class="px-3 py-2 border border-pink-200 font-semibold w-40"
                                            >Variabel status utama</th
                                        >
                                    </tr>
                                </thead>
                                <tbody
                                    class="[&>tr:nth-child(even)]:bg-gray-50"
                                >
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Klien Web</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Titik masuk. Digerakkan oleh
                                            interval penjadwal atau pemanggilan
                                            manual <code>webTask()</code>.
                                            Menetapkan
                                            <code>taskIsRunning = true</code> untuk
                                            mencegah tumpang tindih proses.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>startTask</code></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Penjadwal</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Menentukan langkah selanjutnya:
                                            jika <code>databaseData</code> kosong,
                                            pemindai DB baru dipicu; jika tidak, langsung
                                            diarahkan ke pipeline pencetakan.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code
                                                >startScanDb / startPrinting</code
                                            ></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Pengambilan Data</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Memanggil <code
                                                >fetchingDataFunction()</code
                                            > yang mengirim permintaan GET ke endpoint
                                            API cetak-otomatis dan menunggu array
                                            JSON objek pekerjaan.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>startedFetching</code></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Basis Data</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Mewakili penyimpanan staging.
                                            Setelah pengambilan berhasil, <code
                                                >databaseData</code
                                            >
                                            diisi dan <code>arrayCount</code> diperbarui.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>databaseData</code></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Array</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Penghitung visual yang menunjukkan
                                            jumlah pekerjaan dalam antrian.
                                            Angka yang ditampilkan di antara
                                            tanda chevron mencerminkan nilai <code
                                                >arrayCount</code
                                            >.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>arrayCount</code></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Daftar Data</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Daftar pekerjaan yang telah
                                            diselesaikan diteruskan ke tahap
                                            render. Mewakili struktur data
                                            perantara sebelum pembuatan
                                            PDF/label dimulai.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>startPrinting</code></td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Pembuatan / Render</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Setiap pekerjaan dirender ke format
                                            cetak (PDF atau label HTML). Di
                                            sinilah rendering Inertia/SSR atau
                                            pembuatan PDF sisi server
                                            berlangsung.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >—</td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Pengunggahan</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Mengirim file yang telah dirender
                                            ke layanan cetak Python lokal
                                            (berbasis SumatraPDF) atau
                                            menyiapkannya untuk pencetakan
                                            langsung. Kesalahan jaringan di sini
                                            biasanya berarti layanan cetak tidak
                                            berjalan.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >—</td
                                        >
                                    </tr>
                                    <tr>
                                        <td
                                            class="px-3 py-2 border border-pink-100 font-medium"
                                            >Hasil</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            >Status akhir proses. Saat berhasil, <code
                                                >taskIsRunning</code
                                            >
                                            direset ke <code>false</code> sehingga
                                            siklus interval berikutnya dapat memulai
                                            proses baru.</td
                                        >
                                        <td
                                            class="px-3 py-2 border border-pink-100"
                                            ><code>taskIsRunning</code></td
                                        >
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <!-- CONTROLS -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            🎛️ Referensi Kontrol
                        </h3>
                        <ul class="list-disc ps-5 space-y-2">
                            <li>
                                <strong>Tombol Mulai / Berhenti</strong> —
                                mengaktifkan atau menonaktifkan penjadwal
                                <code>useInterval</code>. Saat aktif,
                                <code>webTask()</code>
                                dipanggil secara otomatis setiap
                                <em>interval</em>
                                milidetik. Menjeda tidak membatalkan proses yang sedang
                                berjalan.
                            </li>
                            <li>
                                <strong>Input Interval</strong> — mengatur frekuensi
                                polling dalam milidetik. Penghitung proses saat ini
                                ditampilkan di samping kolom. Perubahan nilai berlaku
                                pada siklus berikutnya (tidak perlu memulai ulang).
                            </li>
                            <li>
                                <strong>Dropdown Printer yang Digunakan</strong>
                                — memilih printer OS mana yang akan menerima
                                pekerjaan. Daftar diisi dari modul cetak lokal
                                saat halaman dimuat. Klik
                                <strong>Segarkan Status</strong> jika daftar kosong
                                atau usang.
                            </li>
                            <li>
                                <strong>Tombol Segarkan Status</strong> —
                                menginisialisasi ulang modul cetak dan mengambil
                                ulang daftar printer. Gunakan ini jika status
                                klien menunjukkan
                                <em>Belum diinisialisasi</em> atau printer yang dipilih
                                menghilang.
                            </li>
                        </ul>
                    </section>

                    <!-- RECOMMENDED SETTINGS -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            ⚙️ Pengaturan yang Direkomendasikan
                        </h3>
                        <ul class="list-disc ps-5 space-y-2">
                            <li>
                                <strong>Pengembangan / pengujian:</strong>
                                interval = <code>5000 md</code> (5 dtk). Memberikan
                                umpan balik cepat tanpa membebani server.
                            </li>
                            <li>
                                <strong>Produksi (volume rendah):</strong>
                                interval = <code>15 000 – 30 000 md</code> (15–30
                                dtk).
                            </li>
                            <li>
                                <strong>Produksi (volume tinggi):</strong>
                                interval = <code>5 000 – 10 000 md</code> dengan pembatasan
                                laju sisi server pada API.
                            </li>
                            <li>
                                Jangan pernah mengatur interval di bawah <code
                                    >2 000 md</code
                                > — durasi animasi adalah 2 dtk dan proses baru dapat
                                dimulai sebelum proses sebelumnya selesai secara visual.
                            </li>
                            <li>
                                Pertahankan tab browser terlihat saat debugging;
                                pembatasan latar belakang di Chrome/Edge dapat
                                menunda siklus interval secara signifikan.
                            </li>
                        </ul>
                    </section>

                    <!-- TROUBLESHOOTING -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            🛠️ Pemecahan Masalah
                        </h3>
                        <ul class="list-disc ps-5 space-y-3">
                            <li>
                                <strong
                                    >Klien menunjukkan "Belum diinisialisasi"
                                    atau tidak ada printer terdaftar</strong
                                ><br />
                                Layanan cetak Python lokal (<code
                                    >server.py</code
                                >) kemungkinan tidak berjalan. Mulai dengan
                                <code>python server.py</code>
                                (atau jalankan file <code>.exe</code> yang telah
                                dikompilasi), kemudian klik
                                <strong>Segarkan Status</strong>.
                            </li>
                            <li>
                                <strong
                                    >Pengambilan data mengembalikan array kosong
                                    padahal pekerjaan ada di DB</strong
                                ><br />
                                Periksa bahwa rute <code>listAuto</code> mengembalikan
                                data yang benar dan bahwa sesi autentikasi masih valid.
                                Buka DevTools → Network dan periksa respons dari panggilan
                                API cetak-otomatis.
                            </li>
                            <li>
                                <strong
                                    >Berkas animasi bergerak tetapi tidak ada
                                    yang tercetak</strong
                                ><br />
                                Tahap render/unggah selesai tetapi printer menolak
                                pekerjaan. Verifikasi bahwa nama printer yang dipilih
                                cocok dengan printer tingkat OS secara tepat (peka
                                huruf besar/kecil pada beberapa sistem). Periksa juga
                                log SumatraPDF di <code>tmp/print_jobs/</code>.
                            </li>
                            <li>
                                <strong
                                    >Beberapa proses tumpang tindih / penghitung
                                    terus bertambah</strong
                                ><br />
                                Ini terjadi jika <code>taskIsRunning</code>
                                tidak pernah direset ke <code>false</code>
                                (misalnya kesalahan terjadi sebelum
                                <code>onAnimationComplete</code> akhir dipicu). Segarkan
                                halaman untuk mereset status, atau tambahkan blok
                                try/catch di dalam callback penyelesaian berkas.
                            </li>
                            <li>
                                <strong>Berkas animasi tidak terlihat</strong
                                ><br />
                                Berkas memerlukan kontainer yang terpasang (<code
                                    >containerRef</code
                                >) dan kedua
                                <code>fromRef</code> / <code>toRef</code> tidak
                                boleh null saat animasi dimulai. Jika elemen
                                tersembunyi atau dirender secara kondisional,
                                mereka mungkin tidak terikat tepat waktu.
                                Periksa konsol browser untuk peringatan
                                <em>"ref is null"</em>
                                dari
                                <code>AnimatedBeam.svelte</code>.
                            </li>
                        </ul>
                    </section>

                    <!-- DEVELOPER NOTES -->
                    <section class="space-y-2">
                        <h3
                            class="font-semibold text-base text-gray-900 border-b pb-1"
                        >
                            👨‍💻 Catatan Pengembang
                        </h3>
                        <ul class="list-disc ps-5 space-y-2">
                            <li>
                                <strong>Kontrak API</strong> —
                                <code>fetchingDataFunction()</code>
                                mengharapkan server mengembalikan
                                <code>application/json</code>
                                dengan array tingkat atas. Setiap elemen harus
                                mencakup minimal <code>id</code> dan bidang yang diperlukan
                                oleh renderer label. Sesuaikan fungsi ini jika skema
                                Anda berbeda.
                            </li>
                            <li>
                                <strong
                                    >Mengekstrak alur kerja ke komponen anak</strong
                                >
                                — jika Anda memindahkan diagram berkas ke
                                <code>DataFetcher.svelte</code>, ekspor
                                <code>webTask()</code> dan gunakan
                                <code>bind:this</code>
                                di halaman ini untuk memanggilnya dari callback
                                interval, contoh:
                                <code
                                    >callback: () =&gt;
                                    dataFetcherRef?.webTask?.()</code
                                >.
                            </li>
                            <li>
                                <strong>Durasi animasi vs interval</strong> —
                                <code>durationAnimation</code>
                                saat ini di-hardcode ke <code>2</code> dtk. Jika
                                Anda menurunkan interval di bawah ~4 dtk,
                                pertimbangkan untuk menurunkan durasi dari
                                interval (<code
                                    >Math.min(intervalSetting / 1000 * 0.3, 5)</code
                                >) sehingga berkas selalu selesai sebelum proses
                                berikutnya dimulai.
                            </li>
                            <li>
                                <strong>Reset status saat kesalahan</strong> —
                                tambahkan blok <code>try/finally</code>
                                di dalam <code>webTask()</code> yang menetapkan
                                <code>taskIsRunning = false</code>
                                tanpa syarat sehingga proses yang gagal tidak pernah
                                mengunci penjadwal.
                            </li>
                            <li>
                                <strong>Tipe TypeScript</strong> —
                                <code>databaseData</code>
                                diberi tipe
                                <code>any[]</code>. Ganti dengan antarmuka yang
                                tepat setelah skema API selesai untuk
                                mendapatkan keamanan tipe penuh di seluruh alur
                                kerja.
                            </li>
                            <li>
                                <strong>Seluler</strong> — berkas animasi
                                disembunyikan pada viewport lebih kecil dari
                                <code>sm</code> (640 px). Alur kerja tetap berjalan;
                                hanya visual yang ditiadakan. Bungkus berkas dalam
                                blok Svelte yang sadar media-query jika Anda memerlukan
                                visibilitas seluler.
                            </li>
                        </ul>
                    </section>
                </div>
            </CardContent>
        </CardRoot>

        <CardRoot>
            <CardHeader>
                <CardTitle class="text-center mt-4 text-xl font-bold"
                    >Render Label</CardTitle
                >
                <CardDescription class="text-center mb-4">
                    Rendering view for Label Print (to be implemented)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="w-full h-full">
                    <AutoRender bind:data={dataBind} bind:ref={labelContainer} />
                </div>
            </CardContent>
        </CardRoot>
    </div>
</Navbar>
