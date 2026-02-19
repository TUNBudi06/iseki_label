<!-- Parent.svelte -->
<script lang="ts">
    import AnimatedBeam from '$lib/Beam/AnimatedBeam.svelte';
    import { User, CalendarClock, Search, Printer } from '@lucide/svelte';

    let { active = false } = $props();

    let containerRef = $state<HTMLElement | null>(null);
    let userNode = $state<HTMLElement | null>(null);
    let scheduleNode = $state<HTMLElement | null>(null);
    let dbNode = $state<HTMLElement | null>(null);
    let printNode = $state<HTMLElement | null>(null);

    // Track when all nodes are mounted
    let nodesReady = $derived(!!(userNode && scheduleNode && dbNode && printNode));
</script>

<div
    bind:this={containerRef}
    class="relative w-full h-128 bg-slate-900/50 rounded-xl overflow-hidden"
>
    <!-- Node 0: User -->
    <div
        bind:this={userNode}
        class="absolute left-20 top-20 w-30 h-16
           bg-linear-to-br from-blue-500 to-cyan-400
           rounded-2xl shadow-lg shadow-blue-500/30
           flex items-center justify-center text-white font-bold z-10"
    >
        <User size={20} />
        <span class="text-sm ps-2">Web Client</span>
    </div>

    <!-- Node 1: Schedule (RENDER BEFORE BEAMS!) -->
    <div
        bind:this={scheduleNode}
        class="absolute left-20 top-60 w-30 h-14
           bg-linear-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold z-10"
    >
        <CalendarClock size={20} />
        <span class="text-sm ps-2">Schedule</span>
    </div>

    <!-- Node 2: DB -->
    <div
        bind:this={dbNode}
        class="absolute left-96 top-40 w-30 h-14
           bg-linear-to-br from-fuchsia-500 to-rose-400
           rounded-2xl shadow-lg shadow-fuchsia-500/30
           flex items-center justify-center text-white font-bold z-10"
    >
        <Search size={20} />
        <span class="text-sm ps-2">DB</span>
    </div>

    <!-- Node 3: Print -->
    <div
        bind:this={printNode}
        class="absolute left-96 top-80 w-30 h-14
           bg-linear-to-br from-rose-500 to-orange-400
           rounded-2xl shadow-lg shadow-rose-500/30
           flex items-center justify-center text-white font-bold z-10"
    >
        <Printer size={20} />
        <span class="text-sm ps-2">Print</span>
    </div>
        <AnimatedBeam
            bind:containerRef
            bind:fromRef={userNode}
            bind:toRef={scheduleNode}
            trigger={active}
            duration={20}
            pathWidth={3}
        />

        <!-- Beam 1: Schedule → DB -->
        <AnimatedBeam
            bind:containerRef
            bind:fromRef={scheduleNode}
            bind:toRef={dbNode}
            static={true}
            duration={3}
            pathWidth={4}
            pathOpacity={1}
            curvature={80}
            startXOffset={60}
            startYOffset={-28}
            endXOffset={-60}
            gradientStartColor="#8b5cf6"
            gradientStopColor="#ec4899"
        />

        <!-- Beam 2: Schedule → Print -->
        <AnimatedBeam
            bind:containerRef
            bind:fromRef={scheduleNode}
            bind:toRef={printNode}
            static={true}
            duration={0.8}
            curvature={-80}
            startXOffset={60}
            startYOffset={28}
            endXOffset={-60}
            gradientStartColor="#ec4899"
            gradientStopColor="#f43f5e"
        />

        <!-- Beam 3: DB → Print -->
        <AnimatedBeam
            bind:containerRef
            bind:fromRef={dbNode}
            bind:toRef={printNode}
            static={true}
            duration={2}
            curvature={60}
            startYOffset={30}
            endYOffset={-30}
            gradientStartColor="#f43f5e"
            gradientStopColor="#f97316"
        />
</div>
