# 📑 Quick Reference: Page Break Multi-Page PDF

## TL;DR

```svelte
<!-- Setiap A4Sheet = 1 Halaman PDF -->
<div bind:this={printArea}>
    <A4Sheet class="A4Sheet" data-page="1">
        <RackAssyLabel type="0" />
    </A4Sheet>

    <A4Sheet class="A4Sheet" data-page="2">
        <PalletAssyLabel type="SXG" />
    </A4Sheet>
</div>

<Button onclick={printMultipleSheets}>📑 Multi-Page PDF</Button>
```

**Result:** PDF dengan 2 halaman terpisah! ✅

---

## Contoh Dynamic

```svelte
<script>
    let orders = $state([...data dari API...]);
</script>

<div bind:this={printArea}>
    {#each orders as order}
        <A4Sheet class="A4Sheet" data-page={order.id}>
            <RackAssyLabel {...order} />
        </A4Sheet>
    {/each}
</div>
```

---

## File Locations

- **Implementation:** `resources/js/Pages/Home.svelte`
- **Full Example:** `resources/js/Pages/MultiPageExample.svelte`
- **Docs:** `PAGE_BREAK_GUIDE.md`
- **Routes:**
    - `/` → Home (basic)
    - `/multi-page` → Interactive example

---

## Test URLs

```
http://localhost:5173/           → Single page demo
http://localhost:5173/multi-page → Multi-page demo (interactive)
```

---

## ✨ Done!
