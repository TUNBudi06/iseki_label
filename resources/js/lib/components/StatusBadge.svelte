<script lang="ts">
    import { Badge } from '$shadcn/components/ui/badge';
    import {
        CheckCircle2,
        AlertCircle,
        XCircle,
        Loader2,
    } from '@lucide/svelte';

    interface Props {
        status: 'ready' | 'warning' | 'error' | 'loading';
        text: string;
    }

    let { status, text }: Props = $props();

    const config = {
        ready: {
            variant: 'default' as const,
            icon: CheckCircle2,
            class: 'bg-green-500/10 text-green-600 border-green-500/20',
        },
        warning: {
            variant: 'secondary' as const,
            icon: AlertCircle,
            class: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        },
        error: { variant: 'destructive' as const, icon: XCircle, class: '' },
        loading: { variant: 'outline' as const, icon: Loader2, class: '' },
    };

    let { variant, icon: Icon, class: className } = $derived(config[status]);
</script>

<Badge {variant} class="flex items-center gap-1.5 px-2.5 py-1 {className}">
    <Icon class="w-3.5 h-3.5 {status === 'loading' ? 'animate-spin' : ''}" />
    <span class="font-medium">{text}</span>
</Badge>
