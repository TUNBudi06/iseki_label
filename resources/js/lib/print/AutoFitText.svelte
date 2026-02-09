<script lang="ts">
    import { onMount } from 'svelte';

    let { text, maxPt = 12, minPt = 6, className = '' } = $props();
    let el:HTMLDivElement = $state();

    function fit() {
        let size = maxPt;
        el.style.fontSize = size + 'pt';

        while (
            (el.scrollWidth > el.clientWidth ||
                el.scrollHeight > el.clientHeight) &&
            size > minPt
            ) {
            size -= 0.25;
            el.style.fontSize = size + 'pt';
        }
    }

    onMount(fit);
</script>

<div
    bind:this={el}
    class={"overflow-hidden leading-tight " + className}
    style="font-size:{maxPt}pt"
>
    {text}
</div>
