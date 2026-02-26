<script lang="ts">
    import { cn } from '$shadcn/utils';
    import { untrack } from 'svelte';
    import { M } from 'motion-start';
    import {v4 as uuidv4} from 'uuid';

    interface Props {
        class?: any;
        containerRef: any;
        fromRef: any;
        toRef: any;
        curvature?: number;
        reverse?: boolean;
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
        static?: boolean; // ← NEW
        trigger?: boolean; // ← NEW
        onAnimationStart?: () => void; // ← NEW
        onAnimationComplete?: () => void; // ← NEW
    }

    let {
        class: className = '',
        containerRef = $bindable(null),
        fromRef = $bindable(null),
        toRef = $bindable(null),
        curvature = 0,
        reverse = false,
        duration = Math.random() * 3 + 4,
        delay = 0,
        pathColor = 'gray',
        pathWidth = 2,
        pathOpacity = 0.2,
        gradientStartColor = '#ffaa40',
        gradientStopColor = '#9c40ff',
        startXOffset = 0,
        startYOffset = 0,
        endXOffset = 0,
        endYOffset = 0,
        static: isStatic = false, // defaults to static mode
        trigger = false, // for one-shot
        onAnimationStart,
        onAnimationComplete,
    }: Props = $props();

    let id = $state(uuidv4().slice(0, 8));
    let pathD = $state('');
    let svgDimensions = $state({ width: 0, height: 0 });
    let isReady = $state(false);
    let isAnimating = $state(false);
    let lastTrigger = $state(false);
    let animationKey = $state(0);

    // Store actual pixel coords of path start/end for gradient animation
    let pathCoords = $state({ startX: 0, startY: 0, endX: 0, endY: 0 });

    // Gradient coordinates in pixels — beam moves from startX→endX (or reversed)
    // We extend slightly beyond the endpoints so the gradient head/tail is fully visible
    let gradientCoordinates = $derived(() => {
        const { startX, startY, endX, endY } = pathCoords;
        // beam width span in pixels (roughly 20% of path length as gradient head)
        const dx = endX - startX;
        const dy = endY - startY;
        const pathLen = Math.sqrt(dx * dx + dy * dy) || 1;
        const headSize = pathLen * 0.25; // gradient head = 25% of path length

        if (reverse) {
            return {
                x1: [endX + headSize, startX - headSize],
                x2: [endX, startX],
                y1: [endY, startY],
                y2: [endY, startY],
            };
        }
        return {
            x1: [startX - headSize, endX + headSize],
            x2: [startX, endX],
            y1: [startY, endY],
            y2: [startY, endY],
        };
    });

    function updatePath() {
        if (!containerRef || !fromRef || !toRef) {
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

        pathCoords = { startX, startY, endX, endY };
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
                onAnimationStart?.();
            });
        }
        lastTrigger = trigger;
    });

    // Init & resize
    $effect(() => {
        updatePath();

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
    class={cn(
        'pointer-events-none absolute top-0 left-0 transform-gpu',
        className,
    )}
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
        />

        <!-- Static: infinite beam -->
        {#if isStatic}
            <path
                d={pathD}
                stroke-width={pathWidth}
                stroke={`url(#${id}-static)`}
                stroke-linecap="round"
            />
            <defs>
                <M.linearGradient
                    id={`${id}-static`}
                    gradientUnits="userSpaceOnUse"
                    class="transform-gpu"
                    initial={{
                        x1: gradientCoordinates().x1[0],
                        x2: gradientCoordinates().x2[0],
                        y1: gradientCoordinates().y1[0],
                        y2: gradientCoordinates().y2[0],
                    }}
                    animate={{
                        x1: gradientCoordinates().x1,
                        x2: gradientCoordinates().x2,
                        y1: gradientCoordinates().y1,
                        y2: gradientCoordinates().y2,
                    }}
                    transition={{
                        delay,
                        duration,
                        ease: [0.16, 1, 0.3, 1],
                        repeat: Infinity,
                    }}
                    {onAnimationStart}
                    {onAnimationComplete}
                >
                    <stop
                        offset="0%"
                        stop-color={gradientStartColor}
                        stop-opacity="0"
                    />
                    <stop offset="0%" stop-color={gradientStartColor} />
                    <stop offset="32.5%" stop-color={gradientStopColor} />
                    <stop
                        offset="100%"
                        stop-color={gradientStopColor}
                        stop-opacity="0"
                    />
                </M.linearGradient>
            </defs>

            <!-- Trigger: one-shot beam -->
        {:else if isAnimating}
            {#key animationKey}
                <path
                    d={pathD}
                    stroke-width={pathWidth}
                    stroke={`url(#${id}-${animationKey})`}
                    stroke-linecap="round"
                />
                <defs>
                    <M.linearGradient
                        id={`${id}-${animationKey}`}
                        gradientUnits="userSpaceOnUse"
                        class="transform-gpu"
                        initial={{
                            x1: gradientCoordinates().x1[0],
                            x2: gradientCoordinates().x2[0],
                            y1: gradientCoordinates().y1[0],
                            y2: gradientCoordinates().y2[0],
                        }}
                        animate={{
                            x1: gradientCoordinates().x1,
                            x2: gradientCoordinates().x2,
                            y1: gradientCoordinates().y1,
                            y2: gradientCoordinates().y2,
                        }}
                        transition={{
                            delay,
                            duration,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        {onAnimationStart}
                        onAnimationComplete={() => {
                            isAnimating = false;
                            onAnimationComplete?.();
                        }}
                    >
                        <stop
                            offset="0%"
                            stop-color={gradientStartColor}
                            stop-opacity="0"
                        />
                        <stop offset="0%" stop-color={gradientStartColor} />
                        <stop offset="32.5%" stop-color={gradientStopColor} />
                        <stop
                            offset="100%"
                            stop-color={gradientStopColor}
                            stop-opacity="0"
                        />
                    </M.linearGradient>
                </defs>
            {/key}
        {/if}
    {/if}
</svg>
