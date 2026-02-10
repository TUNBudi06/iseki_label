# 📑 Multi-Page PDF - Page Break Implementation

## 🎯 Konsep Page Break

Ketika Anda ingin membuat PDF dengan **multiple pages** di mana setiap halaman berisi konten yang berbeda, ada 2 cara utama:

### 1. **Auto Page Break** (Single Content Split)

Content panjang otomatis dipecah jadi multiple pages

### 2. **Manual Page Break** (Separate Pages) ⭐

**Setiap A4Sheet** = **1 Halaman PDF** yang terpisah

---

## 🚀 Implementasi Manual Page Break

### Cara Kerja

```svelte
<!-- Multiple A4Sheets = Multiple PDF Pages -->
<div bind:this={printArea}>
    <A4Sheet class="A4Sheet" data-page="1">
        <!-- Content Page 1 -->
    </A4Sheet>

    <A4Sheet class="A4Sheet" data-page="2">
        <!-- Content Page 2 -->
    </A4Sheet>

    <A4Sheet class="A4Sheet" data-page="3">
        <!-- Content Page 3 -->
    </A4Sheet>
</div>
```

### Function untuk Generate PDF

```typescript
async function printMultipleSheets() {
    if (!printArea) return;

    // 1. Cari semua A4Sheet elements
    const sheets = printArea.querySelectorAll('.A4Sheet');

    // 2. Buat PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 3. Loop setiap sheet
    for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i] as HTMLElement;

        // 4. Convert sheet ke canvas
        const canvas = await html2canvas(sheet, {
            scale: 3,
            useCORS: true,
            logging: false,
        });

        // 5. Add new page (kecuali page pertama)
        if (i > 0) {
            pdf.addPage(); // 👈 INI PAGE BREAK!
        }

        // 6. Add image ke current page
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    }

    // 7. Save PDF
    pdf.save('multi-page.pdf');
}
```

---

## 📖 Contoh Penggunaan

### Contoh 1: Simple Multi-Page

```svelte
<script lang="ts">
    import A4Sheet from '$lib/print/A4Sheet.svelte';
    import RackAssyLabel from '$lib/print/RackAssyLabel.svelte';
    import PalletAssyLabel from '$lib/print/PalletAssyLabel.svelte';

    let printArea: HTMLDivElement | undefined = $state();
</script>

<div bind:this={printArea} class="flex flex-col gap-4">
    <!-- PAGE 1 -->
    <A4Sheet class="A4Sheet" data-page="1">
        <h1>Page 1: Rack Labels</h1>
        <RackAssyLabel type="0" timbangan="-" />
        <RackAssyLabel type="1" timbangan="500kg" />
    </A4Sheet>

    <!-- PAGE 2 -->
    <A4Sheet class="A4Sheet" data-page="2">
        <h1>Page 2: Pallet Labels</h1>
        <PalletAssyLabel type="SXG" />
        <PalletAssyLabel type="SXG" />
    </A4Sheet>

    <!-- PAGE 3 -->
    <A4Sheet class="A4Sheet" data-page="3">
        <h1>Page 3: Mixed Labels</h1>
        <RackAssyLabel type="2" timbangan="1000kg" />
        <PalletAssyLabel type="SXG" />
    </A4Sheet>
</div>
```

### Contoh 2: Dynamic Pages (dari data)

```svelte
<script lang="ts">
    // Data dari API atau database
    let labelData = $state([
        {
            id: 1,
            title: 'Warehouse A - Rack 1',
            labels: [
                { partNo: 'ISEKI-001', qty: 100 },
                { partNo: 'ISEKI-002', qty: 200 },
            ],
        },
        {
            id: 2,
            title: 'Warehouse B - Rack 2',
            labels: [
                { partNo: 'ISEKI-003', qty: 150 },
                { partNo: 'ISEKI-004', qty: 250 },
            ],
        },
    ]);

    let printArea: HTMLDivElement | undefined = $state();
</script>

<div bind:this={printArea} class="flex flex-col gap-4">
    {#each labelData as page (page.id)}
        <A4Sheet class="A4Sheet" data-page={page.id}>
            <h2>{page.title}</h2>
            {#each page.labels as label}
                <div class="label-item">
                    <p>Part: {label.partNo}</p>
                    <p>Qty: {label.qty}</p>
                </div>
            {/each}
        </A4Sheet>
    {/each}
</div>
```

### Contoh 3: Conditional Pages

