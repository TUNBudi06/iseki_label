<!-- lib/components/AnimatedBeam.svelte -->
<script lang="ts">
    import { cn } from '$shadcn/utils';
    import { untrack } from 'svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        class?: string;
        containerRef?: HTMLElement;
        fromRef?: HTMLElement;
        toRef?: HTMLElement;
        curvature?: number;
        reverse?: boolean;
        duration?: number;
        pathColor?: string;
        pathWidth?: number;
        pathOpacity?: number;
        gradientStartColor?: string;
        gradientStopColor?: string;
        startXOffset?: number;
        startYOffset?: number;
        endXOffset?: number;
        endYOffset?: number;
        trigger?: boolean;
        static?: boolean;
        glowIntensity?: number;
        beamLength?: number;
        // Dynamic color props
        startColor?: string;
        endColor?: string;
        children?: Snippet;
    }

    let {
        class: className = '',
        containerRef,
        fromRef,
        toRef,
        curvature = 0,
        reverse = false,
        duration = 1.5,
        pathColor = 'gray',
        pathWidth = 2,
        pathOpacity = 0.2,
        gradientStartColor = '#ffaa40',
        gradientStopColor = '#9c40ff',
        startXOffset = 0,
        startYOffset = 0,
        endXOffset = 0,
        endYOffset = 0,
        trigger = false,
        static: isStatic = false,
        glowIntensity = 5,
        beamLength = 0.3,
        // Use provided colors or fall back to gradient colors
        startColor = $bindable(gradientStartColor),
        endColor = $bindable(gradientStopColor),
        children,
    }: Props = $props();

    // Reactive colors - update when props change
    let currentStartColor = $derived(startColor || gradientStartColor);
    let currentEndColor = $derived(endColor || gradientStopColor);

    let id = crypto.randomUUID().slice(0, 8);
    let pathD = $state('');
    let pathLength = $state(1000);
    let svgDimensions = $state({ width: 0, height: 0 });

    let animationKey = $state(0);
    let lastTrigger = $state(false);
    let progress = $state(0);
    let isAnimating = $state(false);

    let glowLayers = $derived(Math.floor(glowIntensity / 2) + 1);

    function updatePath() {
        if (!containerRef || !fromRef || !toRef) return;

        const containerRect = containerRef.getBoundingClientRect();
        const rectA = fromRef.getBoundingClientRect();
        const rectB = toRef.getBoundingClientRect();

        svgDimensions = {
            width: containerRect.width,
            height: containerRect.height,
        };

        const startX =
            rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY =
            rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX =
            rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY =
            rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        pathD = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
    }

    $effect(() => {
        if (!pathD) return;
        const tempSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
        );
        const tempPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path',
        );
        tempPath.setAttribute('d', pathD);
        tempSvg.appendChild(tempPath);
        document.body.appendChild(tempSvg);
        pathLength = tempPath.getTotalLength();
        document.body.removeChild(tempSvg);
    });

    $effect(() => {
        const currentTrigger = trigger;

        if (currentTrigger && !lastTrigger) {
            untrack(() => {
                animationKey++;
                isAnimating = true;
                progress = 0;
            });

            const startTime = performance.now();
            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const newProgress = Math.min(elapsed / (duration * 1000), 1);

                progress = newProgress;

                if (newProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    isAnimating = false;
                }
            };
            requestAnimationFrame(animate);
        }

        untrack(() => {
            lastTrigger = currentTrigger;
        });
    });

    $effect(() => {
        if (!containerRef) return;

        updatePath();

        const resizeObserver = new ResizeObserver(() => {
            updatePath();
        });

        resizeObserver.observe(containerRef);
        if (fromRef) resizeObserver.observe(fromRef);
        if (toRef) resizeObserver.observe(toRef);

        return () => {
            resizeObserver.disconnect();
        };
    });

    function getGradientStops(progress: number, reverse: boolean) {
        if (reverse) {
            const offset = 100 - progress * 120;
            return {
                x1: `${Math.max(0, offset + 10)}%`,
                x2: `${Math.max(0, offset)}%`,
            };
        } else {
            const offset = progress * 120 - 20;
            return {
                x1: `${Math.max(0, offset)}%`,
                x2: `${Math.max(0, offset + 10)}%`,
            };
        }
    }

    let animatedStops = $derived(
        isAnimating
            ? getGradientStops(progress, reverse)
            : { x1: '0%', x2: '0%' },
    );

    let dashArray = $derived(pathLength * beamLength);
    let dashOffset = $derived(pathLength);
</script>

<svg
    fill="none"
    width={svgDimensions.width}
    height={svgDimensions.height}
    xmlns="http://www.w3.org/2000/svg"
    class={cn(
        'pointer-events-none absolute left-0 top-0 transform-gpu',
        className,
    )}
    viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
