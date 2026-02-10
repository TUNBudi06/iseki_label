# ✅ Status-Based Queue System - COMPLETED!

## 🎯 Perubahan Sistem

### Konsep Baru:
**Data yang sudah di-print TIDAK muncul di queue, tapi pindah ke History page**

---

## 📋 2 Halaman Terpisah

### 1. **Home Page** (Queue) - `/`
**Hanya menampilkan status: `pending`**

#### Features:
- ✅ Statistics Cards (Total Today, Pending, Printed)
- ✅ Search functionality
- ✅ Multiple selection dengan checkbox
- ✅ Print actions:
  - 🖨️ Print Single
  - Print Selected
  - Print All Pending
- ✅ Delete dari queue
- ✅ Auto-refresh setiap 30 detik

#### Table Columns (8 kolom):
1. ☑️ Checkbox
2. # - Nomor urut
3. **Rack No** - Bold pink
4. **Request By** - Dengan avatar
5. **Jumlah** - Badge "Nx"
6. **Tipe Label** - Rack Assy, Pallet, dll
7. **Waktu Request** - Timestamp
8. **Actions** - Print & Delete buttons

#### Status Behavior:
- ✅ Semua data di queue adalah **pending**
- ✅ Setelah print → **data HILANG dari queue**
- ✅ Data pindah ke history otomatis
- ✅ Printed count di-update
- ✅ Kolom status **DIHAPUS** (karena semua pending)

---

### 2. **Print History Page** - `/print-history`
**Hanya menampilkan status: `printed`**

#### Features:
- ✅ Statistics Cards (Printed Today, Total History)
- ✅ Search functionality (rack no, request by, printed by)
- ✅ Multiple selection dengan checkbox
- ✅ Actions:
  - 🖨️ Reprint (cetak ulang)
  - Delete dari history
  - Bulk reprint/delete
- ✅ Link kembali ke Queue
- ✅ Auto-refresh setiap 30 detik

#### Table Columns (10 kolom):
1. ☑️ Checkbox
2. # - Nomor urut
3. **Rack No** - Bold green
4. **Request By** - Dengan avatar
5. **Jumlah** - Badge "Nx"
6. **Tipe Label**
7. **Waktu Request** - Kapan di-request
8. **Waktu Print** ⭐ - Kapan di-cetak (badge hijau)
9. **Printed By** ⭐ - Siapa yang print
10. **Actions** - Reprint & Delete buttons

#### Color Theme:
- 🟢 **Green theme** untuk history (success state)
- Pink accents untuk consistency

---

## 🔄 Data Flow

### Lifecycle Label:

```
1. Request dari Web/App
   ↓
2. Masuk ke Queue (status: pending)
   ↓
3. User click Print
   ↓
4. Status berubah jadi 'printed'
   ↓
5. Data HILANG dari Queue
   ↓
6. Data MUNCUL di History
   ↓
7. Bisa di-reprint atau di-delete dari history
```

### Diagram:

```
┌─────────────────────────────────────────────────┐
│           EXTERNAL REQUEST                       │
│      (Web Warehouse / Mobile App)               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │      API Endpoint          │
    │  POST /api/label-requests  │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │    Database Insert         │
    │   status = 'pending'       │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │    HOME PAGE (Queue)       │
    │   Display pending items    │
    │                            │
    │   Actions:                 │
    │   - Print Single           │
    │   - Print Selected         │
    │   - Print All Pending      │
    │   - Delete                 │
    └────────────┬───────────────┘
                 │
          [User clicks Print]
                 │
                 ▼
    ┌────────────────────────────┐
    │   Generate PDF & Print     │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   Update Database          │
    │   status = 'printed'       │
    │   printed_at = NOW()       │
    │   printed_by = USER        │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   Remove from Queue        │
    │   (frontend state update)  │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   HISTORY PAGE             │
    │   Display printed items    │
    │                            │
    │   Actions:                 │
    │   - Reprint                │
    │   - Delete from history    │
    └────────────────────────────┘
```

---

## 🎨 UI Differences

