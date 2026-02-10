<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import * as Table from '$shadcn/components/ui/table/index.ts';
    import * as Card from '$shadcn/components/ui/card/index.ts';
    import { Button } from '$shadcn/components/ui/button';
    import { Link } from '@inertiajs/svelte';
    import {
        Datatable,
        TableHandler,
        RowCount,
        Pagination,
    } from '@vincjo/datatables';
    import { onMount } from 'svelte';
    import {assetUrl} from "@tunbudi06/inertia-route-helper";

    // Sample data - nanti diganti dengan fetch dari API
    // HANYA data dengan status 'printed' yang ditampilkan di sini
    interface HistoryItem {
        id: number;
        rackNo: string;
        requestBy: string;
        jumlah: number;
        tipe: string;
        status: string;
        createdAt: string;
        printedAt: string;
        printedBy: string;
        priority: string;
    }

    let historyData = $state<HistoryItem[]>([
        {
            id: 3,
            rackNo: 'BB-B456',
            requestBy: 'Bob Wilson',
            jumlah: 3,
            tipe: 'Rack Kecil',
            status: 'printed',
            createdAt: '2026-02-10 07:45:00',
            printedAt: '2026-02-10 08:00:00',
            printedBy: 'Admin User',
            priority: 'normal',
        },
        {
            id: 6,
            rackNo: 'EE-E345',
            requestBy: 'David Lee',
            jumlah: 12,
            tipe: 'Pallet Assy',
            status: 'printed',
            createdAt: '2026-02-10 06:30:00',
            printedAt: '2026-02-10 07:15:00',
            printedBy: 'Admin User',
            priority: 'high',
        },
        {
            id: 7,
            rackNo: 'FF-F678',
            requestBy: 'Emma Wilson',
            jumlah: 7,
            tipe: 'Rack Assy',
            status: 'printed',
            createdAt: '2026-02-10 05:00:00',
            printedAt: '2026-02-10 06:45:00',
            printedBy: 'Admin User',
            priority: 'normal',
        },
        {
            id: 8,
            rackNo: 'GG-G901',
            requestBy: 'Frank Miller',
            jumlah: 20,
            tipe: 'Pallet Assy',
            status: 'printed',
            createdAt: '2026-02-09 22:30:00',
            printedAt: '2026-02-10 05:30:00',
            printedBy: 'Admin User',
            priority: 'urgent',
        },
        {
            id: 9,
            rackNo: 'HH-H234',
            requestBy: 'Grace Taylor',
            jumlah: 4,
            tipe: 'Rack Kecil',
            status: 'printed',
            createdAt: '2026-02-09 21:00:00',
            printedAt: '2026-02-10 04:00:00',
            printedBy: 'Admin User',
            priority: 'normal',
        },
    ]);

    const handler = new TableHandler<HistoryItem>([], {
        rowsPerPage: 10,
        highlight: true
    });
    $effect(() => {
        handler.setRows(historyData);
    });

    let searchQuery = handler.createSearch(['rackNo', 'requestBy', 'printedBy']);
    let selectedIds = $state<number[]>([]);
    let isDeleting = $state(false);

    // Statistics
    let totalPrinted = $derived(historyData.length);
    let printedToday = $derived(
        historyData.filter(h => {
            const printDate = new Date(h.printedAt).toDateString();
            const today = new Date().toDateString();
            return printDate === today;
        }).length
    );

    // Toggle select
    function toggleSelect(id: number) {
        if (selectedIds.includes(id)) {
            selectedIds = selectedIds.filter((i) => i !== id);
        } else {
            selectedIds = [...selectedIds, id];
        }
    }

    // Select all
    function toggleSelectAll() {
        if (selectedIds.length === historyData.length) {
            selectedIds = [];
        } else {
            selectedIds = historyData.map((h) => h.id);
        }
    }

    // Reprint selected
    async function reprintSelected() {
        if (selectedIds.length === 0) {
            alert('Pilih minimal 1 label untuk di-reprint!');
            return;
        }

        const confirm = window.confirm(
            `Reprint ${selectedIds.length} label yang dipilih?`,
        );
        if (!confirm) return;

        isDeleting = true;

        console.log('Reprinting labels:', selectedIds);

        // TODO: Implement PDF generation untuk reprint
        await new Promise((resolve) => setTimeout(resolve, 2000));

        selectedIds = [];
        isDeleting = false;
        alert('Label berhasil di-reprint!');
    }

    // Reprint single
    async function reprintSingle(id: number) {
        isDeleting = true;

        console.log('Reprinting single label:', id);

        // TODO: Implement PDF generation untuk 1 label
        await new Promise((resolve) => setTimeout(resolve, 1000));

        isDeleting = false;
        alert('Label berhasil di-reprint!');
    }

    // Delete from history
    function deleteFromHistory(id: number) {
        const confirm = window.confirm('Hapus item ini dari history?');
        if (!confirm) return;

        historyData = historyData.filter((h) => h.id !== id);
        selectedIds = selectedIds.filter((i) => i !== id);
    }

    // Delete multiple
    async function deleteSelected() {
        if (selectedIds.length === 0) {
            alert('Pilih minimal 1 item untuk dihapus!');
            return;
        }

        const confirm = window.confirm(
            `Hapus ${selectedIds.length} item dari history?`,
        );
        if (!confirm) return;

        isDeleting = true;

        // TODO: Send ke API untuk delete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        historyData = historyData.filter((h) => !selectedIds.includes(h.id));
        selectedIds = [];
        isDeleting = false;
    }

    // Refresh data
    async function refreshData() {
        console.log('Refreshing history data...');
        // TODO: Fetch dari API - hanya ambil yang status 'printed'
        // const response = await fetch('/api/queue-label-prints?status=printed');
        // historyData = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('History data refreshed.');
    }

    onMount(() => {
        // Auto refresh setiap 30 detik
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    });
</script>

