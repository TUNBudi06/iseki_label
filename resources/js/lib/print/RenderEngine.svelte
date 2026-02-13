<script lang="ts">
    import {Button} from "$shadcn/components/ui/button";
    import A4Sheet from "$lib/print/A4Sheet.svelte";
    import jsPDF from "jspdf";
    import html2canvas from "html2canvas-pro";

    let { sheets,ids} = $props();

    let isGenerating = $state(false);

    async function singlePage(id: string) {
        const element = document.querySelector("."+id) as HTMLElement;
        if (!element) return;
        isGenerating = true;

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = 297; // A4 height in mm
            const canvas = await html2canvas(element, {
                scale: 3, // High quality
                useCORS: true,
                logging: false,
                width: element.offsetWidth,
                height: element.offsetHeight,
            });

            const imgData = canvas.toDataURL('image/png');

            // Calculate dimensions to fit A4
            const canvasWidth = imgWidth;
            const canvasHeight = (canvas.height * imgWidth) / canvas.width;

            // Add image to current PDF page
            pdf.addImage(
                imgData,
                'PNG',
                0,
                0,
                canvasWidth,
                Math.min(canvasHeight, imgHeight),
            );

            // Download PDF with timestamp
            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, '-')
                .slice(0, -5);
            pdf.save(`iseki-labels-${sheets.length}pages-${timestamp}.pdf`);

            alert(`PDF generated successfully with ${sheets.length} pages!`);
        } catch (error) {
            console.error('Error generating multi-page PDF:', error);
            alert('Error generating PDF. Check console for details.');
        } finally {
            isGenerating = false;
        }
    }

</script>
<div class="space-y-6 w-full">
    <div class="flex justify-between">
        <Button>Download PDF</Button>
    </div>
    <div class="w-full bg-pink-300/60 pt-20 pb-10 items-center flex flex-col gap-y-6 z-0 overflow-x-scroll">
        {#each sheets as sheet, index (index)}
            <div class="w-[210mm] max-w-full mx-auto px-6 md:px-0  space-y-2 pb-10">
                <A4Sheet sheet={sheet.labels} class="A4-print-page A4-{index}"/>
                <Button class="w-full" onclick={()=>singlePage("A4-"+index)}>Download This Page</Button>
            </div>
        {/each}
    </div>
</div>