```svelte
<script lang="ts">
    let showRackLabels = $state(true);
    let showPalletLabels = $state(true);
    let showKecilLabels = $state(false);
</script>

<div bind:this={printArea} class="flex flex-col gap-4">
    {#if showRackLabels}
        <A4Sheet class="A4Sheet" data-page="rack">
            <h1>Rack Labels</h1>
            <RackAssyLabel type="0" timbangan="-" />
        </A4Sheet>
    {/if}

    {#if showPalletLabels}
        <A4Sheet class="A4Sheet" data-page="pallet">
            <h1>Pallet Labels</h1>
            <PalletAssyLabel type="SXG" />
        </A4Sheet>
    {/if}

    {#if showKecilLabels}
        <A4Sheet class="A4Sheet" data-page="kecil">
            <h1>Kecil Labels</h1>
            <RackKecilLabel />
        </A4Sheet>
    {/if}
</div>
```

---

## 🔧 Fitur di Home.svelte

### Button Controls

```svelte
<div class="flex gap-2">
    <!-- Single Page PDF: 1 halaman panjang, auto split -->
    <Button onclick={printAsPDF}>📄 Single Page PDF</Button>

    <!-- Multi-Page PDF: setiap A4Sheet = 1 page terpisah -->
    <Button onclick={printMultipleSheets}>📑 Multi-Page PDF</Button>

    <!-- Direct Print -->
    <Button onclick={directPrint}>🖨️ Print</Button>

    <!-- PNG Download -->
    <Button onclick={printAsPNG}>🖼️ Download PNG</Button>
</div>
```

### Mode Selection

Ada 2 mode di `Home.svelte`:

#### Mode 1: Single Page (Default)

```svelte
<!-- 1 A4Sheet saja -->
<A4Sheet bind:ref={printArea}>
    <RackAssyLabel type="0" />
    <PalletAssyLabel type="SXG" />
</A4Sheet>
```

- Klik "📄 Single Page PDF" → 1 halaman PDF
- Klik "📑 Multi-Page PDF" → tetap 1 halaman (karena cuma 1 A4Sheet)

#### Mode 2: Multi-Page

```svelte
<!-- Uncomment bagian ini di Home.svelte -->
<div bind:this={printArea}>
    <A4Sheet class="A4Sheet" data-page="1">
        <!-- Content page 1 -->
    </A4Sheet>

    <A4Sheet class="A4Sheet" data-page="2">
        <!-- Content page 2 -->
    </A4Sheet>

    <A4Sheet class="A4Sheet" data-page="3">
        <!-- Content page 3 -->
    </A4Sheet>
</div>
```

- Klik "📑 Multi-Page PDF" → 3 halaman PDF terpisah!

---

## 🎨 Styling untuk Page Break

### CSS untuk Print (opsional)

```css
/* Di dalam <style> tag atau CSS file */

/* Setiap A4Sheet akan page break saat print */
.A4Sheet {
    page-break-after: always;
    break-after: page;
}

/* Last page tidak perlu page break */
.A4Sheet:last-child {
    page-break-after: auto;
    break-after: auto;
}
```

### Inline Style

```svelte
<A4Sheet class="A4Sheet" data-page="1" style="page-break-after: always;">
    <!-- Content -->
</A4Sheet>
```

---

## 🧪 Testing & Preview

### Step-by-Step Test

1. **Buka Home.svelte**
2. **Uncomment** bagian multi-page di kode
3. **Refresh** browser
4. Lihat ada 3 A4Sheet di preview
5. Klik **"📑 Multi-Page PDF"**
6. PDF akan punya **3 halaman terpisah**!

### Test dengan Data Real

```svelte
<script lang="ts">
    // Fetch data dari API
    import { onMount } from 'svelte';

    let orders = $state([]);

    onMount(async () => {
        const response = await fetch('/api/orders');
        orders = await response.json();
    });
</script>

<div bind:this={printArea}>
    {#each orders as order}
        <A4Sheet class="A4Sheet" data-page={order.id}>
            <h1>Order #{order.id}</h1>
            {#each order.items as item}
                <RackAssyLabel type={item.type} timbangan={item.weight} />
            {/each}
        </A4Sheet>
    {/each}
</div>
```

---

## 📊 Comparison

