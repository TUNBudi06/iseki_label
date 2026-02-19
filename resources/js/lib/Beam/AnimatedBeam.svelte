<!-- AnimatedBeam.svelte -->
<script lang="ts">
    import { cn } from "$shadcn/utils";
    import { tick, untrack } from "svelte";
    import { Motion } from "svelte-motion";

    interface Props {
        class?: string;
        containerRef?: HTMLElement;
        fromRef?: HTMLElement;
        toRef?: HTMLElement;
        curvature?: number;
        duration?: number;
        delay?: number;
        pathColor?: string;
        pathWidth?: number;
        pathOpacity?: number;
        gradientStartColor?: string;
        gradientStopColor?: string;
        startXOffset?: number;
        startYOffset?: number;
        endXOffset?: number;
        endYOffset?: number;
        static?: boolean;
        trigger?: boolean;
        onCompleted?: () => void;
    }

    let {
        class: className = "",
        containerRef,
        fromRef,
        toRef,
        curvature = 0,
        duration = 2,
        delay = 0,
        pathColor = "gray",
        pathWidth = 2,
        pathOpacity = 0.2,
        gradientStartColor = "#ffaa40",
        gradientStopColor = "#9c40ff",
        startXOffset = 0,
        startYOffset = 0,
        endXOffset = 0,
        endYOffset = 0,
        static: isStatic = false,
        trigger = false,
        onCompleted,
    }: Props = $props();

    let id = $state(crypto.randomUUID().slice(0, 8));
    let pathD = $state("");
    let svgDimensions = $state({ width: 0, height: 0 });
    let isReady = $state(false);
    let isAnimating = $state(false);
    let lastTrigger = $state(false);
    let animationKey = $state(0);

    // Easing from easings.net: easeOutExpo = [0.16, 1, 0.3, 1]
    const easeOutExpo = [0.16, 1, 0.3, 1];

    function updatePath() {
        if (!containerRef || !fromRef || !toRef) {
            isReady = false;
            return;
        }
        if (!document.contains(fromRef) || !document.contains(toRef)) {
            isReady = false;
            return;
        }

        const containerRect = containerRef.getBoundingClientRect();
        const rectA = fromRef.getBoundingClientRect();
        const rectB = toRef.getBoundingClientRect();

        if (containerRect.width === 0 || containerRect.height === 0) {
            isReady = false;
            return;
        }

        svgDimensions = {
            width: containerRect.width,
            height: containerRect.height
        };

        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        pathD = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
        isReady = true;
    }

    // Rising edge detection for trigger mode
    $effect(() => {
        if (!isStatic && trigger && !lastTrigger) {
            untrack(() => {
                animationKey++;
                isAnimating = true;
            });
        }
        lastTrigger = trigger;
    });

    // Auto-reset after one-shot animation
    $effect(() => {
        if (isAnimating && !isStatic) {
            const timeout = setTimeout(() => {
                isAnimating = false;
                onCompleted?.();
            }, (delay + duration) * 1000);
            return () => clearTimeout(timeout);
        }
    });

    // Init path & observers
    $effect(() => {
        updatePath();
        if (!isReady) tick().then(updatePath);

        const ro = new ResizeObserver(updatePath);
        if (containerRef) ro.observe(containerRef);
        if (fromRef) ro.observe(fromRef);
        if (toRef) ro.observe(toRef);
        return () => ro.disconnect();
    });
</script>

<svg
    fill="none"
    width={svgDimensions.width}
    height={svgDimensions.height}
    xmlns="http://www.w3.org/2000/svg"
    class={cn("pointer-events-none absolute left-0 top-0", className)}
    viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
>
    {#if isReady && pathD}
        <!-- Background path -->
        <path
            d={pathD}
            stroke={pathColor}
            stroke-width={pathWidth}
            stroke-opacity={pathOpacity}
            stroke-linecap="round"
            fill="none"
        />

        <!-- Animated path -->
        {#if isStatic}
            <!-- Static: infinite smooth loop with svelte-motion -->
            <Motion
                initial={{ x1: "-100%", x2: "0%" }}
                animate={{ x1: "100%", x2: "200%" }}
                transition={{
                    duration,
                    delay,
                    ease: easeOutExpo,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0
                }}
                attr
                let:motion
            >
                <path
                    d={pathD}
                    stroke-width={pathWidth}
                    stroke={`url(#${id}-static)`}
                    stroke-linecap="round"
                    fill="none"
                    use:motion
                />
            </Motion>
            <defs>
                <linearGradient id={`${id}-static`} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color={gradientStartColor} stop-opacity="0" />
                    <stop offset="20%" stop-color={gradientStartColor} stop-opacity="1" />
                    <stop offset="50%" stop-color={gradientStopColor} stop-opacity="1" />
                    <stop offset="80%" stop-color={gradientStopColor} stop-opacity="0" />
                    <stop offset="100%" stop-color={gradientStartColor} stop-opacity="0" />
                </linearGradient>
            </defs>

        {:else if isAnimating}
            <!-- Trigger: one-shot with precise easing -->
            {#key animationKey}
                <Motion
                    initial={{ x1: "-100%", x2: "0%" }}
                    animate={{ x1: "100%", x2: "200%" }}
                    transition={{
                        duration,
                        delay,
                        ease: easeOutExpo
                    }}
                    attr
                    let:motion
                    on:animationComplete={() => {
                        isAnimating = false;
                        onCompleted?.();
                    }}
                >
                    <path
                        d={pathD}
                        stroke-width={pathWidth}
                        stroke={`url(#${id}-${animationKey})`}
                        stroke-linecap="round"
                        fill="none"
                        use:motion
                    />
                </Motion>
                <defs>
                    <linearGradient id={`${id}-${animationKey}`} gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color={gradientStartColor} stop-opacity="0" />
                        <stop offset="20%" stop-color={gradientStartColor} stop-opacity="1" />
                        <stop offset="50%" stop-color={gradientStopColor} stop-opacity="1" />
                        <stop offset="80%" stop-color={gradientStopColor} stop-opacity="0" />
                        <stop offset="100%" stop-color={gradientStartColor} stop-opacity="0" />
                    </linearGradient>
                </defs>
            {/key}
        {/if}
    {/if}
</svg>
