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
    let isGenerating = $state(false);

    // Data untuk demo - bisa diganti dengan data dari API/database
    let pages = $state([
        {
            id: 1,
            title: 'Rack Assy Labels - Page 1',
            items: [
                { type: '0', timbangan: '-' },
                { type: '1', timbangan: '500kg' },
            ],
        },
        {
            id: 2,
            title: 'Pallet Assy Labels - Page 2',
            items: [{ type: 'SXG' }, { type: 'SXG' }],
        },
        {
            id: 3,
            title: 'Mixed Labels - Page 3',
            items: [{ type: 'rack', timbangan: '1000kg' }, { type: 'pallet' }],
        },
    ]);

    // Print Multiple A4 Sheets sebagai separate PDF pages
    async function printMultiPagePDF() {
        if (!printArea) return;

        isGenerating = true;

        try {
            // Cari semua A4Sheet elements
            const sheets = printArea.querySelectorAll('.A4Sheet');

            if (sheets.length === 0) {
                alert('No pages found to print!');
                return;
            }

            console.log(`Found ${sheets.length} pages to print`);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = 297; // A4 height in mm

            // Process setiap sheet satu per satu
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i] as HTMLElement;

                console.log(`Processing page ${i + 1}/${sheets.length}...`);

                // Convert sheet to canvas
                const canvas = await html2canvas(sheet, {
                    scale: 3, // High quality
                    useCORS: true,
                    logging: false,
                    width: sheet.offsetWidth,
                    height: sheet.offsetHeight,
                });

                const imgData = canvas.toDataURL('image/png');

                // Add new page for subsequent pages
                if (i > 0) {
                    pdf.addPage();
                }

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

                console.log(`Page ${i + 1} added to PDF`);
            }

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

    // Quick print function (opens print dialog)
    async function quickPrint() {
        if (!printArea) return;

        isGenerating = true;

        try {
            // Use browser's native print for all pages
            const printWindow = window.open('', '_blank');

            if (printWindow) {
                const htmlContent = printArea.innerHTML;

                const printHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <title>Print Multi-Page Labels</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: monospace;
        }
        .A4Sheet {
            width: 210mm;
            height: 297mm;
            background: white;
            border: 1px solid #000;
            box-sizing: border-box;
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        .A4Sheet:last-child {
            page-break-after: auto;
        }
        @media print {
            .A4Sheet {
                border: none;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
    <script>
        window.onload = function() {
            window.print();
        };
    <\/script>
</body>
</html>`;

                printWindow.document.write(printHTML);
                printWindow.document.close();
            }
        } catch (error) {
            console.error('Error printing:', error);
            alert('Error printing. Check console for details.');
        } finally {
            isGenerating = false;
        }
    }

    // Add new page
    function addPage() {
        pages = [
            ...pages,
            {
                id: pages.length + 1,
                title: `New Page ${pages.length + 1}`,
                items: [{ type: '0', timbangan: '-' }],
            },
        ];
    }

    // Remove page
    function removePage(id: number) {
        if (pages.length <= 1) {
            alert('Cannot remove the last page!');
            return;
        }
        pages = pages.filter((p) => p.id !== id);
    }
</script>

<Navbar>
    <!-- Control Panel -->
    <div class="bg-white p-4 rounded-lg shadow mb-4 sticky top-0 z-10">
        <div class="flex gap-2 flex-wrap items-center justify-between">
            <div class="flex gap-2">
                <Button onclick={printMultiPagePDF} disabled={isGenerating}>
                    {isGenerating
                        ? '⏳ Generating...'
                        : `📑 Generate ${pages.length}-Page PDF`}
                </Button>
                <Button
                    onclick={quickPrint}
                    disabled={isGenerating}
                    variant="secondary"
                >
                    {isGenerating ? '⏳ Printing...' : '🖨️ Quick Print'}
                </Button>
            </div>

            <div class="flex gap-2 items-center">
                <span class="text-sm text-gray-600">{pages.length} pages</span>
                <Button onclick={addPage} variant="outline" size="sm">
                    ➕ Add Page
                </Button>
            </div>
        </div>
    </div>

    <!-- Preview & Print Area -->
    <div bind:this={printArea} class="flex flex-col gap-6">
        {#each pages as page, index (page.id)}
            <div class="relative">
                <!-- Page number indicator -->
                <div
                    class="absolute -left-12 top-0 bg-pink-600 text-white px-3 py-1 rounded text-sm font-bold"
                >
                    Page {index + 1}
                </div>

                <!-- Delete button (tidak akan ikut ke-print) -->
                <button
                    onclick={() => removePage(page.id)}
                    class="absolute -right-12 top-0 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    disabled={pages.length <= 1}
                >
                    🗑️
                </button>

                <!-- A4 Sheet - INI yang akan masuk ke PDF -->
                <A4Sheet
                    class="gap-6 flex px-[6mm] py-[10mm] flex-col A4Sheet"
                    data-page={page.id}
                >
                    <!-- Page Title -->
                    <div class="border-b-2 border-black pb-2">
                        <h2 class="text-xl font-bold">{page.title}</h2>
                        <p class="text-sm text-gray-600">
                            Generated: {new Date().toLocaleString('id-ID')}
                        </p>
                    </div>

                    <!-- Content based on page data -->
                    {#if index === 0}
                        <!-- Page 1: Rack Labels -->
                        <RackAssyLabel type="0" timbangan="-" />
                        <RackAssyLabel type="1" timbangan="500kg" />
                        <div class="flex items-center justify-between gap-4">
                            <RackKecilLabel />
                            <RackKecilLabel />
                        </div>
                    {:else if index === 1}
                        <!-- Page 2: Pallet Labels -->
                        <PalletAssyLabel type="SXG" />
                        <PalletAssyLabel type="SXG" />
                        <div class="mt-auto text-center text-sm text-gray-500">
                            Page 2 of {pages.length}
                        </div>
                    {:else}
                        <!-- Page 3+: Mixed -->
                        <RackAssyLabel type="2" timbangan="1000kg" />
                        <div class="flex items-center justify-between gap-4">
                            <RackKecilLabel />
                            <RackKecilLabel />
                        </div>
                        <PalletAssyLabel type="SXG" />
                        <div class="mt-auto">
                            <div
                                class="bg-pink-50 border border-pink-200 p-3 rounded"
                            >
                                <p class="text-sm">
                                    <strong>Page {index + 1}</strong> - Custom content
                                </p>
                            </div>
                        </div>
                    {/if}
                </A4Sheet>
            </div>
        {/each}
    </div>

    <!-- Instructions -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-bold mb-3 text-blue-900">
            📖 Cara Menggunakan Multi-Page PDF:
        </h3>

        <ol class="list-decimal list-inside space-y-2 text-gray-700">
            <li>
                <strong>Add Page:</strong> Klik tombol "➕ Add Page" untuk menambah
                halaman baru
            </li>
            <li>
                <strong>Remove Page:</strong> Klik tombol "🗑️" di samping page yang
                ingin dihapus
            </li>
            <li>
                <strong>Generate PDF:</strong> Klik "📑 Generate PDF" - setiap A4Sheet
                akan jadi 1 halaman PDF
            </li>
            <li>
                <strong>Quick Print:</strong> Klik "🖨️ Quick Print" untuk langsung
                print semua halaman
            </li>
        </ol>

        <div class="mt-4 p-4 bg-white rounded border border-blue-300">
            <p class="text-sm font-semibold text-blue-800 mb-2">💡 Tips:</p>
            <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>
                    Setiap elemen dengan class <code
                        class="bg-gray-100 px-1 rounded">.A4Sheet</code
                    > akan jadi 1 halaman terpisah
                </li>
                <li>
                    Tambahkan <code class="bg-gray-100 px-1 rounded"
                        >data-page</code
                    > attribute untuk tracking
                </li>
                <li>
                    Content di luar A4Sheet (seperti button & indicator) tidak
                    akan masuk PDF
                </li>
                <li>Order halaman sesuai urutan di HTML</li>
            </ul>
        </div>
    </div>
</Navbar>
