<script lang="ts">
import AnimatedBeam from "$lib/Beam/AnimatedBeam.svelte";

// ANIMATED BEAM HERE
let containerRef = $state<HTMLElement>();
let node1 = $state<HTMLElement>();
let node2a = $state<HTMLElement>(); // First node 2
let node2b = $state<HTMLElement>(); // Second node 2
let node3 = $state<HTMLElement>();

// Triggers for each beam segment
let triggers = $state({
    beam1: false, // 1 -> 2a
    beam2: false, // 2a -> 2b
    beam3: false, // 2b -> 1
    beam4: false, // 1 -> 3
});

let isAnimating = $state(false);

async function playSequence() {
    if (isAnimating) return;
    isAnimating = true;

    // Reset all
    triggers = { beam1: false, beam2: false, beam3: false, beam4: false };
    await delay(50);

    // 1 -> 2 (first)
    triggers.beam1 = true;
    await delay(800);

    // 2 -> 2 (second)
    triggers.beam2 = true;
    await delay(800);

    // 2 -> 1
    triggers.beam3 = true;
    await delay(800);

    // 1 -> 3
    triggers.beam4 = true;
    await delay(1000);

    // Reset for next play
    triggers = { beam1: false, beam2: false, beam3: false, beam4: false };
    isAnimating = false;
}

function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}
</script>


<div
    bind:this={containerRef}
    class="relative w-full h-96 bg-neutral-950 rounded-xl overflow-hidden"
>
    <!-- Node 1 (Left side, center) -->
    <div
        bind:this={node1}
        class="absolute left-20 top-1/2 -translate-y-1/2 w-16 h-16
           bg-gradient-to-br from-blue-500 to-cyan-400
           rounded-2xl shadow-lg shadow-blue-500/30
           flex items-center justify-center text-white font-bold text-xl"
    >
        1
    </div>

    <!-- Node 2a (Middle left) -->
    <div
        bind:this={node2a}
        class="absolute left-1/3 top-20 w-14 h-14
           bg-gradient-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold text-lg"
    >
        2a
    </div>

    <!-- Node 2b (Middle right) -->
    <div
        bind:this={node2b}
        class="absolute left-1/3 bottom-20 w-14 h-14
           bg-gradient-to-br from-purple-500 to-pink-400
           rounded-2xl shadow-lg shadow-purple-500/30
           flex items-center justify-center text-white font-bold text-lg"
    >
        2b
    </div>

    <!-- Node 3 (Right side) -->
    <div
        bind:this={node3}
        class="absolute right-20 top-1/2 -translate-y-1/2 w-16 h-16
           bg-gradient-to-br from-orange-500 to-red-400
           rounded-2xl shadow-lg shadow-orange-500/30
           flex items-center justify-center text-white font-bold text-xl"
    >
        3
    </div>

    <!-- Beam 1: 1 -> 2a -->
    <AnimatedBeam
        {containerRef}
        fromRef={node1}
        static={true}
        toRef={node2a}
        trigger={triggers.beam1}
        curvature={-50}
        duration={2}
        gradientStartColor="#3b82f6"
        gradientStopColor="#a855f7"
        pathColor="#3b82f6"
    />

    <!-- Beam 2: 2a -> 2b -->
    <AnimatedBeam
        {containerRef}
        fromRef={node2a}
        toRef={node2b}
        trigger={triggers.beam2}
        curvature={0}
        duration={1.2}
        gradientStartColor="#a855f7"
        gradientStopColor="#ec4899"
        pathColor="#a855f7"
    />

    <!-- Beam 3: 2b -> 1 -->
    <AnimatedBeam
        {containerRef}
        fromRef={node2b}
        toRef={node1}
        trigger={triggers.beam3}
        curvature={50}
        duration={1.5}
        gradientStartColor="#ec4899"
        gradientStopColor="#3b82f6"
        pathColor="#ec4899"
        reverse={true}
    />

    <!-- Beam 4: 1 -> 3 -->
    <AnimatedBeam
        {containerRef}
        fromRef={node1}
        toRef={node3}
        trigger={triggers.beam4}
        curvature={0}
        duration={2}
        gradientStartColor="#3b82f6"
        gradientStopColor="#f97316"
        pathColor="#3b82f6"
    />

    <!-- Play Button -->
    <button
        onclick={playSequence}
        disabled={isAnimating}
        class="absolute bottom-6 left-1/2 -translate-x-1/2
           px-6 py-3 bg-white text-black font-semibold rounded-full
           hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed
           transition-all active:scale-95 shadow-lg"
    >
        {isAnimating ? 'Playing...' : 'Play Sequence'}
    </button>
</div>
