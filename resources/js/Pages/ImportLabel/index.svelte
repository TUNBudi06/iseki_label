<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import { Button } from '$shadcn/components/ui/button';
    import * as Card from '$shadcn/components/ui/card/index.js';
    import { Input } from '$shadcn/components/ui/input';
    import { Label } from '$shadcn/components/ui/label';
    import * as Select from '$shadcn/components/ui/select/index.js';
    import { Checkbox } from '$shadcn/components/ui/checkbox';
    import * as Table from '$shadcn/components/ui/table/index.js';
    import { useForm } from '@inertiajs/svelte';
    import { page } from '@inertiajs/svelte';
    import { toast } from 'svelte-sonner';
    import {
        Trash2,
        Plus,
        Upload,
        FileDown,
        ClipboardList,
        Search,
        CheckCircle,
    } from '@lucide/svelte';
    import { routeUrl } from '@tunbudi06/inertia-route-helper';
    import { store as storeRoute, importExcel as importExcelRoute, template as templateRoute } from '$routes/import-label/index.ts';
    import { searchRack as searchRackRoute } from '$routes/api/import-label/index.ts';
    import {formatCode10} from "$lib/print/text/text-formatter.ts";

    // Suppress unused namespace warnings
    const _t = Table;
    void _t;

    // ── Types ─────────────────────────────────────────────────────────────────
    interface RackSuggestion {
        id: number;
        rack_no: string;
        item_code: string;
        part_name: string | null;
        type_tractor: string | null;
    }

    interface BasketItem {
        rack_code: string;
        label_type: 'kecil' | 'besar' | 'pallet';
        quantity: number;
        requested_by: string;
        area_name: string;
        urgent: boolean;
        auto_print: boolean;
        rack_info: RackSuggestion | null;
    }

    // ── Shared props ──────────────────────────────────────────────────────────
    const currentUser = $derived(($page.props.user as { name: string } | null) ?? null);

    // ── Tab ───────────────────────────────────────────────────────────────────
    let activeTab = $state<'manual' | 'excel'>('manual');

    // ── Autocomplete ──────────────────────────────────────────────────────────
    let searchQuery = $state('');
    let suggestions = $state<RackSuggestion[]>([]);
    let showSuggestions = $state(false);
    let isSearching = $state(false);
    let selectedRack = $state<RackSuggestion | null>(null);
    let searchTimeout: ReturnType<typeof setTimeout>;

    function onSearchInput() {
        clearTimeout(searchTimeout);
        selectedRack = null;

        if (searchQuery.length < 2) {
            suggestions = [];
            showSuggestions = false;
            return;
        }

        isSearching = true;
        searchTimeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    routeUrl(searchRackRoute({ query: { q: searchQuery } })),
                    { headers: { 'X-Requested-With': 'XMLHttpRequest' } },
                );
                suggestions = await res.json();
                showSuggestions = suggestions.length > 0;
            } catch {
                suggestions = [];
                showSuggestions = false;
            } finally {
                isSearching = false;
            }
        }, 300);
    }

    function selectRack(rack: RackSuggestion) {
        selectedRack = rack;
        searchQuery = rack.rack_no;
        suggestions = [];
        showSuggestions = false;
    }

    function clearRack() {
        selectedRack = null;
        searchQuery = '';
        suggestions = [];
        showSuggestions = false;
    }

    // ── Current item form state ───────────────────────────────────────────────
    let currentLabelType = $state<'kecil' | 'besar' | 'pallet'>('besar');
    let currentQuantity = $state(1);
    let currentRequestedBy = $state(currentUser?.name ?? '');
    let currentAreaName = $state('');
    let currentUrgent = $state(false);
    let currentAutoPrint = $state(false);

    // ── Basket ────────────────────────────────────────────────────────────────
    let basket = $state<BasketItem[]>([]);

    function addToBasket() {
        if (!selectedRack) {
            toast.error('Pilih rack code terlebih dahulu dari dropdown');
            return;
        }
        if (!currentRequestedBy.trim()) {
            toast.error('Nama requester wajib diisi');
            return;
        }
        if (currentQuantity < 1) {
            toast.error('Quantity minimal 1');
            return;
        }

        const rackLabel = selectedRack.rack_no;

        basket = [
            ...basket,
            {
                rack_code: selectedRack.rack_no,
                label_type: currentLabelType,
                quantity: currentQuantity,
                requested_by: currentRequestedBy.trim(),
                area_name: currentAreaName.trim(),
                urgent: currentUrgent,
                auto_print: currentAutoPrint,
                rack_info: selectedRack,
            },
        ];

        // Reset per-item fields, keep requester & area for convenience
        clearRack();
        currentQuantity = 1;
        currentUrgent = false;
        currentAutoPrint = false;

        toast.success(`${rackLabel} ditambahkan ke keranjang`);
    }

    function removeFromBasket(index: number) {
        basket = basket.filter((_, i) => i !== index);
    }

    // ── Manual submit ─────────────────────────────────────────────────────────
    const manualForm = useForm<{ items: BasketItem[] }>({ items: [] });

    function submitBasket() {
        if (basket.length === 0) {
            toast.error('Keranjang kosong. Tambahkan label terlebih dahulu.');
            return;
        }

        const count = basket.length;
        $manualForm.items = basket;
        $manualForm.post(routeUrl(storeRoute()), {
            onSuccess: () => {
                basket = [];
                toast.success(`${count} label berhasil ditambahkan ke queue!`);
            },
            onError: (errors: Record<string, string>) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError ?? 'Gagal menyimpan label');
            },
        });
    }

    // ── Excel submit ──────────────────────────────────────────────────────────
    const excelForm = useForm<{
        file: File | null;
        requested_by: string;
        label_type: 'kecil' | 'besar' | 'pallet';
        auto_print: boolean;
    }>({
        file: null,
        requested_by: currentUser?.name ?? '',
        label_type: 'besar',
        auto_print: false,
    });

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files?.[0]) {
            $excelForm.file = target.files[0];
        }
    }

    function submitExcel() {
        if (!$excelForm.file) {
            toast.error('Pilih file Excel terlebih dahulu');
            return;
        }
        if (!$excelForm.requested_by.trim()) {
            toast.error('Nama requester wajib diisi');
            return;
        }

        $excelForm.post(routeUrl(importExcelRoute()), {
            forceFormData: true,
            onSuccess: () => {
                $excelForm.reset();
                toast.success('Import Excel berhasil! Label ditambahkan ke queue.');
            },
            onError: (errors: Record<string, string>) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError ?? 'Import gagal');
            },
        });
    }

    function downloadTemplate() {
        window.location.href = routeUrl(templateRoute());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    const labelTypeColors: Record<string, string> = {
        kecil: 'bg-green-100 text-green-800',
        besar: 'bg-blue-100 text-blue-800',
        pallet: 'bg-purple-100 text-purple-800',
    };

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<Navbar>
    <div class="space-y-6">
        <!-- Header -->
        <div>
            <h1 class="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <ClipboardList class="size-6 text-pink-600" />
                Request / Import Label
            </h1>
            <p class="mt-1 text-sm text-slate-500">
                Tambahkan label ke antrian cetak secara manual atau melalui file Excel
            </p>
        </div>

        <!-- Tab Switch -->
        <div class="flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
            <button
                type="button"
                onclick={() => (activeTab = 'manual')}
                class="rounded-md px-4 py-2 text-sm font-medium transition-colors
                    {activeTab === 'manual'
                    ? 'bg-white text-pink-700 shadow'
                    : 'text-slate-600 hover:text-slate-900'}"
            >
                ✍️ Input Manual
            </button>
            <button
                type="button"
                onclick={() => (activeTab = 'excel')}
                class="rounded-md px-4 py-2 text-sm font-medium transition-colors
                    {activeTab === 'excel'
                    ? 'bg-white text-pink-700 shadow'
                    : 'text-slate-600 hover:text-slate-900'}"
            >
                📊 Import Excel
            </button>
        </div>

        <!-- ── MANUAL TAB ─────────────────────────────────────────────────── -->
        {#if activeTab === 'manual'}
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- Input Form -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Tambah Label ke Keranjang</Card.Title>
                        <Card.Description>
                            Cari rack code, atur detail, lalu klik <strong>Tambah</strong>.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <!-- Rack Code Autocomplete -->
                        <div class="grid gap-2">
                            <Label>
                                Rack Code <span class="text-destructive">*</span>
                            </Label>
                            <div class="relative">
                                <Search
                                    class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                                />
                                <Input
                                    placeholder="Ketik rack no / item code / part name..."
                                    bind:value={searchQuery}
                                    oninput={onSearchInput}
                                    onfocus={() => {
                                        if (suggestions.length) showSuggestions = true;
                                    }}
                                    onblur={() =>
                                        setTimeout(() => (showSuggestions = false), 150)}
                                    class="pl-9 {selectedRack
                                        ? 'border-green-500 bg-green-50'
                                        : ''}"
                                />
                                {#if isSearching}
                                    <span
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                                        >⏳</span
                                    >
                                {:else if selectedRack}
                                    <button
                                        type="button"
                                        onclick={clearRack}
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        ✕
                                    </button>
                                {/if}

                                <!-- Dropdown suggestions -->
                                {#if showSuggestions}
                                    <div
                                        class="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg"
                                    >
                                        {#each suggestions as rack (rack.id)}
                                            <button
                                                type="button"
                                                onmousedown={() => selectRack(rack)}
                                                class="w-full border-b border-slate-100 px-3 py-2 text-left transition-colors last:border-0 hover:bg-pink-50"
                                            >
                                                <div
                                                    class="font-mono text-sm font-semibold text-pink-900"
                                                >
                                                    {rack.rack_no} + {formatCode10(rack.item_code)}
                                                </div>
                                                <div class="truncate text-xs text-slate-500">
                                                    {rack.part_name ?? rack.item_code}
                                                    {#if rack.type_tractor}
                                                        · {rack.type_tractor}
                                                    {/if}
                                                </div>
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <!-- Selected rack info card -->
                            {#if selectedRack}
                                <div
                                    class="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm"
                                >
                                    <div class="flex items-center gap-1 font-semibold text-green-800">
                                        <CheckCircle class="size-4" />
                                        {selectedRack.rack_no}
                                    </div>
                                    <div class="mt-0.5 text-green-700">
                                        {selectedRack.part_name ?? '-'} · {selectedRack.item_code}
                                    </div>
                                    {#if selectedRack.type_tractor}
                                        <div class="text-xs text-green-600">
                                            {selectedRack.type_tractor}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Label Type & Quantity -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="grid gap-2">
                                <Label>Tipe Label <span class="text-destructive">*</span></Label>
                                <Select.Root bind:value={currentLabelType} type="single">
                                    <Select.Trigger class="w-full">
                                        {capitalize(currentLabelType)}
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="kecil">Kecil</Select.Item>
                                        <Select.Item value="besar">Besar</Select.Item>
                                        <Select.Item value="pallet">Pallet</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </div>
                            <div class="grid gap-2">
                                <Label>Quantity <span class="text-destructive">*</span></Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="999"
                                    bind:value={currentQuantity}
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        <!-- Requested By -->
                        <div class="grid gap-2">
                            <Label>
                                Requested By <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                bind:value={currentRequestedBy}
                                placeholder="Nama requester..."
                            />
                        </div>

                        <!-- Area -->
                        <div class="grid gap-2">
                            <Label>Area / Lokasi</Label>
                            <Input
                                bind:value={currentAreaName}
                                placeholder="Contoh: Line A, Gudang 2..."
                            />
                        </div>

                        <!-- Flags -->
                        <div class="flex gap-6">
                            <div class="flex items-center gap-2">
                                <Checkbox bind:checked={currentUrgent} id="chk-urgent" />
                                <Label for="chk-urgent" class="cursor-pointer font-medium text-red-700"
                                    >🔥 Urgent</Label
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Checkbox
                                    bind:checked={currentAutoPrint}
                                    id="chk-autoprint"
                                />
                                <Label
                                    for="chk-autoprint"
                                    class="cursor-pointer font-medium text-blue-700"
                                    >🖨️ Auto Print</Label
                                >
                            </div>
                        </div>

                        <Button
                            onclick={addToBasket}
                            disabled={!selectedRack}
                            class="w-full bg-pink-600 hover:bg-pink-700"
                        >
                            <Plus class="mr-2 size-4" />
                            Tambah ke Keranjang
                        </Button>
                    </Card.Content>
                </Card.Root>

                <!-- Basket -->
                <Card.Root>
                    <Card.Header>
                        <div class="flex items-center justify-between">
                            <div>
                                <Card.Title>Keranjang</Card.Title>
                                <Card.Description>
                                    {basket.length} item siap dikirim ke queue
                                </Card.Description>
                            </div>
                            {#if basket.length > 0}
                                <Button
                                    onclick={submitBasket}
                                    disabled={$manualForm.processing}
                                    class="bg-pink-600 hover:bg-pink-700"
                                >
                                    {#if $manualForm.processing}
                                        ⏳ Menyimpan...
                                    {:else}
                                        ✅ Submit ({basket.length})
                                    {/if}
                                </Button>
                            {/if}
                        </div>
                    </Card.Header>
                    <Card.Content>
                        {#if basket.length === 0}
                            <div
                                class="flex flex-col items-center justify-center py-12 text-slate-400"
                            >
                                <ClipboardList class="mb-3 size-12 opacity-30" />
                                <p class="text-sm">Belum ada item di keranjang</p>
                                <p class="mt-1 text-xs">Tambahkan label dari form di kiri</p>
                            </div>
                        {:else}
                            <div class="max-h-[420px] space-y-2 overflow-auto pr-1">
                                {#each basket as item, i (i)}
                                    <div
                                        class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-pink-50"
                                    >
                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center gap-1.5">
                                                <span
                                                    class="font-mono text-sm font-bold text-pink-900"
                                                >
                                                    {item.rack_code}
                                                </span>
                                                <span
                                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {labelTypeColors[
                                                        item.label_type
                                                    ]}"
                                                >
                                                    {item.label_type.toUpperCase()}
                                                </span>
                                                {#if item.urgent}
                                                    <span
                                                        class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800"
                                                    >
                                                        🔥 URGENT
                                                    </span>
                                                {/if}
                                                {#if item.auto_print}
                                                    <span
                                                        class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                                                    >
                                                        🖨️ AUTO
                                                    </span>
                                                {/if}
                                            </div>
                                            <div class="mt-0.5 truncate text-xs text-slate-500">
                                                {item.rack_info?.part_name ?? ''} · Qty: {item.quantity}
                                                · By: {item.requested_by}
                                                {#if item.area_name}
                                                    · {item.area_name}
                                                {/if}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onclick={() => removeFromBasket(i)}
                                            class="shrink-0 text-slate-400 transition-colors hover:text-red-600"
                                        >
                                            <Trash2 class="size-4" />
                                        </button>
                                    </div>
                                {/each}
                            </div>

                            <!-- Summary -->
                            <div
                                class="mt-4 rounded-md border border-pink-100 bg-pink-50 p-3 text-sm text-pink-800"
                            >
                                <div class="flex justify-between">
                                    <span>Total item:</span>
                                    <strong>{basket.length}</strong>
                                </div>
                                <div class="flex justify-between">
                                    <span>Total quantity:</span>
                                    <strong
                                        >{basket.reduce((s, i) => s + i.quantity, 0)}</strong
                                    >
                                </div>
                            </div>
                        {/if}
                    </Card.Content>
                </Card.Root>
            </div>

        <!-- ── EXCEL TAB ──────────────────────────────────────────────────── -->
        {:else}
            <div class="max-w-xl">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Import dari Excel</Card.Title>
                        <Card.Description>
                            Upload file Excel berisi daftar rack code untuk ditambahkan ke queue.
                            Kolom wajib: <code class="rounded bg-slate-100 px-1 text-xs"
                                >rack_no</code
                            >.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <!-- Template Download -->
                        <div
                            class="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-3"
                        >
                            <div class="text-sm text-blue-800">
                                <strong>Butuh template?</strong> Download contoh file Excel dengan
                                format yang benar.
                            </div>
                            <Button variant="outline" size="sm" onclick={downloadTemplate}>
                                <FileDown class="mr-1 size-4" />
                                Template
                            </Button>
                        </div>

                        <!-- File Input -->
                        <div class="grid gap-2">
                            <Label>File Excel <span class="text-destructive">*</span></Label>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onchange={handleFileChange}
                                class="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-pink-700 hover:file:bg-pink-100"
                            />
                            {#if $excelForm.errors.file}
                                <p class="text-sm text-destructive">{$excelForm.errors.file}</p>
                            {/if}
                        </div>

                        <!-- Default Requested By -->
                        <div class="grid gap-2">
                            <Label>
                                Default Requested By <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                bind:value={$excelForm.requested_by}
                                placeholder="Nama requester default..."
                            />
                            {#if $excelForm.errors.requested_by}
                                <p class="text-sm text-destructive">
                                    {$excelForm.errors.requested_by}
                                </p>
                            {/if}
                            <p class="text-xs text-slate-500">
                                Digunakan jika kolom
                                <code class="rounded bg-slate-100 px-1">requested_by</code> kosong
                                di Excel.
                            </p>
                        </div>

                        <!-- Default Label Type -->
                        <div class="grid gap-2">
                            <Label>
                                Default Tipe Label <span class="text-destructive">*</span>
                            </Label>
                            <Select.Root bind:value={$excelForm.label_type} type="single">
                                <Select.Trigger class="w-full">
                                    {capitalize($excelForm.label_type)}
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="kecil">Kecil</Select.Item>
                                    <Select.Item value="besar">Besar</Select.Item>
                                    <Select.Item value="pallet">Pallet</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            {#if $excelForm.errors.label_type}
                                <p class="text-sm text-destructive">
                                    {$excelForm.errors.label_type}
                                </p>
                            {/if}
                            <p class="text-xs text-slate-500">
                                Digunakan jika kolom
                                <code class="rounded bg-slate-100 px-1">label_type</code> kosong di
                                Excel.
                            </p>
                        </div>

                        <!-- Auto Print -->
                        <div class="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                            <Checkbox
                                bind:checked={$excelForm.auto_print}
                                id="excel-chk-autoprint"
                            />
                            <div>
                                <Label for="excel-chk-autoprint" class="cursor-pointer font-medium text-blue-700">
                                    🖨️ Auto Print
                                </Label>
                                <p class="text-xs text-slate-500 mt-0.5">
                                    Semua label hasil import akan langsung masuk ke antrian auto print.
                                </p>
                            </div>
                        </div>

                        <!-- Column Format Guide -->
                        <div
                            class="space-y-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
                        >
                            <p class="font-semibold text-slate-700">Format Kolom Excel:</p>
                            <div class="grid grid-cols-2 gap-1">
                                <span
                                    ><code class="rounded border bg-white px-1">rack_no</code> —
                                    <strong>wajib</strong></span
                                >
                                <span
                                    ><code class="rounded border bg-white px-1">label_type</code> —
                                    opsional</span
                                >
                                <span
                                    ><code class="rounded border bg-white px-1">quantity</code> —
                                    opsional</span
                                >
                                <span
                                    ><code class="rounded border bg-white px-1">requested_by</code>
                                    — opsional</span
                                >
                                <span
                                    ><code class="rounded border bg-white px-1">area_name</code> —
                                    opsional</span
                                >
                                <span
                                    ><code class="rounded border bg-white px-1">urgent</code> —
                                    YES / NO</span
                                >
                            </div>
                            <p class="mt-1 text-slate-400">
                                Rack yang tidak ditemukan di database akan dilewati.
                            </p>
                        </div>

                        <Button
                            onclick={submitExcel}
                            disabled={$excelForm.processing}
                            class="w-full bg-pink-600 hover:bg-pink-700"
                        >
                            {#if $excelForm.processing}
                                <span class="mr-2">⏳</span> Mengimport...
                            {:else}
                                <Upload class="mr-2 size-4" />
                                Import Excel
                            {/if}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </div>
        {/if}
    </div>
</Navbar>