### Queue Page (Pink Theme):
- **Primary Color:** Pink (#db2777)
- **Highlight:** Orange for pending (attention needed)
- **Focus:** Action-oriented (PRINT NOW!)
- **Urgency:** High priority items highlighted

### History Page (Green Theme):
- **Primary Color:** Green (#16a34a)
- **Highlight:** Green for completed (success)
- **Focus:** Record-keeping & reprint capability
- **Calm:** Archive/reference feel

---

## 📊 Statistics Updates

### Home Page Statistics:
```typescript
// Total Request Hari Ini
totalToday = pendingCount + printedCount  // Fetch dari API

// Pending Print
pendingCount = queueData.length  // Semua data di queue

// Sudah Dicetak (dengan link ke history)
printedCount = // Fetch dari API
```

### History Page Statistics:
```typescript
// Dicetak Hari Ini
printedToday = historyData.filter(today).length

// Total History
totalPrinted = historyData.length
```

---

## 🔌 API Integration

### Endpoints yang Dibutuhkan:

#### 1. **Get Queue (Pending Items)**
```typescript
GET /api/queue-label-prints?status=pending

Response:
{
    data: [
        {
            id: 1,
            rack_no: "MM-M001",
            request_by: "John Doe",
            jumlah: 5,
            tipe: "Rack Assy",
            status: "pending",
            created_at: "2026-02-10 08:30:00",
            priority: "normal"
        },
        // ...
    ],
    total_today: 25,
    pending_count: 20,
    printed_count: 5
}
```

#### 2. **Get History (Printed Items)**
```typescript
GET /api/queue-label-prints?status=printed

Response:
{
    data: [
        {
            id: 3,
            rack_no: "BB-B456",
            request_by: "Bob Wilson",
            jumlah: 3,
            tipe: "Rack Kecil",
            status: "printed",
            created_at: "2026-02-10 07:45:00",
            printed_at: "2026-02-10 08:00:00",
            printed_by: "Admin User",
            priority: "normal"
        },
        // ...
    ]
}
```

#### 3. **Print Labels (Update Status)**
```typescript
POST /api/print-labels

Request:
{
    ids: [1, 2, 3],  // Array of label IDs
    printed_by: "Admin User"
}

Response:
{
    success: true,
    message: "3 labels printed successfully",
    printed_ids: [1, 2, 3]
}

Backend Action:
- Update status = 'printed'
- Set printed_at = NOW()
- Set printed_by = user
- Generate PDF
```

#### 4. **Delete from Queue**
```typescript
DELETE /api/queue-label-prints/:id

Response:
{
    success: true,
    message: "Label deleted from queue"
}
```

#### 5. **Delete from History**
```typescript
DELETE /api/print-history/:id

Response:
{
    success: true,
    message: "Label deleted from history"
}
```

#### 6. **Reprint Labels**
```typescript
POST /api/reprint-labels

Request:
{
    ids: [3, 4],  // Array of history IDs
    printed_by: "Admin User"
}

Response:
{
    success: true,
    message: "2 labels reprinted successfully"
}

Backend Action:
- Generate PDF lagi
- Update printed_at = NOW() (optional)
- Update reprint_count++ (optional)
```

---

## 🗄️ Database Schema

### Table: `queue_label_prints`

```sql
CREATE TABLE queue_label_prints (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rack_no VARCHAR(50) NOT NULL,
    request_by VARCHAR(100) NOT NULL,
    request_from VARCHAR(100), -- 'Web Warehouse', 'Mobile App', etc.
    jumlah INT NOT NULL,
    tipe VARCHAR(50) NOT NULL, -- 'Rack Assy', 'Pallet Assy', 'Rack Kecil'
    status ENUM('pending', 'printed') DEFAULT 'pending',
    priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    printed_at TIMESTAMP NULL,
    printed_by VARCHAR(100) NULL,
    reprint_count INT DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_printed_at (printed_at)
);
```

---

## 📱 User Experience

### Scenario 1: User melihat queue
1. Buka `/` (Home page)
2. Lihat **4 pending items** di table
3. Statistics menunjukkan: 25 total, 20 pending, 5 printed

### Scenario 2: User print 1 label
1. Click 🖨️ button di row "MM-M001"
2. PDF generated & printed
3. Item **HILANG** dari table
4. Pending count: 20 → 19
5. Printed count: 5 → 6
6. Alert: "Label berhasil di-print dan dipindahkan ke history!"

### Scenario 3: User print multiple labels
1. Centang 3 checkboxes
2. Click "Print Selected (3)"
3. Confirm dialog muncul
4. PDF generated untuk 3 labels
5. 3 items **HILANG** dari table
6. Pending count: 19 → 16
7. Printed count: 6 → 9

### Scenario 4: User melihat history
1. Click "📜 Lihat History Print Label" (di statistics card)
2. Navigate ke `/print-history`
3. Lihat **semua printed labels** dengan timestamp
4. Bisa reprint atau delete

### Scenario 5: User reprint label
1. Di history page, click 🖨️ button
2. PDF generated lagi
3. Item **TETAP** di history
4. Alert: "Label berhasil di-reprint!"

---

## ⚡ Performance Optimization

### Auto-Refresh Strategy:
```typescript
// Both pages
onMount(() => {
    const interval = setInterval(refreshData, 30000); // 30 seconds
    return () => clearInterval(interval);
});
```

### Manual Refresh:
```svelte
<Button onclick={refreshData}>
    🔄 Refresh
</Button>
```

### Real-time Updates (Future Enhancement):
```typescript
// WebSocket for real-time queue updates
const echo = new Echo({...});

echo.channel('queue-updates')
    .listen('LabelRequested', (e) => {
        // Add new item to queue
        queueData = [...queueData, e.label];
    })
    .listen('LabelPrinted', (e) => {
        // Remove from queue
        queueData = queueData.filter(q => q.id !== e.labelId);
    });
```

---

## 🎯 Key Improvements

### Before:
- ❌ Status column cluttered table
- ❌ Printed items mixed with pending
- ❌ Hard to find what needs printing
- ❌ No clear action priority

### After:
- ✅ Clean separation: pending vs printed
- ✅ Queue page = action-focused (PRINT NOW!)
- ✅ History page = reference & reprint
- ✅ Clear visual hierarchy
- ✅ Better UX with data disappearing after print
- ✅ Statistics make sense (pending count = queue length)

---

## 📁 Files

### Created/Modified:
1. ✅ `resources/js/Pages/Home.svelte` - Queue page (pending only)
2. ✅ `resources/js/Pages/PrintHistory.svelte` - History page (printed only)
3. ✅ `routes/web.php` - Added `/print-history` route

### Routes:
```php
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/print-history', function () {
    return Inertia::render('PrintHistory');
})->name('print.history');
```

---

## ✨ Summary

### System Flow:
1. **Request** masuk → Queue (pending)
2. **Print** → Hilang dari queue
3. **Data** → Muncul di History (printed)
4. **Reprint** → Available di History

### Benefits:
- 🎯 **Fokus** - Queue hanya untuk pending items
- 📊 **Clean** - No status column needed di queue
- 🔍 **Easy** - Find what needs printing immediately
- 📜 **History** - Separate page untuk tracking
- 🎨 **Visual** - Color themes indicate purpose (pink=action, green=complete)
- ⚡ **Fast** - Less data to display per page

**System siap untuk production dengan API integration!** 🚀

