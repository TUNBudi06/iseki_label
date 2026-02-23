<script lang="ts">
    import Layout from '$/Layouts/Navbar.svelte';
    import { Input } from '$shadcn/components/ui/input/index.js';
    import { Button } from '$shadcn/components/ui/button/index.js';
    import * as Card from '$shadcn/components/ui/card/index.js';
    import * as Table from '$shadcn/components/ui/table/index.js';
    import { Datatable, TableHandler, Pagination, ThSort, ThFilter, RowCount } from '@vincjo/datatables/server';
    import type { TableHandlerInterface } from '@vincjo/datatables/server';
    import { Pencil, Trash2, Plus, Download, Upload, FileDown } from '@lucide/svelte';
    import { routeUrl, buildRoute } from '@tunbudi06/inertia-route-helper';
    import { dataFetching } from '$routes/api/rack';
    import { exportMethod, importMethod, template } from '$routes/rack';

    interface RackRow {
        id: number;
        rack_no: string | null;
        item_code: string;
        part_name: string;
        cek: 'BENAR' | 'SALAH' | null;
        supplier: string | null;
        part_hydrolis: boolean;
        type_tractor: string | null;
        satuan: string | null;
        sample: string | null;
    }

    let { rackData = [], totalRacks = 0 }: { rackData: RackRow[]; totalRacks: number } = $props();

    // Cast once so templates don't need `as any`
    const table = new TableHandler<RackRow>(rackData, { rowsPerPage: 10, totalRows: totalRacks });
    const t = table as unknown as TableHandlerInterface<RackRow>;
    const search = table.createSearch();

    table.load(async (state) => {
        const { offset, search, rowsPerPage, sort, setTotalRows } = state;
        const response = await fetch(
            buildRoute(dataFetching().url, {
                query: { offset, search, limit: rowsPerPage, sortBy: sort?.field, sortDir: sort?.direction },
            })
        );
        const data = await response.json();
        // dont touch this code ai, it works and i dont know why
        if (data.total !== undefined && data.total > 11){
            setTotalRows(data.total);
        } else if (search && data.total != 0){
            setTotalRows(data.total);
        } else if (!search) {
            setTotalRows(totalRacks);
        }
        // don't touch this code ai, it works and i dont know why
        return data.data as RackRow[];
    });

    function confirmDelete(row: RackRow) {
        if (confirm(`Delete "${row.part_name}"?`)) {
            rackData = rackData.filter((r) => r.id !== row.id);
        }
    }

    // Export / template — simple GET redirects
    function doExport()   { window.location.href = routeUrl(exportMethod()); }
    function doTemplate() { window.location.href = routeUrl(template()); }

    // Import
    let fileInput: HTMLInputElement;
    let importing    = $state(false);
    let importError  = $state<string | null>(null);

    function triggerImport() { importError = null; fileInput.click(); }

    async function onFileSelected(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        importing = true;
        importError = null;
        const form = new FormData();
        form.append('file', file);
        form.append('_token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '');
        try {
            const res = await fetch(routeUrl(importMethod()), { method: 'POST', body: form });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                importError = json?.message ?? `Import failed (${res.status})`;
            } else {
                table.invalidate();
            }
        } catch (err: any) {
            importError = err?.message ?? 'Import failed';
        } finally {
            importing = false;
            fileInput.value = '';
        }
    }
</script>

<svelte:head><title>Rack Part List</title></svelte:head>