>
    <!-- Background path -->
    <path
        d={pathD}
        stroke={pathColor}
        stroke-width={pathWidth}
        stroke-opacity={isStatic ? 0.05 : pathOpacity}
        stroke-linecap="round"
        fill="none"
    />

    <!-- Trigger: beam satu kali -->
    {#if isAnimating}
        <path
            d={pathD}
            stroke-width={pathWidth}
            stroke={`url(#${id}-trigger)`}
            stroke-opacity="1"
            stroke-linecap="round"
            fill="none"
            class="glow-core"
        />
    {/if}

    <!-- Static: beam berjalan terus -->
    {#if isStatic}
        {#each Array(glowLayers) as _, i}
            <path
                d={pathD}
                stroke-width={pathWidth * (3 + i)}
                stroke={currentStartColor}
                stroke-opacity={0.3 / (i + 1)}
                stroke-linecap="round"
                fill="none"
                stroke-dasharray="{dashArray} {pathLength}"
                stroke-dashoffset={dashOffset}
                style="filter: blur({3 + i * 2}px);"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    from={reverse ? -pathLength : pathLength}
                    to={reverse ? pathLength : -pathLength}
                    dur="{duration}s"
                    repeatCount="indefinite"
                    calcMode="linear"
                />
            </path>
        {/each}

        <path
            d={pathD}
            stroke-width={pathWidth * 2}
            stroke={`url(#${id}-static-mid)`}
            stroke-opacity="0.8"
            stroke-linecap="round"
            fill="none"
            stroke-dasharray="{dashArray} {pathLength}"
            stroke-dashoffset={dashOffset}
            class="glow-mid"
        >
            <animate
                attributeName="stroke-dashoffset"
                from={reverse ? -pathLength : pathLength}
                to={reverse ? pathLength : -pathLength}
                dur="{duration}s"
                repeatCount="indefinite"
                calcMode="linear"
            />
        </path>

        <path
            d={pathD}
            stroke-width={pathWidth}
            stroke={`url(#${id}-static-core)`}
            stroke-opacity="1"
            stroke-linecap="round"
            fill="none"
            stroke-dasharray="{dashArray} {pathLength}"
            stroke-dashoffset={dashOffset}
            class="glow-core"
        >
            <animate
                attributeName="stroke-dashoffset"
                from={reverse ? -pathLength : pathLength}
                to={reverse ? pathLength : -pathLength}
                dur="{duration}s"
                repeatCount="indefinite"
                calcMode="linear"
            />
        </path>
    {/if}

    <defs>
        <!-- Trigger gradient - uses dynamic colors -->
        {#if isAnimating}
            <linearGradient id="{id}-trigger" gradientUnits="userSpaceOnUse">
                <stop
                    offset="0%"
                    stop-color={currentStartColor}
                    stop-opacity="0"
                />
                <stop
                    offset={animatedStops.x1}
                    stop-color={currentStartColor}
                />
                <stop offset={animatedStops.x2} stop-color={currentEndColor} />
                <stop
                    offset="100%"
                    stop-color={currentEndColor}
                    stop-opacity="0"
                />
            </linearGradient>
        {/if}

        <!-- Static gradients - uses dynamic colors -->
        {#if isStatic}
            <linearGradient
                id="{id}-static-mid"
                gradientUnits="userSpaceOnUse"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop
                    offset="0%"
                    stop-color={currentStartColor}
                    stop-opacity="0"
                />
                <stop
                    offset="20%"
                    stop-color={currentStartColor}
                    stop-opacity="0.8"
                />
                <stop
                    offset="50%"
                    stop-color={currentEndColor}
                    stop-opacity="0.9"
                />
                <stop
                    offset="80%"
                    stop-color={currentEndColor}
                    stop-opacity="0.8"
                />
                <stop
                    offset="100%"
                    stop-color={currentEndColor}
                    stop-opacity="0"
                />
            </linearGradient>

            <linearGradient
                id="{id}-static-core"
                gradientUnits="userSpaceOnUse"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
                <stop
                    offset="15%"
                    stop-color={currentStartColor}
                    stop-opacity="1"
                />
                <stop offset="40%" stop-color="#ffffff" stop-opacity="0.9" />
                <stop
                    offset="60%"
                    stop-color={currentEndColor}
                    stop-opacity="1"
                />
                <stop offset="85%" stop-color="#ffffff" stop-opacity="0.9" />
                <stop
                    offset="100%"
                    stop-color={currentEndColor}
                    stop-opacity="0"
                />
            </linearGradient>
        {/if}
    </defs>
</svg>

{@render children?.()}

<style>
    .glow-core {
        filter: drop-shadow(0 0 2px currentColor)
            drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor);
    }

    .glow-mid {
        filter: drop-shadow(0 0 6px currentColor)
            drop-shadow(0 0 12px currentColor);
    }
</style>
