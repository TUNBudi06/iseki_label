<script lang="ts">
    import { Button } from '$shadcn/components/ui/button';
    import A4Sheet from '$lib/print/A4Sheet.svelte';
    import { tick } from 'svelte';

    const kecilSizeMM = 20; //however this label width this heigh can contain 2 label
    const rackSizeMM = 45;
    const palletSizeMM = 140;
    const heightA4MM = 273; // we parse the content size base on safe content of A4Sheet

    let { data = $bindable(), ref = $bindable() } = $props();

    let labels = $derived.by(() => {
        if (!data) return [];
        let newData = [];
        let currentData = [];

        if (typeof data === 'object') {
            currentData = Object.values(data).flat();
        } else {
            currentData = data;
        }

        for (let item of currentData) {
            let itemRow = {
                rack_code: item.rack_list?.rack_no,
                label_type: item.label_type,
                id_label: item.id,
                item_code: item.rack_list?.item_code ?? null,
                type_tractor: item.rack_list?.type_tractor ?? null,
                quantity: item.quantity,
                item_name: item.rack_list?.part_name ?? null,
                sample: item.rack_list?.sample ?? null,
                vendor: item.rack_list?.supplier ?? null,
                hydrolist: item.rack_list?.part_hydrolis ?? null,
                label_size: item.label_size,
            };

            if (item.label_type === 'kecil') itemRow.label_size = kecilSizeMM;
            else if (item.label_type === 'besar')
                itemRow.label_size = rackSizeMM;
            else if (item.label_type === 'pallet')
                itemRow.label_size = palletSizeMM;

            if (item.quantity >= 2) {
                for (let i = 0; i < item.quantity; i++) {
                    newData.push(itemRow);
                }
            } else {
                newData.push(itemRow);
            }
        }

        return newData;
    });
    // $inspect(labels)

    let sheets = $derived.by(() => {
        let newSheets = [];
        if (labels.length === 0) return newSheets;

        let currentSheet = [];
        let currentHeight = 0;
        let current_label = labels;

        while (current_label.length > 0) {
            let label = current_label.shift();
            if (!label) continue;

            if (currentHeight + label.label_size <= heightA4MM) {
                currentSheet.push(label);
                if (label.label_size == kecilSizeMM) {
                    // if the label is kecil we can fit 2 in one row, so we check if the next label is also kecil and can fit in the same row
                    let next_label = current_label.findIndex(
                        (l) => l.label_size === kecilSizeMM,
                    );
                    if (next_label !== -1) {
                        currentSheet.push(current_label[next_label]);
                        current_label.splice(next_label, 1); // remove the next label from the list
                    }
                }
                currentHeight += label.label_size;
            } else {
                newSheets.push(currentSheet);
                currentSheet = [label];
                currentHeight = label.label_size;
            }
        }
        if (currentSheet.length > 0) {
            newSheets.push(currentSheet);
        }

        return newSheets;
    });

    $inspect(sheets);

    // New: Download single A4 page as PDF
    async function singlePage(index: number) {
        try {
            if (!ref) return;
            // Ensure DOM is updated
            await tick();
            await new Promise((r) => setTimeout(r, 150));

            const pages = Array.from(ref.querySelectorAll('.A4-print-page')) as HTMLElement[];
            const pageEl = pages[index];
            if (!pageEl) throw new Error('Page not found');

            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import('html2canvas-pro'),
                import('jspdf')
            ]);

            const canvas = await html2canvas(pageEl, {
                scale: 3,
                useCORS: true,
                logging: false,
                width: pageEl.offsetWidth,
                height: pageEl.offsetHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));

            pdf.save(`autoprint-page-${index + 1}.pdf`);
        } catch (err) {
            console.error('Failed to generate single page PDF', err);
        }
    }
</script>

<div class="space-y-6 w-full">
    <div
        bind:this={ref}
        class="w-full bg-pink-300/60 pt-20 pb-10 items-center flex flex-col gap-y-6 z-0 overflow-x-auto"
    >
        {#each sheets as sheet, index (index)}
            <div
                class="w-[210mm] max-w-full mx-auto px-6 md:px-0 space-y-2 pb-10"
            >
                <A4Sheet {sheet} class="A4-print-page A4-{index}" />
                <div class="flex gap-2 mt-2 px-2">
                    <Button on:click={() => singlePage(index)} class="whitespace-nowrap">Download page</Button>
                </div>
                <!--                <Button class="w-full" onclick={() => singlePage('A4-' + index)}-->
                <!--                >Download This Page Only</Button-->
                <!--                >-->
            </div>
        {/each}
    </div>
</div>
