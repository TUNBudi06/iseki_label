<script lang="ts">
    import { onMount } from 'svelte';

    let { text, maxPt = 12, minPt = 6, class:className = '' } = $props();
    let el: HTMLDivElement = $state();

    function fit() {
        // Calculate initial font size based on text length
        const textLength = text.length;
        let size = maxPt;

        // Reduce initial size based on text length to avoid excessive shrinking
        if (textLength > 50) {
            size = Math.max(minPt, maxPt - (textLength - 50) * 0.05);
        }

        el.style.fontSize = size + 'pt';

        // Fine-tune size until text fits in container
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
    class={'overflow-hidden leading-tight text-balance ' + className}
    style="font-size:{maxPt}pt"
>
    {text}
</div>
