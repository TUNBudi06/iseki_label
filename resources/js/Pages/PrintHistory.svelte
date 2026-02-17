<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import * as Table from '$shadcn/components/ui/table/index.ts';
    import * as Card from '$shadcn/components/ui/card/index.ts';
    import { Button } from '$shadcn/components/ui/button';
    import { Link, router } from '@inertiajs/svelte';
    import {
        Datatable,
        TableHandler,
        RowCount,
        Pagination,
    } from '@vincjo/datatables';
    import { onMount } from 'svelte';
    import {assetUrl} from "@tunbudi06/inertia-route-helper";
    import { toast } from 'svelte-sonner';

    // Interface matching backend QueueLabelPrint model
    interface HistoryItem {
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
        rack_list?: any;
    }

    // Props from backend
    let { historyData = [] } = $props<{
        historyData?: HistoryItem[];
    }>();

    // Local state for reactive updates
    let localHistoryData = $state<HistoryItem[]>([...historyData]);

    // Sync props with local state when backend data changes
    $effect(() => {
        localHistoryData = [...historyData];
    });

    const handler = new TableHandler<HistoryItem>([], {
        rowsPerPage: 10,
        highlight: true
    });

    $effect(() => {
        handler.setRows(localHistoryData);
    });

    let searchQuery = handler.createSearch(['rack_code', 'requested_by', 'area_name']);
    let selectedIds = $state<number[]>([]);
    let isDeleting = $state(false);
    let isPrinting = $state(false);

    // Statistics - computed from local data
    let totalPrinted = $derived(localHistoryData.length);
    let printedToday = $derived(
        localHistoryData.filter(h => {
            const printDate = new Date(h.updated_at).toDateString();
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
        if (selectedIds.length === localHistoryData.length) {
            selectedIds = [];
        } else {
            selectedIds = localHistoryData.map((h) => h.id);
        }
    }

    // Reprint selected
    async function reprintSelected() {
        if (selectedIds.length === 0) {
            toast.error('Pilih minimal 1 label untuk di-reprint!');
            return;
        }

        const confirm = window.confirm(
            `Reprint ${selectedIds.length} label yang dipilih?`,
        );
        if (!confirm) return;

        isPrinting = true;

        try {
            const response = await fetch('/api/print-history/reprint-multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Open print page in new window
                window.open(data.printUrl, '_blank');
                selectedIds = [];
            } else {
                toast.error(data.message || 'Gagal reprint label');
            }
        } catch (error) {
            console.error('Reprint failed:', error);
            toast.error('Gagal reprint label. Silakan coba lagi.');
        } finally {
            isPrinting = false;
        }
    }

    // Reprint single
    async function reprintSingle(id: number) {
        isPrinting = true;

        try {
            const response = await fetch(`/api/print-history/reprint/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Open print page in new window
                window.open(data.printUrl, '_blank');
            } else {
                toast.error(data.message || 'Gagal reprint label');
            }
        } catch (error) {
            console.error('Reprint failed:', error);
            toast.error('Gagal reprint label. Silakan coba lagi.');
        } finally {
            isPrinting = false;
        }
    }

    // Delete from history
    async function deleteFromHistory(id: number) {
        const confirm = window.confirm('Hapus item ini dari history?');
        if (!confirm) return;

        isDeleting = true;

        try {
            const response = await fetch(`/api/print-history/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Remove from local state
                localHistoryData = localHistoryData.filter((h) => h.id !== id);
                selectedIds = selectedIds.filter((i) => i !== id);
            } else {
                toast.error(data.message || 'Gagal menghapus label');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus label. Silakan coba lagi.');
        } finally {
            isDeleting = false;
        }
    }

    // Delete multiple
    async function deleteSelected() {
        if (selectedIds.length === 0) {
            toast.error('Pilih minimal 1 item untuk dihapus!');
            return;
        }

        const confirm = window.confirm(
            `Hapus ${selectedIds.length} item dari history?`,
        );
        if (!confirm) return;

        isDeleting = true;

        try {
            const response = await fetch('/api/print-history/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Remove from local state
                localHistoryData = localHistoryData.filter((h) => !selectedIds.includes(h.id));
                selectedIds = [];
            } else {
                toast.error(data.message || 'Gagal menghapus label');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus label. Silakan coba lagi.');
        } finally {
            isDeleting = false;
        }
    }

    // Refresh data
    function refreshData() {
        router.reload({ only: ['historyData', 'printedToday', 'totalPrinted'] });
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
                                disabled={isPrinting}
                                size="sm"
                                class="bg-green-600 hover:bg-green-700"
                            >
                                {isPrinting
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
                                <Table.Head>Rack Code</Table.Head>
                                <Table.Head>Requested By</Table.Head>
                                <Table.Head class="text-center"
                                    >Quantity</Table.Head
                                >
                                <Table.Head>Label Type</Table.Head>
                                <Table.Head>Waktu Request</Table.Head>
                                <Table.Head>Waktu Print</Table.Head>
                                <Table.Head>Area</Table.Head>
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
                                        {@html item.rack_code}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700"
                                            >
                                                {@html item.requested_by
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </span>
                                            <span>{@html item.requested_by}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="text-center">
                                        <span
                                            class="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-800"
                                        >
                                            {item.quantity}x
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="text-sm capitalize">{item.label_type}</span>
                                    </Table.Cell>
                                    <Table.Cell class="text-sm text-gray-600">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString('id-ID')}
                                    </Table.Cell>
                                    <Table.Cell class="text-sm">
                                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ✅ {new Date(
                                                item.updated_at,
                                            ).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell class="text-sm text-gray-600">
                                        {item.area_name || '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div class="flex gap-1 justify-center">
                                            <Button
                                                onclick={() =>
                                                    reprintSingle(item.id)}
                                                disabled={isPrinting || isDeleting}
                                                size="sm"
                                                class="bg-green-600 hover:bg-green-700"
                                                title="Reprint label ini"
                                            >
                                                🖨️
                                            </Button>
                                            <Button
                                                onclick={() =>
                                                    deleteFromHistory(item.id)}
                                                disabled={isPrinting || isDeleting}
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

