<script lang="ts">
    import Navbar from "$/Layouts/Navbar.svelte";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import {dndzone} from "svelte-dnd-action";
    import RenderEngine from "$lib/print/RenderEngine.svelte";

    let { idsPrint,list} = $props();

    let listBasedOntype = $state({})

    $effect(() => {
        listBasedOntype = {
            kecil: list.filter(item => item.label_type === 'kecil'),
            besar: list.filter(item => item.label_type === 'besar'),
            pallet: list.filter(item => item.label_type === 'pallet'),
        };
    })

    // $inspect(listBasedOntype, 'listBasedOntype');
</script>


<Navbar>
    <Card.Root>
        <Card.Title class="text-center mt-4">Daftar Label untuk Dicetak</Card.Title>
        <Card.Description class="text-center mb-4">
            Seret dan lepas untuk mengatur ulang urutan pencetakan label.
        </Card.Description>
        <Card.Content>
            <RenderEngine data={listBasedOntype}/>
        </Card.Content>
    </Card.Root>
</Navbar>
