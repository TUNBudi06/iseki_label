<script lang="ts">
    import {Button} from "$shadcn/components/ui/button";
    import {dndzone} from "svelte-dnd-action";

    interface listRack {
        hydrolist:string
        item_code:string
        item_name:string
        label_type:string
        rack_code:string
        sample:string
        type_tractor: string
        vendor: string
    }

    let {data}: {
        data: {
            kecil: Array<listRack>;
            besar: Array<listRack>;
            pallet: Array<listRack>;
        };
    } = $props();

    const smallLabel = 10;
    const assyLabel = 6;
    const palletLabel = 2;

    // Helper function to split array into chunks
    function chunkArray<T>(arr: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    // Process all sheets using state
    let allSheets = $state<{ type: string; labels: (listRack & { id: string })[]; maxPerPage: number }[]>([]);

    $effect(() => {
        const sheets: { type: string; labels: (listRack & { id: string })[]; maxPerPage: number }[] = [];
        let globalIndex = 0; // Global counter for unique IDs

        // Process kecil labels
        if (data.kecil && data.kecil.length > 0) {
            const kecilSheets = chunkArray(data.kecil, smallLabel);
            kecilSheets.forEach(labels => {
                // Add unique id to each label for DnD using generated index
                const labelsWithId = labels.map(label => ({ ...label, id: `label-${globalIndex++}` }));
                sheets.push({ type: 'kecil', labels: labelsWithId, maxPerPage: smallLabel });
            });
        }

        // Process besar labels
        if (data.besar && data.besar.length > 0) {
            const besarSheets = chunkArray(data.besar, assyLabel);
            besarSheets.forEach(labels => {
                const labelsWithId = labels.map(label => ({ ...label, id: `label-${globalIndex++}` }));
                sheets.push({ type: 'besar', labels: labelsWithId, maxPerPage: assyLabel });
            });
        }

        // Process pallet labels
        if (data.pallet && data.pallet.length > 0) {
            const palletSheets = chunkArray(data.pallet, palletLabel);
            palletSheets.forEach(labels => {
                const labelsWithId = labels.map(label => ({ ...label, id: `label-${globalIndex++}` }));
                sheets.push({ type: 'pallet', labels: labelsWithId, maxPerPage: palletLabel });
            });
        }
        allSheets = sheets;
    });

    let sheetCount = $derived.by(() => allSheets.length);
    let newPageType = $state<'kecil' | 'besar' | 'pallet'>('kecil');

    // Handle DnD events for a specific page
    function handleDndConsider(pageIdx: number) {
        return (e: CustomEvent) => {
            allSheets[pageIdx].labels = e.detail.items;
        };
    }

    function handleDndFinalize(pageIdx: number) {
        return (e: CustomEvent) => {
            allSheets[pageIdx].labels = e.detail.items;
        };
    }

    // Add new empty page
    function addNewPage() {
        const maxPerPage = newPageType === 'kecil' ? smallLabel :
                          newPageType === 'besar' ? assyLabel :
                          palletLabel;

        allSheets = [...allSheets, {
            type: newPageType,
            labels: [],
            maxPerPage: maxPerPage
        }];
    }

    // Delete a page
    function deletePage(pageIdx: number) {
        if (confirm(`Delete Page ${pageIdx + 1}?`)) {
            allSheets = allSheets.filter((_, idx) => idx !== pageIdx);
        }
    }
    $inspect(allSheets)


</script>
<div class="w-full">
    <div class="flex gap-3 items-center justify-center my-4 flex-wrap">
        <Button>Print Now</Button>
        <span class="text-sm text-gray-600">Total Sheets: {sheetCount}</span>

        <div class="flex gap-2 items-center border-l pl-3 ml-3">
            <label for="pageType" class="text-sm font-medium">New Page Type:</label>
            <select
                id="pageType"
                bind:value={newPageType}
                class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
                <option value="kecil">Kecil (10 labels)</option>
                <option value="besar">Besar (6 labels)</option>
                <option value="pallet">Pallet (2 labels)</option>
            </select>
            <Button onclick={addNewPage} variant="outline" size="sm">
                ➕ Add Page
            </Button>
        </div>
    </div>
    <div class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10">
            {#each allSheets as sheet, pageIdx}
                <div class="border-2 border-gray-300 p-3 bg-white rounded-lg shadow-md">
                    <div class="mb-2 pb-2 border-b-2 border-gray-200 flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-bold text-center text-sm">
                                Page {pageIdx + 1} - {sheet.type.toUpperCase()}
                            </h3>
                            <p class="text-xs text-center text-gray-600">
                                {sheet.labels.length}/{sheet.maxPerPage} labels
                            </p>
                        </div>
                        <button
                            onclick={() => deletePage(pageIdx)}
                            class="text-red-500 hover:text-red-700 text-xs px-2 py-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete this page"
                        >
                            ✕
                        </button>
                    </div>
                    <div
                        use:dndzone={{
                            items: sheet.labels,
                            flipDurationMs: 300,
                            type: 'label-dndzone',
                            dropFromOthersDisabled: false
                        }}
                        onconsider={handleDndConsider(pageIdx)}
                        onfinalize={handleDndFinalize(pageIdx)}
                        class="min-h-25 min-w-full"
                    >
                        {#each sheet.labels as label (label.id)}
                            <div class="border-b last:border-0 p-2 hover:bg-gray-50 cursor-move transition-colors">
                                <p class="text-sm font-semibold text-blue-600">#{label.id}</p>
                                <p class="text-xs"><strong>Rack:</strong> {label.rack_code}</p>
                                <p class="text-xs"><strong>Item:</strong> {label.item_code}</p>
                                <p class="text-xs"><strong>Name:</strong> {label.item_name}</p>
                                <p class="text-xs"><strong>Vendor:</strong> {label.vendor}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