| Feature      | Single Page PDF       | Multi-Page PDF             |
| ------------ | --------------------- | -------------------------- |
| **Fungsi**   | `printAsPDF()`        | `printMultipleSheets()`    |
| **Input**    | 1 element             | Multiple A4Sheets          |
| **Output**   | 1+ pages (auto split) | N pages (manual split)     |
| **Use Case** | Long content          | Different content per page |
| **Control**  | Auto                  | Manual                     |

---

## 💡 Best Practices

### 1. **Gunakan Class `.A4Sheet`**

```svelte
<!-- ✅ Good -->
<A4Sheet class="A4Sheet" data-page="1">

<!-- ❌ Bad (tidak akan terdeteksi) -->
<div class="my-custom-page">
```

### 2. **Add `data-page` Attribute**

```svelte
<A4Sheet class="A4Sheet" data-page="1">
<A4Sheet class="A4Sheet" data-page="2">
<A4Sheet class="A4Sheet" data-page="3">
```

Berguna untuk debugging dan tracking.

### 3. **Container dengan `bind:this`**

```svelte
<!-- Jangan bind ke A4Sheet langsung jika multi-page -->
<div bind:this={printArea}>
    <A4Sheet class="A4Sheet">...</A4Sheet>
    <A4Sheet class="A4Sheet">...</A4Sheet>
</div>
```

### 4. **Gap Between Pages (untuk preview)**

```svelte
<div bind:this={printArea} class="flex flex-col gap-4">
    <!-- gap-4 = spacing di preview, tidak masuk PDF -->
</div>
```

### 5. **Hide Non-Print Elements**

```svelte
<!-- Button tidak akan masuk PDF karena di luar A4Sheet -->
<Button>Delete Page</Button>

<A4Sheet class="A4Sheet">
    <!-- Hanya content di dalam ini yang masuk PDF -->
</A4Sheet>
```

---

## 🐛 Troubleshooting

### Problem: Hanya 1 page ter-generate

**Penyebab:**

- Tidak ada elemen dengan class `.A4Sheet`
- `querySelectorAll` tidak menemukan elements

**Solusi:**

```svelte
<!-- Pastikan class ada -->
<A4Sheet class="A4Sheet" data-page="1">
```

### Problem: Pages tidak terpisah

**Penyebab:**

- Lupa panggil `pdf.addPage()` di loop

**Solusi:**

```typescript
for (let i = 0; i < sheets.length; i++) {
    if (i > 0) {
        pdf.addPage(); // 👈 Wajib!
    }
    // ...
}
```

### Problem: Content terpotong

**Penyebab:**

- Content lebih tinggi dari A4 (297mm)

**Solusi:**

```typescript
// Calculate and crop if needed
const maxHeight = 297; // A4 height
pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, maxHeight));
```

### Problem: Loading terlalu lama

**Penyebab:**

- Scale terlalu tinggi
- Terlalu banyak pages

**Solusi:**

```typescript
// Kurangi scale
const canvas = await html2canvas(sheet, {
    scale: 2, // Dari 3 ke 2
    // ...
});

// Atau process per batch
for (let i = 0; i < Math.min(sheets.length, 10); i++) {
    // Process max 10 pages at a time
}
```

---

## 🎯 Live Example

**File sudah tersedia:**

- `Home.svelte` - Basic implementation
- `MultiPageExample.svelte` - Full interactive example

**Test URL:**

```
http://localhost:5173/          → Single page demo
http://localhost:5173/multi-page → Multi-page demo (interactive)
```

---

## 📚 Resources

- **jsPDF Docs:** https://github.com/parallax/jsPDF
- **html2canvas:** https://html2canvas.hertzen.com/
- **Multi-page example:** `/resources/js/Pages/MultiPageExample.svelte`

---

## ✨ Summary

### Quick Guide:

1. **Multiple A4Sheets:**

    ```svelte
    <div bind:this={printArea}>
        <A4Sheet class="A4Sheet">Page 1</A4Sheet>
        <A4Sheet class="A4Sheet">Page 2</A4Sheet>
        <A4Sheet class="A4Sheet">Page 3</A4Sheet>
    </div>
    ```

2. **Call Function:**

    ```typescript
    printMultipleSheets(); // Generate 3-page PDF
    ```

3. **Result:**
    - PDF dengan 3 halaman terpisah
    - Setiap halaman berisi content dari 1 A4Sheet
    - Page break otomatis di-handle oleh `pdf.addPage()`

**🎉 Done! Sekarang Anda bisa render 2x A4Sheet dengan item yang berbeda!**
