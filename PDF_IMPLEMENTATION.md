# Implementasi jsPDF & html2canvas di ISEKI Label

## 📦 Package yang Digunakan

- **jsPDF**: Library untuk generate file PDF
- **html2canvas-pro**: Library untuk mengkonversi HTML element menjadi canvas image

## ✨ Fitur yang Sudah Diimplementasi

### 1. **Download PDF** 📄

- Mengkonversi label menjadi file PDF dengan ukuran A4
- File akan otomatis didownload dengan timestamp
- Format nama file: `iseki-label-YYYY-MM-DDTHH-mm-ss.pdf`
- Kualitas tinggi (scale: 2) untuk hasil print yang bagus

### 2. **Direct Print** 🖨️

- Langsung membuka print dialog browser
- Optimized untuk ukuran kertas A4
- Preview otomatis sebelum print

### 3. **Download PNG** 🖼️

- Fungsi original untuk download sebagai image PNG
- Berguna untuk preview cepat atau share via chat/email

## 🔧 Cara Kerja

### Generate PDF

```typescript
async function printAsPDF() {
    // 1. Ambil HTML element yang akan di-convert
    const element = printArea;

    // 2. Convert HTML ke canvas dengan html2canvas
    const canvas = await html2canvas(element, {
        scale: 2, // Kualitas tinggi
        useCORS: true, // Support image cross-origin
        logging: false, // Disable console logs
        width: element.offsetWidth,
        height: element.offsetHeight,
    });

    // 3. Hitung ukuran untuk A4 (210mm x 297mm)
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 4. Buat PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 5. Convert canvas ke image data
    const imgData = canvas.toDataURL('image/png');

    // 6. Tambahkan image ke PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // 7. Save PDF file
    pdf.save(`iseki-label-${timestamp}.pdf`);
}
```

### Direct Print

```typescript
async function directPrint() {
    // 1. Convert HTML ke canvas
    const canvas = await html2canvas(element, { ... });

    // 2. Convert ke image data
    const imgData = canvas.toDataURL('image/png');

    // 3. Buka window baru dengan HTML minimal
    const printWindow = window.open('', '_blank');

    // 4. Write HTML dengan image dan auto-trigger print
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    @page { size: A4; margin: 0; }
                    body { margin: 0; }
                    img { max-width: 100%; }
                </style>
            </head>
            <body>
                <img src="${imgData}" onload="window.print();" />
            </body>
        </html>
    `);
}
```

## 🎨 Kustomisasi

### Mengubah Ukuran PDF

```typescript
// Landscape orientation
const pdf = new jsPDF('l', 'mm', 'a4');

// Custom size (contoh: 100mm x 150mm untuk label)
const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [100, 150],
});
```

### Mengubah Kualitas Output

```typescript
// Scale yang lebih tinggi = kualitas lebih bagus tapi file lebih besar
const canvas = await html2canvas(element, {
    scale: 3, // Default: 2, bisa 1-5
    // ...
});
```

### Multi-page PDF

Jika content lebih panjang dari satu halaman A4:

```typescript
const pageHeight = 297; // A4 height in mm
let heightLeft = imgHeight;
let position = 0;

// Add first page
pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
heightLeft -= pageHeight;

// Add more pages
while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
}
```

## 🚀 Tips & Best Practices

### 1. **Warna yang Aman untuk Print**

- Hindari warna yang terlalu terang/gelap
- Gunakan warna hex/rgb standard, bukan oklch
- Test print di printer fisik untuk hasil terbaik

### 2. **Ukuran Element**

- Pastikan element yang di-convert memiliki ukuran yang sesuai
- Gunakan class `A4Sheet` untuk container dengan ukuran A4
- Margin minimal 5-10mm untuk keamanan print

### 3. **Loading State**

- Selalu tampilkan loading indicator saat generate PDF
- Process bisa memakan waktu 1-3 detik tergantung kompleksitas
- Disable button saat processing untuk mencegah double-click

### 4. **Error Handling**

- Selalu wrap dalam try-catch
- Berikan feedback ke user jika gagal
- Log error ke console untuk debugging

### 5. **Performance**

```typescript
// ❌ Jangan: Scale terlalu tinggi
scale: 10; // File terlalu besar, slow

// ✅ Gunakan: Scale optimal
scale: 2 - 3; // Balance antara quality & performance
```

## 📱 Browser Compatibility

| Browser | PDF Download | Direct Print | PNG Download |
| ------- | ------------ | ------------ | ------------ |
| Chrome  | ✅           | ✅           | ✅           |
| Firefox | ✅           | ✅           | ✅           |
| Safari  | ✅           | ✅           | ✅           |
| Edge    | ✅           | ✅           | ✅           |

## 🐛 Troubleshooting

### PDF tidak ter-generate

- Check console untuk error message
- Pastikan element `printArea` sudah ter-bind
- Cek apakah ada image cross-origin yang di-block

### Warna tidak sesuai di PDF

- Gunakan warna hex/rgb, bukan oklch
- Test dengan warna standard terlebih dahulu
- Kalibrasi printer jika perlu

### Ukuran tidak pas

- Periksa ukuran container A4Sheet
- Adjust scale di html2canvas
- Cek margin dan padding

### Print dialog tidak muncul

- Popup mungkin di-block browser
- Allow popup untuk website ini
- Gunakan button "Download PDF" sebagai alternatif

## 📚 Resources

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [MDN Print API](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)

## 🎯 Next Steps

Beberapa improvement yang bisa ditambahkan:

1. **Batch Generate**: Generate multiple labels dalam satu PDF
2. **QR Code Integration**: Tambahkan QR code di label
3. **Template Selection**: Pilih template label yang berbeda
4. **Print Settings**: Custom margin, orientation, dll
5. **Save History**: Simpan history generate PDF
6. **Cloud Storage**: Upload PDF ke cloud storage

---

✨ **Happy Printing!** 🖨️
