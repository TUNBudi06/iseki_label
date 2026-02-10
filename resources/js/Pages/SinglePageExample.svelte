<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import RackAssyLabel from '$lib/print/RackAssyLabel.svelte';
    import A4Sheet from '$lib/print/A4Sheet.svelte';
    import PalletAssyLabel from '$lib/print/PalletAssyLabel.svelte';
    import RackKecilLabel from '$lib/print/RackKecilLabel.svelte';
    import { Button } from '$shadcn/components/ui/button';

    import html2canvas from 'html2canvas-pro';
    import jsPDF from 'jspdf';

    let printArea: HTMLDivElement | undefined = $state();
    let resultDiv: HTMLDivElement | undefined = $state();
    let isGenerating = $state(false);

    // Print sebagai PNG (existing function)
    function printAsPNG() {
        if (!printArea) return;

        isGenerating = true;
        const element = printArea;
        html2canvas(element, {
            scale: 1,
            width: element.offsetWidth,
            height: element.offsetHeight,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
        }).then((canvas) => {
            if (!resultDiv) return;
            // Clear previous result
            resultDiv.innerHTML = '';
            // Append new canvas
            resultDiv.appendChild(canvas);
            // download the image
            let url = canvas.toDataURL('image/png', 100);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'print.png';
            link.click();
            isGenerating = false;
        });
    }

    // Print sebagai PDF menggunakan jsPDF dengan support multi-page
    async function printAsPDF() {
        if (!printArea) return;

        isGenerating = true;

        try {
            const element = printArea;

            // Convert HTML to canvas dengan kualitas tinggi
            const canvas = await html2canvas(element, {
                scale: 3, // Kualitas tinggi untuk print
                useCORS: true,
                logging: false,
                width: element.offsetWidth,
                height: element.offsetHeight,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
            });

            // Ukuran A4 dalam mm dan pixels
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Buat PDF dengan ukuran A4
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // Calculate offset for next page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Download PDF dengan timestamp
            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, '-')
                .slice(0, -5);
            pdf.save(`iseki-label-${timestamp}.pdf`);

            // Optional: tampilkan preview di resultDiv
            if (resultDiv) {
                resultDiv.innerHTML = '';
                const previewImg = document.createElement('img');
                previewImg.src = imgData;
                previewImg.style.maxWidth = '100%';
                resultDiv.appendChild(previewImg);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Check console for details.');
        } finally {
            isGenerating = false;
        }
    }

    // Print Multiple A4 Sheets sebagai separate pages
    async function printMultipleSheets() {
        if (!printArea) return;

        isGenerating = true;

        try {
            // Cari semua A4Sheet elements di dalam printArea
            const sheets = printArea.querySelectorAll('.A4Sheet, [data-page]');

            if (sheets.length === 0) {
                // Fallback: gunakan printArea langsung
                await printAsPDF();
                return;
            }

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = 297; // A4 height in mm

            // Process setiap sheet
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i] as HTMLElement;

                // Convert each sheet to canvas
                const canvas = await html2canvas(sheet, {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    width: sheet.offsetWidth,
                    height: sheet.offsetHeight,
                });

                const imgData = canvas.toDataURL('image/png');

                // Add new page if not first page
                if (i > 0) {
                    pdf.addPage();
                }

                // Calculate dimensions to fit A4
                const canvasWidth = imgWidth;
                const canvasHeight = (canvas.height * imgWidth) / canvas.width;

                // Add image to PDF page
                pdf.addImage(
                    imgData,
                    'PNG',
                    0,
                    0,
                    canvasWidth,
                    Math.min(canvasHeight, imgHeight),
                );
            }

            // Download PDF
            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, '-')
                .slice(0, -5);
            pdf.save(`iseki-label-multipage-${timestamp}.pdf`);
        } catch (error) {
            console.error('Error generating multi-page PDF:', error);
            alert('Error generating PDF. Check console for details.');
        } finally {
            isGenerating = false;
        }
    }

    // Direct print (buka print dialog)
    async function directPrint() {
        if (!printArea) return;

        isGenerating = true;

        try {
            const element = printArea;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: element.offsetWidth,
                height: element.offsetHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');

            if (printWindow) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="id">
                    <head>
                        <title>Print Label</title>
                        <style>
                            @page {
                                size: A4;
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            img {
                                max-width: 100%;
                                height: auto;
                            }
                            @media print {
                                body { margin: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${imgData}" alt="ISEKI Label Print" onload="window.print();" />
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        } catch (error) {
            console.error('Error printing:', error);
            alert('Error printing. Check console for details.');
        } finally {
            isGenerating = false;
        }
    }
</script>

<Navbar>
    <div class="flex gap-2 flex-wrap">
        <Button onclick={printAsPDF} disabled={isGenerating}>
            {isGenerating ? '⏳ Generating...' : '📄 Single Page PDF'}
        </Button>
        <Button
            onclick={printMultipleSheets}
            disabled={isGenerating}
            variant="default"
        >
            {isGenerating ? '⏳ Generating...' : '📑 Multi-Page PDF'}
        </Button>
        <Button
            onclick={directPrint}
            disabled={isGenerating}
            variant="secondary"
        >
            {isGenerating ? '⏳ Printing...' : '🖨️ Print'}
        </Button>
        <Button onclick={printAsPNG} disabled={isGenerating} variant="outline">
            {isGenerating ? '⏳ Generating...' : '🖼️ Download PNG'}
        </Button>
    </div>

    <!--     Container untuk single page mode-->
    <A4Sheet
        bind:ref={printArea}
        class="gap-10 flex px-[6mm] py-[10mm] flex-col"
    >
        <RackAssyLabel type="0" timbangan="-" />
        <PalletAssyLabel type="SXG" />
        <div class="flex items-center justify-between">
            <RackKecilLabel />
            <RackKecilLabel />
        </div>
    </A4Sheet>

    <!-- Uncomment di bawah ini untuk demo multi-page -->
    <!--
<div bind:this={printArea} class="flex flex-col gap-4">
    <A4Sheet class="gap-10 flex px-[6mm] py-[10mm] flex-col A4Sheet" data-page="1">
        <h1 class="text-2xl font-bold">Page 1</h1>
        <RackAssyLabel type="0" timbangan="-" />
        <PalletAssyLabel type="SXG"/>
    </A4Sheet>

    <A4Sheet class="gap-10 flex px-[6mm] py-[10mm] flex-col A4Sheet" data-page="2">
        <h1 class="text-2xl font-bold">Page 2</h1>
        <div class="flex items-center justify-between">
            <RackKecilLabel />
            <RackKecilLabel />
        </div>
        <PalletAssyLabel type="SXG"/>
    </A4Sheet>

    <A4Sheet class="gap-10 flex px-[6mm] py-[10mm] flex-col A4Sheet" data-page="3">
        <h1 class="text-2xl font-bold">Page 3</h1>
        <RackAssyLabel type="1" timbangan="1000kg" />
        <PalletAssyLabel type="SXG"/>
    </A4Sheet>
</div>
-->

    <div bind:this={resultDiv}></div>
</Navbar>