<Navbar>
    <div class="container mx-auto p-6 space-y-6">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-green-900">
                    📜 Print History
                </h1>
                <p class="text-gray-600 mt-1">
                    Riwayat label yang sudah dicetak
                </p>
            </div>
            <div class="flex gap-2">
                <Link href={assetUrl('')}>
                    <Button variant="outline" size="sm">
                        ← Kembali ke Queue
                    </Button>
                </Link>
                <Button onclick={refreshData} variant="outline" size="sm">
                    🔄 Refresh
                </Button>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Total Printed Today -->
            <Card.Root class="border-2 border-green-300">
                <Card.Content class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">
                                Dicetak Hari Ini
                            </p>
                            <h3 class="text-3xl font-bold text-green-600">
                                {printedToday}
                            </h3>
                        </div>
                        <div
                            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                        >
                            <span class="text-2xl">📅</span>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Total in History -->
            <Card.Root>
                <Card.Content class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">
                                Total History
                            </p>
                            <h3 class="text-3xl font-bold text-gray-900">
                                {totalPrinted}
                            </h3>
                        </div>
                        <div
                            class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
                        >
                            <span class="text-2xl">📚</span>
                        </div>
                    </div>
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
                            placeholder="🔍 Cari rack no, request by, printed by..."
                            bind:value={searchQuery.value}
                            oninput={() => searchQuery.set()}
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2 flex-wrap items-center">
                        {#if selectedIds.length > 0}
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                {selectedIds.length} selected
                            </span>
                            <Button
                                onclick={reprintSelected}
                                disabled={isDeleting}
                                size="sm"
                                class="bg-green-600 hover:bg-green-700"
                            >
                                {isDeleting
                                    ? '⏳ Processing...'
                                    : `🖨️ Reprint (${selectedIds.length})`}
                            </Button>
                            <Button
                                onclick={deleteSelected}
                                disabled={isDeleting}
                                size="sm"
                                variant="destructive"
                            >
                                {isDeleting
                                    ? '⏳ Deleting...'
                                    : `🗑️ Delete (${selectedIds.length})`}
                            </Button>
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- History Table -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="text-xl font-bold flex items-center gap-2">
                    <span>✅</span> Printed Labels History
                </Card.Title>
                <Card.Description>
                    Daftar label yang sudah berhasil dicetak
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <Datatable table={handler}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row class="bg-green-50">
                                <Table.Head class="w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length ===
                                            totalPrinted && totalPrinted > 0}
                                        onchange={toggleSelectAll}
                                        class="w-4 h-4 accent-green-600"
                                    />
                                </Table.Head>
                                <Table.Head class="w-16 text-center"
                                    >#</Table.Head
                                >
                                <Table.Head>Rack No</Table.Head>
                                <Table.Head>Request By</Table.Head>
                                <Table.Head class="text-center"
                                    >Jumlah</Table.Head
                                >
                                <Table.Head>Tipe Label</Table.Head>
                                <Table.Head>Waktu Request</Table.Head>
                                <Table.Head>Waktu Print</Table.Head>
                                <Table.Head>Printed By</Table.Head>
                                <Table.Head class="text-center"
                                    >Actions</Table.Head
                                >
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each handler.rows as item, index (item.id)}
                                <Table.Row
                                    class="hover:bg-green-50 transition-colors {selectedIds.includes(
                                        item.id,
                                    )
                                        ? 'bg-green-50'
                                        : ''}"
                                >
                                    <Table.Cell>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(
                                                item.id,
                                            )}
                                            onchange={() =>
                                                toggleSelect(item.id)}
                                            class="w-4 h-4 accent-green-600"
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        class="text-center text-gray-500 font-mono"
                                    >
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell class="font-bold text-green-900">
                                        {@html item.rackNo}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700"
                                            >
                                                {@html item.requestBy
                                                    .split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')}
                                            </span>
                                            <span>{@html item.requestBy}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="text-center">
                                        <span
                                            class="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-800"
                                        >
                                            {item.jumlah}x
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="text-sm">{item.tipe}</span>
                                    </Table.Cell>
                                    <Table.Cell class="text-sm text-gray-600">
                                        {new Date(
                                            item.createdAt,
                                        ).toLocaleString('id-ID')}
                                    </Table.Cell>
                                    <Table.Cell class="text-sm">
                                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ✅ {new Date(
                                                item.printedAt,
                                            ).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell class="text-sm text-gray-600">
                                        {item.printedBy}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div class="flex gap-1 justify-center">
                                            <Button
                                                onclick={() =>
                                                    reprintSingle(item.id)}
                                                disabled={isDeleting}
                                                size="sm"
                                                class="bg-green-600 hover:bg-green-700"
                                                title="Reprint label ini"
                                            >
                                                🖨️
                                            </Button>
                                            <Button
                                                onclick={() =>
                                                    deleteFromHistory(item.id)}
                                                size="sm"
                                                variant="destructive"
                                                title="Hapus dari history"
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

        <!-- Info Footer -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
                <span class="text-2xl">ℹ️</span>
                <div>
                    <h4 class="font-semibold text-green-900 mb-1">
                        Informasi:
                    </h4>
                    <ul class="text-sm text-green-800 space-y-1">
                        <li>
                            • <strong>Reprint</strong> - Cetak ulang label yang sudah pernah dicetak
                        </li>
                        <li>
                            • <strong>Delete</strong> - Hapus dari history (tidak mempengaruhi data asli)
                        </li>
                        <li>
                            • History akan disimpan untuk audit trail dan tracking
                        </li>
                        <li>• Data akan auto-refresh setiap 30 detik</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</Navbar>

