<script lang="ts">
    import { onMount, tick } from 'svelte';

    let {
        text = '',
        maxPx = 16,
        minPx = 8,
        balance = false,
        fillSpace = true,
        class: className = '',
    }: {
        text: string;
        maxPx?: number;
        minPx?: number;
        balance?: boolean;
        fillSpace?: boolean;
        class?: string;
    } = $props();

    let el: HTMLDivElement | null = $state(null);
    let currentSize = $state(maxPx);
    let ro: ResizeObserver | null = null;

    async function fit() {
        if (!el || !text) return;
        await tick();

        const parent = el.parentElement;
        if (!parent) return;

        const availWidth = parent.clientWidth;
        const availHeight = parent.clientHeight;

        if (availWidth <= 0 || availHeight <= 0) return;

        // Apply base styles
        el.style.whiteSpace = balance ? 'normal' : 'nowrap';
        el.style.wordBreak = balance ? 'break-word' : 'keep-all';
        el.style.textWrap = balance ? 'balance' : 'unset';
        el.style.lineHeight = balance ? '1.2' : '1';
        el.style.overflow = 'hidden';

        // Calculate initial size based on text length
        const textLength = text.length;
        let size = maxPx;

        if (textLength > 50) {
            size = Math.max(minPx, maxPx - (textLength - 50) * 0.1);
        }

        el.style.fontSize = size + 'px';
        await tick();

        // Phase 1: Shrink until fits
        let safety = 0;
        const maxSafety = 100;

        while (
            safety < maxSafety &&
            size > minPx &&
            (el.scrollWidth > availWidth || el.scrollHeight > availHeight)
        ) {
            size -= 0.5;
            el.style.fontSize = size + 'px';
            await tick();
            safety++;
        }

        // Phase 2: Fill space if plenty room available
        if (fillSpace && size < maxPx) {
            await tick();
            const currentWidth = el.scrollWidth;
            const currentHeight = el.scrollHeight;

            // Check if there's significant headroom (>15%)
            const widthHeadroom = (availWidth - currentWidth) / availWidth;
            const heightHeadroom = (availHeight - currentHeight) / availHeight;

            if (widthHeadroom > 0.15 || heightHeadroom > 0.15) {
                // Try to grow
                while (size < maxPx) {
                    const testSize = size + 0.5;
                    el.style.fontSize = testSize + 'px';
                    await tick();

                    if (
                        el.scrollWidth > availWidth ||
                        el.scrollHeight > availHeight
                    ) {
                        // Too big, revert
                        el.style.fontSize = size + 'px';
                        break;
                    }

                    size = testSize;
                }
            }
        }

        currentSize = Math.max(size, minPx);
        el.style.fontSize = currentSize + 'px';
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function scheduleFit(delay = 50) {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => tick().then(fit), delay);
    }

    $effect(() => {
        // React to text or balance prop changes
        void text;
        void balance;
        if (el) scheduleFit(0);
    });

    onMount(() => {
        // Initial fit with delays for font loading
        [0, 50, 100, 200].forEach((d) => setTimeout(() => tick().then(fit), d));

        // Watch parent resize
        const parent = el?.parentElement;
        if (parent) {
            ro = new ResizeObserver(() => scheduleFit());
            ro.observe(parent);
        }

        return () => {
            ro?.disconnect();
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    });
</script>

<div
    bind:this={el}
    class={[
        'overflow-hidden',
        balance ? 'text-balance' : '',
        balance ? '' : 'leading-tight',
        className,
    ].join(' ')}
    style="font-size:{maxPx}px; white-space: {balance ? 'normal' : 'nowrap'};"
>
    {text}
</div>
