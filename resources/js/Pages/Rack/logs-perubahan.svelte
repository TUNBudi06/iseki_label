<!-- resources/js/Pages/LoggerPerubahan/Index.svelte -->
<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import { Button } from '$shadcn/components/ui/button';
    import * as Card from '$shadcn/components/ui/card/index.js';
    import * as Dialog from '$shadcn/components/ui/dialog/index.js';
    import { Input } from '$shadcn/components/ui/input';
    import { Label } from '$shadcn/components/ui/label';
    import * as Field from '$shadcn/components/ui/field/index.js';
    import * as Select from '$shadcn/components/ui/select/index.js';
    import { router, useForm } from '@inertiajs/svelte';
    import * as Table from '$shadcn/components/ui/table/index.js';
    import {
        TableHandler,
        Pagination,
        RowCount,
        Datatable,
    } from '@vincjo/datatables';
    import { Trash2, History, Search, X, AlertTriangle } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import {routeUrl} from "@tunbudi06/inertia-route-helper";
    import {logDestroy, logIndex} from "$routes/logger-perubahan";

    // @ts-ignore
    let _ = Card;
    _ = Dialog;
    // @ts-ignore
    _ = Table;
    // @ts-ignore
    _ = Select;
    // @ts-ignore
    _ = Field;

    let { logs } = $props();

    type Log = {
        id: number;
        no_rack: string;
        before: string;
        after: string;
        description: string | null;
        created_at: string;
        updated_at: string;
    };

    // Dialog state for bulk delete
    let deleteDialogOpen = $state(false);
    let logToDelete = $state<Log | null>(null);

    const table = new TableHandler([], {
        rowsPerPage: 25,
        highlight: true,
    });

    // Search form
    const searchForm = useForm({
        no_rack: '',
        date_from: '',
        date_to: '',
    });

    onMount(() => {
        table.setRows(logs);
    });

    // Reactive update when logs change
    $effect(() => {
        table.setRows(logs);
    });

    const globalSearch = table.createSearch(['no_rack', 'before', 'after', 'description']);

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function openDeleteDialog(log: Log) {
        logToDelete = log;
        deleteDialogOpen = true;
    }

    function closeDeleteDialog() {
        logToDelete = null;
        deleteDialogOpen = false;
    }

    const deleteForm = useForm({
        id: 0,
    });

    function confirmDelete() {
        if (!logToDelete) return;

        $deleteForm.id = logToDelete.id;
        $deleteForm.delete(routeUrl(logDestroy({id:logToDelete.id})), {
            onSuccess() {
                toast.success('Log deleted successfully!');
                closeDeleteDialog();
                router.reload({ only: ['logs'] });
            },
            onError(errors) {
                toast.error('Failed to delete log');
                console.warn('Delete log errors', errors);
            },
        });
    }

    function handleSearch() {
        $searchForm.get(routeUrl(logIndex()), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function clearSearch() {
        $searchForm.reset();
        $searchForm.get(routeUrl(logIndex()), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function getChangeType(before: string, after: string): { label: string; class: string } {
        if (!before && after) return { label: 'New', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
        if (before && !after) return { label: 'Removed', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
        return { label: 'Changed', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
    }
</script>

<Navbar>
    <div class="mx-auto max-w-7xl p-4 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <History class="w-6 h-6" />
                    Change Log History
                </h2>
                <p class="text-sm text-muted-foreground mt-1">
                    Track and manage item code changes for rack locations.
                </p>
            </div>
        </div>

        <!-- Search & Filter Card -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="text-sm font-medium">Filter Logs</Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Field.Field>
                        <Field.Label>Rack No</Field.Label>
                        <Input
                            type="text"
                            placeholder="e.g., SX-A264"
                            bind:value={$searchForm.no_rack}
                        />
                    </Field.Field>

                    <Field.Field>
                        <Field.Label>Date From</Field.Label>
                        <Input
                            type="date"
                            bind:value={$searchForm.date_from}
                        />
                    </Field.Field>

                    <Field.Field>
                        <Field.Label>Date To</Field.Label>
                        <Input
                            type="date"
                            bind:value={$searchForm.date_to}
                        />
                    </Field.Field>

                    <div class="flex items-end gap-2">
                        <Button onclick={handleSearch} class="gap-2">
                            <Search class="w-4 h-4" />
                            Search
                        </Button>
                        <Button variant="outline" onclick={clearSearch}>
                            <X class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Data Table Card -->
        <Card.Root>
            <Card.Header>
                <div class="flex items-center justify-between">
                    <Field.Field class="w-72">
                        <Field.Label>Quick Search:</Field.Label>
                        <Input
                            type="text"
                            placeholder="Search rack no, item codes..."
                            bind:value={globalSearch.value}
                            oninput={() => globalSearch.set()}
                        />
                    </Field.Field>
                    <span class="text-sm text-muted-foreground">
                        Total: {table.rowCount.total} entries
                    </span>
                </div>
            </Card.Header>
            <Card.Content class="p-0">
                <Datatable {table}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row class="hover:bg-transparent">
                                <Table.Head class="w-16">ID</Table.Head>
                                <Table.Head>Rack No</Table.Head>
                                <Table.Head>Before (Old Item)</Table.Head>
                                <Table.Head>After (New Item)</Table.Head>
                                <Table.Head class="w-32">Type</Table.Head>
                                <Table.Head class="w-40">Date</Table.Head>
                                <Table.Head class="w-20 text-right">Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as log (log.id)}
                                <Table.Row class="group">
                                    <Table.Cell class="font-mono text-sm text-muted-foreground">
                                        #{log.id}
                                    </Table.Cell>
                                    <Table.Cell class="font-medium">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {log.no_rack}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="line-through text-muted-foreground text-sm" title="Previous item code">
                                            {log.before || '-'}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="font-medium text-sm text-green-600 dark:text-green-400" title="New item code">
                                            {log.after || '-'}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {@const changeType = getChangeType(log.before, log.after)}
                                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium {changeType.class}">
                                            {changeType.label}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell class="text-muted-foreground text-sm">
                                        {formatDate(log.created_at)}
                                    </Table.Cell>
                                    <Table.Cell class="text-right">
                                        <div class="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                class="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onclick={() => openDeleteDialog(log)}
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {:else}
                                <Table.Row>
                                    <Table.Cell colspan="7" class="text-center py-8 text-muted-foreground">
                                        No change logs found.
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>

                    {#snippet footer()}
                        <div class="flex items-center w-full justify-between px-4 py-3 border-t">
                            <span class="text-sm text-muted-foreground">
                                Showing {table.rowCount.start} to {table.rowCount.end} of {table.rowCount.total} entries
                            </span>
                            <Pagination {table} />
                        </div>
                    {/snippet}
                </Datatable>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog.Root bind:open={deleteDialogOpen}>
        <Dialog.Content class="sm:max-w-md">
            <Dialog.Header>
                <Dialog.Title class="flex items-center gap-2 text-destructive">
                    <AlertTriangle class="w-5 h-5" />
                    Delete Log Entry
                </Dialog.Title>
                <Dialog.Description>
                    Are you sure you want to delete this change log? This action cannot be undone.
                </Dialog.Description>
            </Dialog.Header>

            {#if logToDelete}
                <div class="py-4 space-y-3">
                    <div class="rounded-lg border p-3 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Rack No:</span>
                            <span class="font-medium">{logToDelete.no_rack}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Change:</span>
                            <span class="font-medium">{logToDelete.before} → {logToDelete.after}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Date:</span>
                            <span class="text-muted-foreground">{formatDate(logToDelete.created_at)}</span>
                        </div>
                    </div>
                </div>
            {/if}

            <Dialog.Footer class="gap-2">
                <Button variant="outline" onclick={closeDeleteDialog}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onclick={confirmDelete}
                    disabled={$deleteForm.processing}
                >
                    {#if $deleteForm.processing}
                        <span class="mr-2">⏳</span>
                        Deleting...
                    {:else}
                        <Trash2 class="w-4 h-4 mr-2" />
                        Delete Log
                    {/if}
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</Navbar>
