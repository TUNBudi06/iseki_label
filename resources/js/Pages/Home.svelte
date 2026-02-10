<script lang="ts">
    import Navbar from '$/Layouts/Navbar.svelte';
    import RackAssyLabel from '$lib/print/RackAssyLabel.svelte';
    import A4Sheet from "$lib/print/A4Sheet.svelte";
    import PalletAssyLabel from "$lib/print/PalletAssyLabel.svelte";
    import RackKecilLabel from "$lib/print/RackKecilLabel.svelte";
    import {Button} from "$shadcn/components/ui/button";

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
        html2canvas(element,{
            scale:1,
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
            let url = canvas.toDataURL("image/png",100);
            const link = document.createElement('a');
            link.href = url
            link.download = 'print.png';
            link.click();
            isGenerating = false;
        });
    }

    // Print sebagai PDF menggunakan jsPDF
    async function printAsPDF() {
        if (!printArea) return;

        isGenerating = true;

        try {
            const element = printArea;

            // Convert HTML to canvas dengan kualitas tinggi
            const canvas = await html2canvas(element, {
                scale: 3, // Kualitas lebih tinggi untuk print
                useCORS: true,
                logging: false,
                width: element.offsetWidth,
                height: element.offsetHeight,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
            });

            // Ukuran A4 dalam mm
            const imgWidth = 210; // A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Buat PDF dengan ukuran A4
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            // Tambahkan gambar ke PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Download PDF dengan timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
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
    <div class="flex gap-2">
        <Button onclick={printAsPDF} disabled={isGenerating}>
            {isGenerating ? '⏳ Generating...' : '📄 Download PDF'}
        </Button>
        <Button onclick={directPrint} disabled={isGenerating} variant="secondary">
            {isGenerating ? '⏳ Printing...' : '🖨️ Print'}
        </Button>
        <Button onclick={printAsPNG} disabled={isGenerating} variant="outline">
            {isGenerating ? '⏳ Generating...' : '🖼️ Download PNG'}
        </Button>
    </div>

    <A4Sheet bind:ref={printArea} class="gap-10 flex px-[6mm] py-[10mm] flex-col">
        <RackAssyLabel type="0" timbangan="-" />
        <PalletAssyLabel type="SXG"/>
        <div class="flex items-center justify-between">
            <RackKecilLabel />
            <RackKecilLabel />
        </div>
    </A4Sheet>
    <div bind:this={resultDiv}></div>
</Navbar>
