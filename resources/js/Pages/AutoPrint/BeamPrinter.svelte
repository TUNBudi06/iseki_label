<script lang="ts">
    import AnimatedBeam from '$lib/Beam/AnimatedBeam.svelte';
    import { User as UserIcon, CalendarClock,DatabaseSearch } from '@lucide/svelte';

    let { active = false } = $props();

    // ANIMATED BEAM HERE
    let containerRef = $state<HTMLElement>();
    let userNode = $state<HTMLElement>();
    let scheduleNode = $state<HTMLElement>(); // First node 2
    let node2b = $state<HTMLElement>(); // Second node 2
    let node3 = $state<HTMLElement>();

    let isAnimating = $state(false);

    async function playSequence() {
        if (isAnimating) return;
        isAnimating = true;

        isAnimating = false;
    }

    function delay(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }
</script>

<div
    bind:this={containerRef}
    class="relative w-full h-128 bg-transparent rounded-xl overflow-hidden"
>
    <!-- Node 1 (Left side, center) -->
    <div
        bind:this={userNode}
        class="absolute left-20 top-1/6 -translate-y-1/2 w-30 h-16
           bg-linear-to-br from-blue-500 to-cyan-400
           rounded-2xl shadow-lg shadow-blue-500/30
           flex items-center justify-center text-white font-bold text-xl"
    >
        <UserIcon />
        <span class="text-sm ps-1">Schedule</span>
    </div>

    <!-- Node 2a (Middle left) -->
    <div
        bind:this={scheduleNode}
        class="absolute left-20 top-60 w-30 h-14
           bg-linear-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold text-lg"
    >
        <CalendarClock />
        <span class="text-sm ps-1">Schedule</span>
    </div>

    <AnimatedBeam
        {containerRef}
        startYOffset={30}
        startColor="#e0f2fe"
        endColor="#fce7f3"
        pathColor="#f472b6"
        pathWidth={3}
        glowIntensity={6}
        endYOffset={-25}
        static={active}
        fromRef={userNode}
        toRef={scheduleNode}
    />

    <div
        class="absolute left-100 top-40 w-30 h-14
           bg-linear-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold text-lg"
    >
        <DatabaseSearch />
        <span class="text-sm ps-1">DB</span>
    </div>

    <div
        class="absolute left-100 top-80 w-30 h-14
           bg-linear-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold text-lg"
    >
        <CalendarClock />
        <span class="text-sm ps-1">DB</span>
    </div>
</div>