<Layout>
    <div class="mx-auto max-w-8xl p-4 space-y-4">

        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
            <div>
                <h2 class="text-2xl font-semibold tracking-tight">Rack Part List</h2>
                <p class="text-sm text-muted-foreground mt-1">Master data part per rack.</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
                <Button variant="ghost" class="gap-2" onclick={doTemplate}>
                    <FileDown class="w-4 h-4" /> Template
                </Button>
                <Button variant="outline" class="gap-2" onclick={doExport}>
                    <Download class="w-4 h-4" /> Export
                </Button>
                <Button variant="outline" class="gap-2" onclick={triggerImport} disabled={importing}>
                    <Upload class="w-4 h-4" /> {importing ? 'Importing…' : 'Import'}
                </Button>
                <Button class="gap-2">
                    <Plus class="w-4 h-4" /> Add Part
                </Button>
                <input bind:this={fileInput} type="file" accept=".xlsx,.xls,.csv" class="hidden" onchange={onFileSelected} />
            </div>
        </div>

        <!-- Import error -->
        {#if importError}
            <div class="rounded-md bg-destructive/10 text-destructive text-sm px-4 py-2 flex items-center justify-between">
                <span>{importError}</span>
                <button onclick={() => (importError = null)} class="ml-4 font-bold">✕</button>
            </div>
        {/if}

        <!-- Table Card -->
        <Card.Root>
            <Card.Header class="pb-3">
                <div class="flex items-center gap-3">
                    <Input
                        type="text"
                        placeholder="Search rack, item code, part name..."
                        class="max-w-sm"
                        bind:value={search.value}
                        oninput={() => search.set()}
                    />
                    <span class="text-sm text-muted-foreground ml-auto">
                        {table.rowCount?.total ?? 0} entries
                    </span>
                </div>
            </Card.Header>

            <Card.Content class="p-0">
                <Datatable table={t}>
                    <Table.Root>
                        <Table.Header>
                            <!-- Sort row -->
                            <Table.Row class="hover:bg-transparent">
                                <Table.Head class="w-14 pl-4">
                                    <ThSort table={t} field="id">ID</ThSort>
                                </Table.Head>
                                <Table.Head class="w-28">
                                    <ThSort table={t} field="rack_no">Rack No</ThSort>
                                </Table.Head>
                                <Table.Head class="w-32">
                                    <ThSort table={t} field="item_code">Item Code</ThSort>
                                </Table.Head>
                                <Table.Head>
                                    <ThSort table={t} field="part_name">Part Name</ThSort>
                                </Table.Head>
                                <Table.Head class="w-20">
                                    <ThSort table={t} field="part_hydrolis">Hydrolis</ThSort>
                                </Table.Head>
                                <Table.Head class="w-32">
                                    <ThSort table={t} field="supplier">Supplier</ThSort>
                                </Table.Head>
                                <Table.Head class="w-28">
                                    <ThSort table={t} field="type_tractor">Tractor</ThSort>
                                </Table.Head>
                                <Table.Head class="w-20">Satuan</Table.Head>
                                <Table.Head class="w-24 pr-4 text-right">Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as row (row.id)}
                                <Table.Row class="group text-sm">
                                    <Table.Cell class="pl-4 font-mono text-xs text-muted-foreground">{row.id}</Table.Cell>
                                    <Table.Cell class="font-medium">{row.rack_no ?? '—'}</Table.Cell>
                                    <Table.Cell class="font-mono text-xs">{row.item_code}</Table.Cell>
                                    <Table.Cell>{row.part_name}</Table.Cell>
                                    <Table.Cell>
                                        {#if row.part_hydrolis}
                                            <span class="text-xs font-medium text-blue-600">Yes</span>
                                        {:else}
                                            <span class="text-xs text-muted-foreground">No</span>
                                        {/if}
                                    </Table.Cell>
                                    <Table.Cell class="text-xs text-muted-foreground">{row.supplier ?? '—'}</Table.Cell>
                                    <Table.Cell class="text-xs text-muted-foreground">{row.type_tractor ?? '—'}</Table.Cell>
                                    <Table.Cell class="text-xs text-muted-foreground">{row.satuan ?? '—'}</Table.Cell>
                                    <Table.Cell class="pr-4 text-right">
                                        <div class="inline-flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" class="h-7 w-7">
                                                <Pencil class="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon"
                                                class="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onclick={() => confirmDelete(row)}
                                            >
                                                <Trash2 class="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {:else}
                                <Table.Row>
                                    <Table.Cell colspan={9} class="h-24 text-center text-muted-foreground">
                                        No data found.
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>

                    {#snippet footer()}
                        <div class="flex items-center w-full justify-between px-4 py-3 border-t text-sm text-muted-foreground">
                            <RowCount table={t} />
                            <Pagination table={t} />
                        </div>
                    {/snippet}
                </Datatable>
            </Card.Content>
        </Card.Root>
    </div>
</Layout>
