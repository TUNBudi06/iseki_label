<!-- AnimatedBeam.svelte -->
<script lang="ts">
    import { cn } from "$shadcn/utils";
    import { tick } from "svelte";

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
    let triggerPrev = $state(false);
    let animationKey = $state(0);

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

    // Rising edge trigger
    $effect(() => {
        if (trigger && !triggerPrev && !isStatic) {
            animationKey += 1;
            isAnimating = true;
            // Auto reset after animation
            setTimeout(() => {
                isAnimating = false;
                onCompleted?.();
            }, (delay + duration) * 1000);
        }
        triggerPrev = trigger;
    });

    // Init
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
            <!-- Static: CSS animation, seamless loop -->
            <path
                d={pathD}
                stroke-width={pathWidth}
                stroke={`url(#${id}-static)`}
                stroke-opacity="1"
                stroke-linecap="round"
                fill="none"
            />
            <defs>
                <linearGradient id={`${id}-static`} gradientUnits="userSpaceOnUse" class="beam-gradient">
                    <stop offset="0%" stop-color={gradientStartColor} stop-opacity="0" />
                    <stop offset="20%" stop-color={gradientStartColor} stop-opacity="1" />
                    <stop offset="50%" stop-color={gradientStopColor} stop-opacity="1" />
                    <stop offset="80%" stop-color={gradientStopColor} stop-opacity="0" />
                    <stop offset="100%" stop-color={gradientStartColor} stop-opacity="0" />
                    <animate
                        attributeName="x1"
                        values="-100%;100%;-100%"
                        dur="{duration}s"
                        begin="{delay}s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="x2"
                        values="0%;200%;0%"
                        dur="{duration}s"
                        begin="{delay}s"
                        repeatCount="indefinite"
                    />
                </linearGradient>
            </defs>
        {:else if isAnimating}
            <!-- Trigger: SMIL animation, one shot -->
            {#key animationKey}
                <path
                    d={pathD}
                    stroke-width={pathWidth}
                    stroke={`url(#${id}-${animationKey})`}
                    stroke-opacity="1"
                    stroke-linecap="round"
                    fill="none"
                />
                <defs>
                    <linearGradient id={`${id}-${animationKey}`} gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color={gradientStartColor} stop-opacity="0" />
                        <stop offset="20%" stop-color={gradientStartColor} stop-opacity="1" />
                        <stop offset="50%" stop-color={gradientStopColor} stop-opacity="1" />
                        <stop offset="80%" stop-color={gradientStopColor} stop-opacity="0" />
                        <stop offset="100%" stop-color={gradientStartColor} stop-opacity="0" />
                        <animate
                            attributeName="x1"
                            values="-100%;100%"
                            dur="{duration}s"
                            begin="{delay}s"
                            fill="freeze"
                            on:endEvent={() => { isAnimating = false; onCompleted?.(); }}
                        />
                        <animate
                            attributeName="x2"
                            values="0%;200%"
                            dur="{duration}s"
                            begin="{delay}s"
                            fill="freeze"
                        />
                    </linearGradient>
                </defs>
            {/key}
        {/if}
    {/if}
</svg>
