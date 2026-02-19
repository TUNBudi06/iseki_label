<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import * as Table from '$shadcn/components/ui/table/index.ts';
    import * as Card from '$shadcn/components/ui/card/index.ts';

    // Reference imports to avoid static-analyzer false-positive about unused namespace imports
    // (these are intentionally no-op; markup already uses <Table.*> and <Card.*>)
    const _shadcnTable = Table;
    const _shadcnCard = Card;
    // no-op use to satisfy static analyzer
    void _shadcnTable;
    void _shadcnCard;

    import { Button } from '$shadcn/components/ui/button';
    import { Link } from '@inertiajs/svelte';
    import { BookmarkCheck } from '@lucide/svelte';
    import {
        Datatable,
        TableHandler,
        RowCount,
        Pagination,
    } from '@vincjo/datatables';
    import { onMount } from 'svelte';
    import { autoPrint, history as UrlHistory, label } from '$routes/print';
    import { routeUrl } from '@tunbudi06/inertia-route-helper';
    import { router } from '@inertiajs/core';
    import { toast } from 'svelte-sonner';
    import { destroy } from '$routes/api/queue-label-prints';
    import { markAsPrinted } from '$routes/home';
    import { useForm } from '@inertiajs/svelte';

    // Interface matching backend data structure
    interface QueueItem {
        id: number;
        rack_code: string;
        label_type: 'kecil' | 'besar' | 'pallet';
        quantity: number;
        requested_by: string;
        area_name: string;
        printed: boolean;
        urgent: boolean;
        created_at: string;
        updated_at: string;
        rack_list?: any; // RackPartList relationship
    }

    // Props from backend
    let {
        labelNotPrinted = [],
        totalLabelToday = 0,
        totalLabelPrinted = 0,
    } = $props();

    // Initialize local state from props - create a PLAIN ARRAY COPY
    // Backend sends object with numeric keys like {1: {...}, 2: {...}}, convert to array
    let queueData = $derived.by(function () {
        if (!labelNotPrinted) {
            return [];
        }
        // If it's already an array, use it
        if (Array.isArray(labelNotPrinted)) {
            return [...labelNotPrinted];
        }
        // If it's an object (like {1: {...}, 2: {...}}), convert to array
        if (typeof labelNotPrinted === 'object') {
            return Object.values(labelNotPrinted);
        }
        return [];
    });

    const handler = new TableHandler<QueueItem>([], {
        rowsPerPage: 10,
        highlight: true,
    });
    $effect(() => {
        handler.setRows(queueData);
    });

    let selectedIndexes = $state<number[]>([]); // Use index as identifier
    let searchQuery = handler.createSearch([
        'rack_code',
        'requested_by',
        'area_name',
    ]);
    let isPrinting = $state(false);

    // Statistics from props
    let totalToday = $derived(totalLabelToday);
    let pendingCount = $derived(queueData.length); // All data in queue are not printed
    let printedCount = $derived(totalLabelPrinted);

    // Toggle select by index
    function toggleSelect(index: number) {
        if (selectedIndexes.includes(index)) {
            selectedIndexes = selectedIndexes.filter((i) => i !== index);
        } else {
            selectedIndexes = [...selectedIndexes, index];
        }
    }

    // Select all
    function toggleSelectAll() {
        if (selectedIndexes.length === pendingCount) {
            selectedIndexes = [];
        } else {
            selectedIndexes = handler.rows.map((_, idx) => idx);
        }
    }

    // Print selected - update backend and refresh
    async function printSelected() {
        if (selectedIndexes.length === 0) {
            alert('Pilih minimal 1 label untuk di-print!');
            return;
        }

        isPrinting = true;

        try {
            // Get rack_codes for selected indexes
            const selectedRackCodes = selectedIndexes.map((item) => {
                return handler.rows[item].id;
            });

            router.visit(
                routeUrl(
                    label({
                        query: {
                            labels: JSON.stringify(selectedRackCodes),
                        },
                    }),
                ),
            );

            await new Promise((resolve) => setTimeout(resolve, 2000));

            await refreshData();
        } catch (error) {
            console.error('Print failed:', error);
            alert('Gagal print label. Silakan coba lagi.');
        } finally {
            isPrinting = false;
        }
    }

    // Print all pending
    async function printAllPending() {
        if (queueData.length === 0) {
            alert('Tidak ada label pending untuk di-print!');
            return;
        }

        const confirm = window.confirm(
            `Print semua ${queueData.length} label pending?`,
        );
        if (!confirm) return;

        selectedIndexes = handler.rows.map((_, idx) => idx);
        await printSelected();
    }

    // Print single by index
    async function printSingle(index: number) {
        isPrinting = true;

        try {
            // Get the label ID for selected index
            const labelId = handler.rows[index].id;

            // Redirect to print page with single label ID
            router.visit(
                routeUrl(
                    label({
                        query: {
                            labels: JSON.stringify([labelId]),
                        },
                    }),
                ),
            );

            // Wait a moment then refresh data
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await refreshData();

            toast.success('Label berhasil di-print!');
        } catch (error) {
            console.error('Print failed:', error);
            toast.error('Gagal print label. Silakan coba lagi.');
        } finally {
            isPrinting = false;
        }
    }

    // Delete by index
    async function deleteItem(index: number) {
        const confirm = window.confirm('Hapus item ini dari queue?');
        if (!confirm) return;

        try {
            const labelId = handler.rows[index].id;

            // Send delete request to backend
            const response = await fetch(routeUrl(destroy({ id: labelId })), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Refresh data from backend
                await refreshData();
            } else {
                toast.error(data.message || 'Gagal menghapus label');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus label. Silakan coba lagi.');
        }
    }

    // Refresh data from backend

    async function reloadOnly() {
        router.reload({
            only: ['labelNotPrinted', 'totalLabelToday', 'totalLabelPrinted'],
        });
    }
    async function refreshData() {
        console.log('Refreshing data...');
        await reloadOnly();
        toast.info('Data refreshed', { duration: 2000 });
    }

    // Helper function to get user initials
    function getInitials(name: string): string {
        return name
            .split(' ', 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }

    onMount(() => {
        // Auto refresh setiap 30 detik
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    });

    const markForm = useForm({
        id: 0,
    });
    function markDone(index: number) {
        $markForm.id = handler.rows[index].id;
        $markForm.post(routeUrl(markAsPrinted()), {
            onSuccess: () => {
                toast.success('Label marked as printed!');
                reloadOnly();
            },
            onError: () => {
                toast.error('Failed to mark label as printed.');
            },
        });
    }

    // --- PDF Server Printing guide helpers (implements the commented block) ---
    // Default points to the local helper README in your workspace; adjust if needed.
    let pdfGuideUrl = $state('file:///D:/Budi/python-auto-printer/README.md');
    let startCommand = $state('python server.py');

    function openPdfGuide() {
        // attempt to open guide in a new tab/window; if browser blocks file:// you can use an online link
        try {
            window.open(pdfGuideUrl, '_blank');
        } catch (e) {
            toast.error(
                'Unable to open guide. Copy the guide URL and open it manually.',
            );
        }
    }

    async function copyStartCommand() {
        try {
            await navigator.clipboard.writeText(startCommand);
            toast.success('Start command copied to clipboard');
        } catch (e) {
            toast.error('Clipboard not available in this browser');
        }
    }

    // Helper: open autoprint page; prefer named route if available
    function openAutoPrintPage() {
        router.visit(routeUrl(autoPrint()));
    }
</script>

<Navbar>
    <div class="container mx-auto p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-pink-900">
                    Label Print Queue
                </h1>
                <p class="text-gray-600 mt-1">
                    Manage and print label requests from warehouse system
                </p>
            </div>
            <Button onclick={refreshData} variant="outline" size="sm">
                🔄 Refresh
            </Button>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Total Today -->
            <Card.Root>
                <Card.Content class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">
                                Total Request Hari Ini
                            </p>
                            <h3 class="text-3xl font-bold text-pink-900">
                                {totalToday}
                            </h3>
                        </div>
                        <div
                            class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center"
                        >
                            <span class="text-2xl">📋</span>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Pending -->
            <Card.Root class="border-2 border-pink-300">
                <Card.Content class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">
                                Pending Print
                            </p>
                            <h3 class="text-3xl font-bold text-orange-600">
                                {pendingCount}
                            </h3>
                        </div>
                        <div
                            class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
                        >
                            <span class="text-2xl">⏳</span>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Printed -->
            <Card.Root>
                <Card.Content class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">
                                Sudah Dicetak
                            </p>
                            <h3 class="text-3xl font-bold text-green-600">
                                {printedCount}
                            </h3>
                        </div>
                        <div
                            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                        >
                            <span class="text-2xl">✅</span>
                        </div>
                    </div>
                    <Link
                        href={routeUrl(UrlHistory())}
                        class="mt-3 inline-block text-sm text-pink-600 hover:underline font-medium"
                    >
                        📜 Lihat History Print Label &rarr;
                    </Link>
                </Card.Content>
            </Card.Root>
        </div>

        <!-- Actions & Search -->
        <Card.Root>
            <Card.Content class="p-4">
                <div
                    class="flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    <!-- Search -->
                    <div class="w-full md:w-96">
                        <input
                            type="text"
                            placeholder="🔍 Cari rack no, request by..."
                            bind:value={searchQuery.value}
                            oninput={() => searchQuery.set()}
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2 flex-wrap items-center">
                        {#if selectedIndexes.length > 0}
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                            >
                                {selectedIndexes.length} selected
                            </span>
                            <Button
                                onclick={printSelected}
                                disabled={isPrinting}
                                size="sm"
                                class="bg-pink-600 hover:bg-pink-700"
                            >
                                {isPrinting
                                    ? '⏳ Printing...'
                                    : `🖨️ Print Selected (${selectedIndexes.length})`}
                            </Button>
                        {/if}

                        <Button
                            onclick={printAllPending}
                            disabled={isPrinting || pendingCount === 0}
                            size="sm"
                            variant="default"
                        >
                            {isPrinting
                                ? '⏳ Printing...'
                                : `📄 Print All Pending (${pendingCount})`}
                        </Button>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!--        create card information and link about automatic printing which when get into reference page need a client or app PDFServerPrinting-->
        <!--        to make sure client is connected and can auto printing self but need standby laptop-->

        <!-- Queue Table -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="text-xl font-bold flex items-center gap-2">
                    <span>📝</span> Label Queue List
                </Card.Title>
                <Card.Description>
                    Daftar request pembuatan label dari sistem warehouse
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <Datatable table={handler}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row class="bg-pink-50">
                                <Table.Head class="w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIndexes.length ===
                                            pendingCount && pendingCount > 0}
                                        onchange={toggleSelectAll}
                                        class="w-4 h-4 accent-pink-600"
                                    />
                                </Table.Head>
                                <Table.Head class="w-16 text-center"
                                    >#</Table.Head
                                >
                                <Table.Head>Rack Code</Table.Head>
                                <Table.Head>Request By</Table.Head>
                                <Table.Head>Area Name</Table.Head>
                                <Table.Head class="text-center"
                                    >Quantity</Table.Head
                                >
                                <Table.Head>Label Type</Table.Head>
                                <Table.Head class="text-center"
                                    >Priority</Table.Head
                                >
                                <Table.Head>Created At</Table.Head>
                                <Table.Head class="text-center"
                                    >Actions</Table.Head
                                >
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each handler.rows as item, index (index)}
                                <Table.Row
                                    class="hover:bg-pink-50 transition-colors {selectedIndexes.includes(
                                        index,
                                    )
                                        ? 'bg-pink-50'
                                        : ''} {item.urgent
                                        ? 'border-l-4 border-l-red-500'
                                        : ''}"
                                >
                                    <Table.Cell>
                                        <input
                                            type="checkbox"
                                            checked={selectedIndexes.includes(
                                                index,
                                            )}
                                            onchange={() => toggleSelect(index)}
                                            class="w-4 h-4 accent-pink-600"
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        class="text-center text-gray-500 font-mono"
                                    >
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell class="font-bold text-pink-900">
                                        {item.rack_code}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-bold text-pink-700"
                                            >
                                                {getInitials(item.requested_by)}
                                            </span>
                                            <span>{item.requested_by}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="text-sm"
                                            >{item.area_name || '-'}</span
                                        >
                                    </Table.Cell>
                                    <Table.Cell class="text-center">
                                        <span
                                            class="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-800"
                                        >
                                            {item.quantity}x
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                            {item.label_type === 'pallet'
                                                ? 'bg-purple-100 text-purple-800'
                                                : item.label_type === 'besar'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : 'bg-green-100 text-green-800'}"
                                        >
                                            {item.label_type.toUpperCase()}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell class="text-center">
                                        {#if item.urgent}
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 animate-pulse"
                                            >
                                                🔥 URGENT
                                            </span>
                                        {:else}
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                            >
                                                Normal
                                            </span>
                                        {/if}
                                    </Table.Cell>
                                    <Table.Cell class="text-sm text-gray-600">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString('id-ID')}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div
                                            class="flex gap-1 gap-x-4 justify-center"
                                        >
                                            <Button
                                                onclick={() => markDone(index)}
                                                size="sm"
                                                variant="default"
                                                class="bg-green-600 hover:bg-green-700"
                                            >
                                                <BookmarkCheck />
                                            </Button>
                                            <Button
                                                onclick={() =>
                                                    printSingle(index)}
                                                disabled={isPrinting}
                                                size="sm"
                                                variant="default"
                                                class="bg-pink-600 hover:bg-pink-700"
                                            >
                                                🖨️
                                            </Button>
                                            <Button
                                                onclick={() =>
                                                    deleteItem(index)}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>

                    {#snippet footer()}
                        <div
                            class="flex items-center justify-between p-4 border-t"
                        >
                            <RowCount table={handler} />
                            <Pagination table={handler} />
                        </div>
                    {/snippet}
                </Datatable>
            </Card.Content>
        </Card.Root>

        <!-- Card: Automatic printing guide (compact, links to autoprint page) -->
        <Card.Root>
            <Card.Content class="p-4">
                <div
                    class="flex flex-col md:flex-row gap-4 items-start justify-between"
                >
                    <div class="flex-1">
                        <h4 class="text-lg font-semibold text-pink-900">
                            Automatic Printing
                        </h4>
                        <p class="text-sm text-gray-600 mt-1">
                            Fitur Automatic Printing mengirimkan job PDF
                            langsung ke aplikasi klien (PDFServerPrinting) yang
                            berjalan di mesin terdekat. Pastikan klien
                            dijalankan dan siap menerima job sebelum menggunakan
                            fitur ini.
                        </p>

                        <div class="mt-3 flex gap-2">
                            <Button
                                onclick={() => openAutoPrintPage()}
                                size="sm"
                                class="bg-pink-600 hover:bg-pink-700"
                                >➡️ Open AutoPrint Page</Button
                            >
                        </div>

                        <div class="mt-2 text-sm text-gray-700">
                            <div>
                                Note: AutoPrint page berisi panduan, status
                                koneksi, dan pengaturan host untuk klien
                                printing.
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-1/3 text-sm text-gray-700">
                        <h5 class="font-medium text-pink-900">Saran singkat</h5>
                        <ul class="list-disc pl-5 mt-2 space-y-1">
                            <li>
                                Jalankan PDF printing client pada mesin yang
                                terhubung ke printer.
                            </li>
                            <li>
                                Gunakan AutoPrint page untuk mengatur host dan
                                memantau koneksi.
                            </li>
                        </ul>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Info Footer -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
                <span class="text-2xl">ℹ️</span>
                <div>
                    <h4 class="font-semibold text-blue-900 mb-1">
                        Cara Menggunakan:
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>
                            • <strong>Checkbox</strong> - Pilih beberapa label untuk
                            di-print sekaligus
                        </li>
                        <li>
                            • <strong>Print Selected</strong> - Print label yang dipilih
                        </li>
                        <li>
                            • <strong>Print All Pending</strong> - Print semua label
                            yang belum dicetak
                        </li>
                        <li>
                            • <strong>🖨️ Button</strong> - Print 1 label saja
                        </li>
                        <li>• Data akan auto-refresh setiap 30 detik</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</Navbar>
