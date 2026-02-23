<script lang="ts">
    interface NodeData {
        id: string;
        label: string;
        icon: any;
        x: number;
        y: number;
    }

    interface Props {
        node: NodeData;
        status: 'pending' | 'active' | 'completed' | 'error';
        setRef: (el: HTMLElement | null) => void;
    }

    let { node, status, setRef }: Props = $props();

    let el = $state<HTMLElement | null>(null);

    $effect(() => {
        setRef(el);
    });

    const statusStyles = {
        pending:
            'bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400',
        active: 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/30 animate-pulse',
        completed: 'bg-green-500 text-white border-green-600',
        error: 'bg-red-500 text-white border-red-600',
    };

    const Icon = $derived(node.icon);
</script>

<div
    bind:this={el}
    class="absolute w-24 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 {statusStyles[
        status
    ]}"
    style="left: {node.x}px; top: {node.y}px; transform: translate(-50%, -50%);"
>
    <Icon class="w-5 h-5" />
    <span class="text-xs font-medium text-center leading-tight"
        >{node.label}</span
    >
</div>
