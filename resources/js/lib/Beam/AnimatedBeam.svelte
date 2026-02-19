<!-- lib/components/AnimatedBeam.svelte -->
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
        duration?: number;          // Time for one meteor to travel
        delay?: number;
        pathColor?: string;         // Background path color
        pathWidth?: number;         // Meteor core thickness
        pathOpacity?: number;       // Background path opacity
        gradientStartColor?: string; // Meteor head color
        gradientStopColor?: string;  // Glow/trail color
        startXOffset?: number;
        startYOffset?: number;
        endXOffset?: number;
        endYOffset?: number;
        static?: boolean;           // Continuous meteor shower
        trigger?: boolean;          // Fire one meteor on rising edge
        reverse?: boolean;          // Direction: false = A→B, true = B→A
        onCompleted?: () => void;
    }

    let {
        class: className = "",
        containerRef,
        fromRef,
        toRef,
        curvature = 0,
        duration = 1.2,
        delay = 0,
        pathColor = "gray",
        pathWidth = 4,
        pathOpacity = 0.1,
        gradientStartColor = "#ffaa40",
        gradientStopColor = "#9c40ff",
        startXOffset = 0,
        startYOffset = 0,
        endXOffset = 0,
        endYOffset = 0,
        static: isStatic = false,
        trigger = false,
        reverse = false,
        onCompleted,
    }: Props = $props();

    let id = $state(crypto.randomUUID().slice(0, 8));
    let pathD = $state("");
    let pathLength = $state(1);
    let svgDimensions = $state({ width: 0, height: 0 });
    let isReady = $state(false);
    let isAnimating = $state(false);
    let lastTrigger = $state(false);
    let animationKey = $state(0);

    // easeOutExpo: https://easings.net/#easeOutExpo → f(x) = x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
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

        // Measure path length for dash animation
        const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempPath.setAttribute("d", pathD);
        tempSvg.appendChild(tempPath);
        document.body.appendChild(tempSvg);
        pathLength = tempPath.getTotalLength() || 1;
        document.body.removeChild(tempSvg);
    }

    // Rising edge detection
    $effect(() => {
        if (!isStatic && trigger && !lastTrigger) {
            untrack(() => {
                animationKey++;
                isAnimating = true;
            });
        }
        lastTrigger = trigger;
    });

    // Auto-reset after one-shot
    $effect(() => {
        if (isAnimating && !isStatic) {
            const t = setTimeout(() => {
                isAnimating = false;
                onCompleted?.();
            }, (delay + duration) * 1000);
            return () => clearTimeout(t);
        }
    });

    // Init & resize
    $effect(() => {
        updatePath();
        if (!isReady) tick().then(updatePath);

        const ro = new ResizeObserver(updatePath);
        if (containerRef) ro.observe(containerRef);
        if (fromRef) ro.observe(fromRef);
        if (toRef) ro.observe(toRef);
        return () => ro.disconnect();
    });

    // Compute dash offset based on direction
    let initialOffset = $derived(reverse ? pathLength : -pathLength * 0.12);
    let finalOffset = $derived(reverse ? -pathLength * 0.12 : pathLength);
    let dashSize = $derived(pathLength * 0.12); // 12% = compact meteor
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
        <!-- Subtle background path -->
        <path
            d={pathD}
            stroke={pathColor}
            stroke-width={1}
            stroke-opacity={pathOpacity}
            stroke-linecap="round"
        />

        <!-- STATIC: Continuous meteor shower -->
        {#if isStatic}
            <!-- Core meteor -->
            <Motion
                initial={{ strokeDashoffset: initialOffset }}
                animate={{ strokeDashoffset: finalOffset }}
                transition={{
                    duration: duration * 0.9,
                    delay,
                    ease: easeOutExpo,
                    repeat: Infinity,
                    repeatDelay: duration * 0.3 // Gap between meteors
                }}
                attr
                let:motion
            >
                <path
                    d={pathD}
                    stroke={gradientStartColor}
                    stroke-width={pathWidth}
                    stroke-linecap="round"
                    stroke-dasharray="{dashSize} {pathLength}"
                    use:motion
                />
            </Motion>

            <!-- Glow trail -->
            <Motion
                initial={{ strokeDashoffset: initialOffset }}
                animate={{ strokeDashoffset: finalOffset }}
                transition={{
                    duration: duration * 0.9,
                    delay: delay + 0.05,
                    ease: easeOutExpo,
                    repeat: Infinity,
                    repeatDelay: duration * 0.3
                }}
                attr
                let:motion
            >
                <path
                    d={pathD}
                    stroke={gradientStopColor}
                    stroke-width={pathWidth * 2}
                    stroke-opacity={0.5}
                    stroke-linecap="round"
                    stroke-dasharray="{dashSize * 1.5} {pathLength}"
                    use:motion
                />
            </Motion>

            <!-- TRIGGER: One-shot meteor -->
        {:else if isAnimating}
            {#key animationKey}
                <Motion
                    initial={{ strokeDashoffset: initialOffset }}
                    animate={{ strokeDashoffset: finalOffset }}
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
                        stroke={gradientStartColor}
                        stroke-width={pathWidth}
                        stroke-linecap="round"
                        stroke-dasharray="{dashSize} {pathLength}"
                        use:motion
                    />
                </Motion>
            {/key}
        {/if}
    {/if}
</svg>
