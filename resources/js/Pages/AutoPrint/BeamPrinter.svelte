<!-- Parent.svelte -->
<script lang="ts">
    import AnimatedBeam from '$lib/Beam/AnimatedBeam.svelte';
    import { User, CalendarClock, Search, Printer } from '@lucide/svelte';

    let { active = false } = $props();

    let containerRef = $state<HTMLElement>();
    let userNode = $state<HTMLElement>();
    let scheduleNode = $state<HTMLElement>();
    let dbNode = $state<HTMLElement>();
    let printNode = $state<HTMLElement>();

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
           bg-gradient-to-br from-blue-500 to-cyan-400
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
           bg-gradient-to-br from-purple-500 to-pink-400
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
           bg-gradient-to-br from-fuchsia-500 to-rose-400
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
           bg-gradient-to-br from-rose-500 to-orange-400
           rounded-2xl shadow-lg shadow-rose-500/30
           flex items-center justify-center text-white font-bold z-10"
    >
        <Printer size={20} />
        <span class="text-sm ps-2">Print</span>
    </div>

    <!-- BEAMS: Rendered AFTER all nodes they reference -->

    <!-- Beam 0: User → Schedule -->
    {#if nodesReady}
        <AnimatedBeam
            {containerRef}
            fromRef={userNode}
            toRef={scheduleNode}
            static={true}
            duration={2}
            gradientStartColor="#3b82f6"
            gradientStopColor="#8b5cf6"
        />

        <!-- Beam 1: Schedule → DB -->
        <AnimatedBeam
            {containerRef}
            fromRef={scheduleNode}
            toRef={dbNode}
            static={true}
            duration={30}
            curvature={80}
            startXOffset={60}
            startYOffset={-28}
            endXOffset={-60}
            gradientStartColor="#8b5cf6"
            gradientStopColor="#ec4899"
        />

        <!-- Beam 2: Schedule → Print -->
        <AnimatedBeam
            {containerRef}
            fromRef={scheduleNode}
            toRef={printNode}
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
            {containerRef}
            fromRef={dbNode}
            toRef={printNode}
            static={true}
            duration={2}
            curvature={60}
            startYOffset={30}
            endYOffset={-30}
            gradientStartColor="#f43f5e"
            gradientStopColor="#f97316"
        />
    {/if}
</div>
