<script lang="ts">
    import {PrintModule} from "$lib/print-module.ts";
    import {onMount} from "svelte";
    import Navbar from "$/Layouts/Navbar.svelte";

    let printModule: PrintModule = new PrintModule();

    onMount(() => {
        // Run async work inside an IIFE to avoid making the onMount callback async
        (async () => {
            await printModule.init();
            await printModule.startAutoPing();
            console.log('PrintModule state after start:', printModule);
        })();

        // Return a cleanup function so the auto-ping stops on unmount
        return () => printModule.stopAutoPing();
    });

</script>

<Navbar>

</Navbar>
