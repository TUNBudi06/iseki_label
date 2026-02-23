<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { createMachine, assign, fromPromise } from 'xstate';
    import { useMachine } from '@xstate/svelte';

    // Stores & Modules
    import { printModule, type PrintModuleState } from '$lib/print-module-svelte';
    import { useInterval, IsMounted } from 'runed';
    import { routeUrl } from '@tunbudi06/inertia-route-helper';

    // API
    import { listAuto, markAutoPrint } from '$routes/api/auto-print';

    // Components
    import Navbar from '$/Layouts/Navbar.svelte';
    import AutoRender from '$/Pages/AutoPrint/AutoRender.svelte';
    import AnimatedBeam from '$lib/Beam/AnimatedBeam.svelte';
    import StatusBadge from '$lib/components/StatusBadge.svelte';
    import WorkflowNode from '$lib/components/WorkflowNode.svelte';

    // Shadcn UI
    import * as Card from '$shadcn/components/ui/card';
    import { Label } from '$shadcn/components/ui/label';
    import { Select, SelectTrigger, SelectContent, SelectItem } from '$shadcn/components/ui/select';
    import { Button } from '$shadcn/components/ui/button';
    import { Input } from '$shadcn/components/ui/input';
    import { Badge } from '$shadcn/components/ui/badge';
    import { Separator } from '$shadcn/components/ui/separator';

    // Icons - @lucide/svelte
    import {
        PrinterCheck,
        Play,
        Square,
        User,
        Database,
        Search,
        CalendarClock,
        ChevronLeft,
        BetweenHorizontalStart,
        Shredder,
        HardDriveUpload,
        Stamp,
        RefreshCw,
        AlertCircle,
        CheckCircle2,
        Loader2
    } from '@lucide/svelte';

    // ============================================================================
    // TYPES
    // ============================================================================

    interface WorkflowNodeData {
        id: string;
        label: string;
        icon: any;
        x: number;
        y: number;
    }

    interface PrintContext {
        queueData: any[];
        renderedData: any[];
        pdfBlob: Blob | null;
        printOk: boolean;
        uploadOk: boolean;
        error: string | null;
        lastRunAt: number | null;
    }

    // ============================================================================
    // CONSTANTS
    // ============================================================================

    const DURATION_ANIMATION = 1.5;
    const MIN_INTERVAL = 2000;

    // ─── Layout (container 980 × 440) ───────────────────────────────────────────
    // Row 1 (y=70):  client → scheduler → fetching → parsing → array_show
    // Row 2 (y=210): datalist → rendering → generating → printing → print_ok
    // Row 3 (y=350): (empty)               uploading → upload_ok
    // ────────────────────────────────────────────────────────────────────────────
    const WORKFLOW_NODES: WorkflowNodeData[] = [
        // Row 1
        { id: 'client',      label: 'Web Client', icon: User,                   x: 80,  y: 70  },
        { id: 'scheduler',   label: 'Scheduler',  icon: CalendarClock,          x: 230, y: 70  },
        { id: 'fetching',    label: 'Fetching',   icon: Search,                 x: 380, y: 70  },
        { id: 'parsing',     label: 'Parse DB',   icon: Database,               x: 530, y: 70  },
        { id: 'array_show',  label: 'Queue',      icon: ChevronLeft,            x: 680, y: 70  },
        // Row 2
        { id: 'datalist',    label: 'Data List',  icon: BetweenHorizontalStart, x: 80,  y: 210 },
        { id: 'rendering',   label: 'Render',     icon: Shredder,               x: 230, y: 210 },
        { id: 'generating',  label: 'Gen PDF',    icon: HardDriveUpload,        x: 380, y: 210 },
        { id: 'printing',    label: 'Printing',   icon: Stamp,                  x: 530, y: 210 },
        { id: 'print_ok',    label: 'Print OK',   icon: CheckCircle2,           x: 680, y: 210 },
        // Row 3
        { id: 'uploading',   label: 'Uploading',  icon: HardDriveUpload,        x: 380, y: 350 },
        { id: 'upload_ok',   label: 'Upload OK',  icon: CheckCircle2,           x: 530, y: 350 },
    ];

    // ============================================================================
    // XSTATE MACHINE - Graceful empty queue handling
    // ============================================================================

    const printMachine = createMachine({
        id: 'printWorkflow',
        initial: 'idle',
        context: {
            queueData: [],
            renderedData: [],
            pdfBlob: null,
            printOk: false,
            uploadOk: false,
            error: null,
            lastRunAt: null,
        } as PrintContext,
        states: {
            // ── Waiting for next tick ───────────────────────────────────────────
            idle: {
                on: { START: 'scheduling' }
            },

            // ── Scheduler fires, prepare for run ───────────────────────────────
            scheduling: {
                entry: assign({ error: null, printOk: false, uploadOk: false }),
                after: { [DURATION_ANIMATION * 1000]: 'fetching' }
            },

            // ── Hit API, get raw queue data ─────────────────────────────────────
            fetching: {
                invoke: {
                    src: 'fetchQueueData',
                    onDone: [
                        {
                            // Empty queue → skip silently back to idle
                            guard: ({ event }) => event.output.length === 0,
                            target: 'idle',
                            actions: assign({ lastRunAt: () => Date.now() })
                        },
                        {
                            target: 'parsing',
                            actions: assign({
                                queueData: ({ event }) => event.output,
                                renderedData: ({ event }) => event.output,
                                lastRunAt: () => Date.now(),
                            })
                        }
                    ],
                    onError: {
                        target: 'error',
                        actions: assign({ error: ({ event }) => (event.error as Error)?.message ?? String(event.error) })
                    }
                }
            },

            // ── Parse & store into context (represents DB write step) ──────────
            parsing: {
                after: { [DURATION_ANIMATION * 1000]: 'array_show' }
            },

            // ── Briefly show queue count in array node ─────────────────────────
            array_show: {
                after: { [DURATION_ANIMATION * 1000]: 'datalist' }
            },

            // ── Hand data to render engine (Data List node) ────────────────────
            datalist: {
                after: { [DURATION_ANIMATION * 1000]: 'rendering' }
            },

            // ── Render engine processes each item (Render node) ────────────────
            rendering: {
                // Longer pause: gives AutoRender DOM time to fully paint
                after: { [DURATION_ANIMATION * 1000 + 500]: 'generating' }
            },

            // ── Generate the PDF blob ───────────────────────────────────────────
            generating: {
                invoke: {
                    src: 'generatePdf',
                    onDone: {
                        target: 'printing',
                        actions: assign({ pdfBlob: ({ event }) => event.output })
                    },
                    onError: {
                        target: 'error',
                        actions: assign({ error: ({ event }) => (event.error as Error)?.message ?? String(event.error) })
                    }
                }
            },

            // ── Send to printer ─────────────────────────────────────────────────
            printing: {
                invoke: {
                    src: 'executePrint',
                    input: ({ context }: { context: PrintContext }) => context,
                    onDone: {
                        target: 'print_ok',
                        actions: assign({ printOk: true })
                    },
                    onError: {
                        target: 'error',
                        actions: assign({ error: ({ event }) => (event.error as Error)?.message ?? String(event.error) })
                    }
                }
            },

            // ── Print success confirmation node ─────────────────────────────────
            print_ok: {
                after: { [DURATION_ANIMATION * 1000]: 'uploading' }
            },

            // ── Upload result / mark jobs done in DB ────────────────────────────
            // If this fails everything stops (goes to error, service pauses)
            uploading: {
                invoke: {
                    src: 'executeUpload',
                    input: ({ context }: { context: PrintContext }) => context,
                    onDone: {
                        target: 'upload_ok',
                        actions: assign({ uploadOk: true })
                    },
                    onError: {
                        // Hard stop — upload failure means data integrity risk
                        target: 'error',
                        actions: assign({ error: ({ event }) => (event.error as Error)?.message ?? String(event.error) })
                    }
                }
            },

            // ── Upload success, cycle complete ──────────────────────────────────
            upload_ok: {
                after: { [DURATION_ANIMATION * 1000]: 'idle' },
                entry: assign({
                    queueData: [],
                    renderedData: [],
                    pdfBlob: null,
                })
            },

            // ── Hard error — service stops, user must dismiss ───────────────────
            error: {
                on: { RESET: 'idle' }
                // No auto-reset: upload errors must be manually acknowledged
            }
        }
    }).provide({
        actors: {
            fetchQueueData: fromPromise(async () => {
                const response = await fetch(routeUrl(listAuto()));
                if (!response.ok) throw new Error('Failed to fetch print queue');
                return response.json();
            }),

            generatePdf: fromPromise(async () => {
                if (!labelContainerRef) throw new Error('Label container not ready');

                // Wait for Svelte to flush DOM updates from renderedData
                await tick();
                await new Promise(r => setTimeout(r, 300));

                const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                    import('jspdf'),
                    import('html2canvas-pro')
                ]);

                const sheets = labelContainerRef.querySelectorAll('.A4-print-page');
                if (!sheets.length) throw new Error('No pages to print');

                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                for (let i = 0; i < sheets.length; i++) {
                    const sheet = sheets[i] as HTMLElement;
                    const canvas = await html2canvas(sheet, {
                        scale: 3, useCORS: true, logging: false,
                        width: sheet.offsetWidth, height: sheet.offsetHeight,
                    });
                    if (i > 0) pdf.addPage();
                    const canvasHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, Math.min(canvasHeight, 297));
                }
                return pdf.output('blob');
            }),

            executePrint: fromPromise(async ({ input }: { input: PrintContext }) => {
                if (!input.pdfBlob || !selectedPrinter) throw new Error('Missing PDF or printer');
                // TODO: call local print service
                console.log('Printing to:', selectedPrinter, 'size:', input.pdfBlob.size);

                // // download for test the result
                // const url = URL.createObjectURL(input.pdfBlob);
                // const link = document.createElement('a');
                // link.href = url;
                // link.download = `print-job-${Date.now()}.pdf`;
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
                // URL.revokeObjectURL(url);

                await new Promise(r => setTimeout(r, 1000));
            }),

            executeUpload: fromPromise(async ({ input }: { input: PrintContext }) => {
                const ids = input.queueData.map((item: any) => item.id);
                const formData = new FormData();
                formData.append('ids', JSON.stringify(ids));
                const response = await fetch(routeUrl(markAutoPrint()), { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Upload failed — service stopped');
            }),
        }
    } as any);

    // ============================================================================
    // COMPONENT STATE
    // ============================================================================

    let printerState = $state<PrintModuleState | null>(null);
    let selectedPrinter = $state<string | undefined>(undefined);
    let intervalMs = $state<number>(5000);

    // Refs
    let containerRef = $state<HTMLElement | null>(null);
    let labelContainerRef = $state<HTMLElement | null>(null);
    let nodeRefs: Record<string, HTMLElement | null> = $state({});

    // Services
    const printer = printModule();
    const mounted = new IsMounted();

    // XState machine
    const { snapshot, send } = useMachine(printMachine);

    // ============================================================================
    // DERIVED STATE
    // ============================================================================

    const activePrinter = $derived(
        printerState?.printer_list.find(p => p.name === selectedPrinter) ?? null
    );

    const isReady = $derived(
        printerState?.initialized && activePrinter?.status === 'Ready'
    );

    const canStart = $derived(
        isReady && $snapshot.value === 'idle'
    );

    // ============================================================================
    // INTERVAL MANAGEMENT
    // ============================================================================

    const interval = useInterval(() => Math.max(intervalMs, MIN_INTERVAL), {
        immediate: false,
        callback: async () => {
            if ($snapshot.value === 'idle') {
                send({ type: 'START' });
            }
        },
    });

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    onMount(async () => {
        await initializePrinter();
    });

    // ============================================================================
    // PRINTER METHODS
    // ============================================================================

    async function initializePrinter() {
        try {
            printerState = await printer.init();
            selectedPrinter = printerState?.default_printer?.name ?? undefined;
        } catch (err) {
            console.error(err);
        }
    }

    // ============================================================================
    // UI HELPERS
    // ============================================================================

    function getNodeStatus(nodeId: string): 'pending' | 'active' | 'completed' | 'error' {
        const v = $snapshot.value as string;

        // Ordered list of states in execution order
        const stateOrder = [
            'idle',
            'scheduling',
            'fetching',
            'parsing',
            'array_show',
            'datalist',
            'rendering',
            'generating',
            'printing',
            'print_ok',
            'uploading',
            'upload_ok',
        ];

        // Which node(s) are highlighted (active) for each state
        const activeMap: Record<string, string[]> = {
            idle:       [],
            scheduling: ['client', 'scheduler'],
            fetching:   ['fetching'],
            parsing:    ['parsing'],
            array_show: ['array_show'],
            datalist:   ['datalist'],
            rendering:  ['rendering'],
            generating: ['generating'],
            printing:   ['printing'],
            print_ok:   ['print_ok'],
            uploading:  ['uploading'],
            upload_ok:  ['upload_ok'],
            error:      [],
        };

        // A node is "done" (completed) after which state? First state that lists it.
        // A node is "completed" when the machine has moved PAST that state.
        const nodeCompletesAfterState: Record<string, string> = {
            client:      'scheduling',
            scheduler:   'scheduling',
            fetching:    'fetching',
            parsing:     'parsing',
            array_show:  'array_show',
            datalist:    'datalist',
            rendering:   'rendering',
            generating:  'generating',
            printing:    'printing',
            print_ok:    'print_ok',
            uploading:   'uploading',
            upload_ok:   'upload_ok',
        };

        const currentIdx = stateOrder.indexOf(v);
        const activeNodes = activeMap[v] ?? [];

        // Error state: show nodes that were completed before the error
        if (v === 'error') {
            // We don't know exactly where it failed, so show all as pending
            // (the error banner shows the message)
            return 'pending';
        }

        // Currently active node
        if (activeNodes.includes(nodeId)) return 'active';

        // Completed: this node's state already passed
        const completesAfter = nodeCompletesAfterState[nodeId];
        if (completesAfter) {
            const completesIdx = stateOrder.indexOf(completesAfter);
            if (currentIdx > completesIdx) return 'completed';
        }

        return 'pending';
    }

    // Stop interval automatically on error so it doesn't keep retrying
    $effect(() => {
        if ($snapshot.value === 'error' && interval.isActive) {
            interval.pause();
        }
    });

    function toggleService() {
        if (interval.isActive) {
            interval.pause();
        } else {
            interval.resume();
        }
    }

    function setNodeRef(nodeId: string, el: HTMLElement | null) {
        if (el) nodeRefs[nodeId] = el;
    }

    function formatLastRun(timestamp: number | null): string {
        if (!timestamp) return 'Never';
        const diff = Date.now() - timestamp;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        return new Date(timestamp).toLocaleTimeString();
    }

    // ============================================================================
    // DOCUMENTATION DATA
    // ============================================================================

    const workflowStages = [
        { phase: 'Web Client', desc: 'Entry point. Driven by scheduler interval.', trigger: 'START' },
        { phase: 'Scheduler', desc: 'Determines next step based on queue status.', trigger: 'auto' },
        { phase: 'Fetching', desc: 'Calls API to retrieve pending print jobs.', trigger: 'fetchQueueData' },
        { phase: 'Database', desc: 'Staging storage. Populated after successful fetch.', trigger: 'data loaded' },
        { phase: 'Queue', desc: 'Visual counter showing pending job count.', trigger: 'queueData.length' },
        { phase: 'Data List', desc: 'Processed jobs forwarded to render stage.', trigger: 'auto' },
        { phase: 'Generate', desc: 'Renders each job to print format (PDF/HTML).', trigger: 'generatePdf' },
        { phase: 'Print', desc: 'Sends to printer and uploads status.', trigger: 'executePrintAndUpload' },
        { phase: 'Result', desc: 'Final status. Resets task lock for next cycle.', trigger: 'auto' },
    ];

    const troubleshooting = [
        {
            problem: 'Client shows "Not initialized" or no printers listed',
            solution: 'Start the local Python print service (server.py) and click Refresh Status.'
        },
        {
            problem: 'Fetching returns empty array but jobs exist in DB',
            solution: 'Check that listAuto route returns correct data and authentication is valid.'
        },
        {
            problem: 'Animation moves but nothing prints',
            solution: 'Verify selected printer name matches OS printer exactly. Check SumatraPDF logs in tmp/print_jobs/.'
        },
        {
            problem: 'Multiple processes overlap / counter keeps incrementing',
            solution: 'Refresh page to reset status. XState prevents overlapping via state machine guards.'
        }
    ];
</script>

<Navbar>
    <div class="container mx-auto max-w-7xl space-y-6 p-4">
        <!-- Header -->
        <div class="text-center space-y-2" in:fade>
            <h1 class="text-4xl font-bold tracking-tight">Auto Print Service</h1>
            <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
                Automated label printing with visual workflow monitoring. Powered by XState.
            </p>
        </div>

        <!-- Status Bar - Only show real errors, not empty queue -->
        {#if $snapshot.context.error}
            <div class="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-3" transition:slide>
                <AlertCircle class="w-5 h-5" />
                <span class="font-medium">{$snapshot.context.error}</span>
                <Button variant="ghost" size="sm" onclick={() => send({ type: 'RESET' })} class="ml-auto">Dismiss</Button>
            </div>
        {/if}

        <!-- Info Bar - Show last run status when idle -->
        {#if $snapshot.value === 'idle' && $snapshot.context.lastRunAt}
            <div class="bg-muted/50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 class="w-4 h-4 text-green-500" />
                <span>Last check: {formatLastRun($snapshot.context.lastRunAt)} • Queue: {$snapshot.context.queueData.length} items</span>
            </div>
        {/if}

        <!-- Printer Status Card -->
        <Card.Root class="border-l-4 {isReady ? 'border-l-green-500' : 'border-l-amber-500'}">
            <Card.Header class="pb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <Card.Title class="text-xl flex items-center gap-2">
                            <PrinterCheck class="w-5 h-5" />
                            Print Module Status
                        </Card.Title>
                        <Card.Description>
                            Local client connection and printer readiness
                        </Card.Description>
                    </div>
                    <StatusBadge
                        status={isReady ? 'ready' : printerState?.initialized ? 'warning' : 'error'}
                        text={isReady ? 'Ready' : printerState?.initialized ? 'Check Printer' : 'Not Connected'}
                    />
                </div>
            </Card.Header>

            <Card.Content>
                <div class="grid gap-6 md:grid-cols-3">
                    <!-- Client Info -->
                    <div class="space-y-3">
                        <h4 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Client</h4>
                        <dl class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Initialized</dt>
                                <dd class="font-medium">{printerState?.initialized ? 'Yes' : 'No'}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">OS</dt>
                                <dd class="font-medium">{printerState?.os ?? '—'}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Host</dt>
                                <dd class="font-medium truncate max-w-37.5">{printerState?.hostname ?? '—'}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Printer Selection -->
                    <div class="space-y-3">
                        <h4 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Printer</h4>
                        <Select
                            type="single"
                            value={selectedPrinter}
                            onValueChange={(v) => (selectedPrinter = v)}
                            disabled={!printerState?.printer_list.length}
                        >
                            <SelectTrigger class="w-full">
                                {selectedPrinter ?? 'Select printer...'}
                            </SelectTrigger>
                            <SelectContent>
                                {#each printerState?.printer_list ?? [] as p}
                                    <SelectItem value={p.name}>
                                        <div class="flex items-center justify-between w-full">
                                            <span>{p.name}</span>
                                            {#if p.default}
                                                <Badge variant="secondary" class="ml-2">Default</Badge>
                                            {/if}
                                        </div>
                                    </SelectItem>
                                {/each}
                            </SelectContent>
                        </Select>

                        {#if activePrinter}
                            <div class="flex items-center gap-2 text-sm">
                                <span class="text-muted-foreground">Status:</span>
                                <Badge variant={activePrinter.status === 'Ready' ? 'default' : 'secondary'}>
                                    {activePrinter.status}
                                </Badge>
                            </div>
                        {/if}
                    </div>

                    <!-- Controls -->
                    <div class="flex flex-col justify-center gap-3">
                        <Button
                            variant="outline"
                            onclick={initializePrinter}
                            class="w-full"
                            disabled={!mounted.current}
                        >
                            <RefreshCw class="w-4 h-4 mr-2 {mounted.current ? '' : 'animate-spin'}" />
                            Refresh Status
                        </Button>

                        {#if !isReady}
                            <p class="text-xs text-muted-foreground text-center">
                                Start the local print service and refresh to connect
                            </p>
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Workflow Control Card -->
        <Card.Root>
            <Card.Header>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Card.Title>Workflow Control</Card.Title>
                        <Card.Description>
                            Manage automated print cycles • XState: <code class="text-xs bg-muted px-1 rounded">{$snapshot.value}</code>
                        </Card.Description>
                    </div>

                    <div class="flex items-center gap-3">
                        <Button
                            variant={interval.isActive ? 'destructive' : 'default'}
                            onclick={toggleService}
                            disabled={!canStart && !interval.isActive}
                            class="min-w-30"
                        >
                            {#if interval.isActive}
                                <Square class="w-4 h-4 mr-2" />
                                Stop
                            {:else}
                                <Play class="w-4 h-4 mr-2" />
                                Start
                            {/if}
                        </Button>
                    </div>
                </div>
            </Card.Header>

            <Card.Content class="space-y-6">
                <!-- Interval Setting -->
                <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div class="flex-1 max-w-xs space-y-2">
                        <Label for="interval">Polling Interval (ms)</Label>
                        <Input
                            id="interval"
                            type="number"
                            bind:value={intervalMs}
                            min={MIN_INTERVAL}
                            step={1000}
                            disabled={interval.isActive}
                        />
                        <p class="text-sm text-muted-foreground">
                            Minimum {MIN_INTERVAL}ms recommended. Current: {interval.counter} cycles.
                        </p>
                    </div>

                    {#if interval.isActive}
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 class="w-4 h-4 animate-spin" />
                            <span>Running • Next check in {Math.max(intervalMs, MIN_INTERVAL) / 1000}s</span>
                        </div>
                    {/if}
                </div>

                <Separator />

                <!-- Visual Workflow -->
                <div class="relative overflow-x-auto pb-4">
                    <div
                        bind:this={containerRef}
                        class="relative mx-auto bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border shadow-inner"
                        style="width: 780px; height: 430px;"
                    >
                        <!-- Row labels -->
                        <div class="absolute left-2 top-12.5 text-[10px] text-muted-foreground font-mono">①</div>
                        <div class="absolute left-2 top-45   text-[10px] text-muted-foreground font-mono">②</div>
                        <div class="absolute left-2 top-77.5 text-[10px] text-muted-foreground font-mono">③</div>

                        <!-- Workflow Nodes -->
                        {#each WORKFLOW_NODES as node}
                            <WorkflowNode
                                {node}
                                status={getNodeStatus(node.id)}
                                setRef={(el) => setNodeRef(node.id, el)}
                            />
                        {/each}

                        <!-- Animated Beams -->
                        {#if containerRef}
                            <!-- ── Row 1 ──────────────────────────────────────────────────── -->
                            <!-- client → scheduler       fires: scheduling -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'scheduling'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['client']} toRef={nodeRefs['scheduler']} />
                            <!-- scheduler → fetching      fires: fetching -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'fetching'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['scheduler']} toRef={nodeRefs['fetching']} />
                            <!-- fetching → parsing        fires: parsing -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'parsing'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['fetching']} toRef={nodeRefs['parsing']} />
                            <!-- parsing → array_show      fires: array_show -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'array_show'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['parsing']} toRef={nodeRefs['array_show']} />

                            <!-- ── Row 1 → Row 2 bridge ──────────────────────────────────── -->
                            <!-- array_show ↙ datalist     fires: datalist  (long diagonal, curve up) -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'datalist'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['array_show']} toRef={nodeRefs['datalist']}
                                curvature={-120} />

                            <!-- ── Row 2 ──────────────────────────────────────────────────── -->
                            <!-- datalist → rendering      fires: rendering -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'rendering'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['datalist']} toRef={nodeRefs['rendering']} />
                            <!-- rendering → generating    fires: generating -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'generating'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['rendering']} toRef={nodeRefs['generating']} />
                            <!-- generating → printing     fires: printing -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'printing'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['generating']} toRef={nodeRefs['printing']} />
                            <!-- printing → print_ok       fires: print_ok -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'print_ok'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['printing']} toRef={nodeRefs['print_ok']} />

                            <!-- ── Row 2 → Row 3 bridge ──────────────────────────────────── -->
                            <!-- print_ok ↙ uploading      fires: uploading  (diagonal, curve down) -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'uploading'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['print_ok']} toRef={nodeRefs['uploading']}
                                curvature={120} />

                            <!-- ── Row 3 ──────────────────────────────────────────────────── -->
                            <!-- uploading → upload_ok     fires: upload_ok -->
                            <AnimatedBeam duration={DURATION_ANIMATION}
                                trigger={$snapshot.value === 'upload_ok'}
                                containerRef={containerRef}
                                fromRef={nodeRefs['uploading']} toRef={nodeRefs['upload_ok']} />
                        {/if}

                        <!-- Phase Indicator -->
                        <div class="absolute top-3 right-3">
                            <Badge variant="outline" class="text-xs font-mono">
                                {$snapshot.value}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Documentation -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Documentation</Card.Title>
                <Card.Description>
                    XState-powered workflow reference
                </Card.Description>
            </Card.Header>
            <Card.Content class="space-y-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                        <tr class="border-b">
                            <th class="text-left py-2 font-semibold">Phase</th>
                            <th class="text-left py-2 font-semibold">Description</th>
                            <th class="text-left py-2 font-semibold w-32">Trigger</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y">
                        {#each workflowStages as stage}
                            <tr class="hover:bg-muted/50">
                                <td class="py-3 font-medium">{stage.phase}</td>
                                <td class="py-3 text-muted-foreground">{stage.desc}</td>
                                <td class="py-3"><code class="text-xs bg-muted px-1 py-0.5 rounded">{stage.trigger}</code></td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>

                <Separator />

                <div class="space-y-3">
                    <h3 class="font-semibold flex items-center gap-2">
                        <AlertCircle class="w-4 h-4" />
                        Troubleshooting
                    </h3>
                    <div class="grid gap-3 md:grid-cols-2">
                        {#each troubleshooting as item}
                            <div class="bg-muted/50 p-3 rounded-lg text-sm">
                                <p class="font-medium mb-1">{item.problem}</p>
                                <p class="text-muted-foreground">{item.solution}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Label Render -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Label Preview</Card.Title>
                <Card.Description>
                    Rendered labels ready for print
                    {#if $snapshot.context.queueData.length}
                        <Badge variant="secondary" class="ml-2">{$snapshot.context.queueData.length} items</Badge>
                    {/if}
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div bind:this={labelContainerRef} class="min-h-50 border rounded-lg p-4 bg-muted/30">
                    {#if $snapshot.context.renderedData.length}
                        <AutoRender data={$snapshot.context.renderedData} />
                    {:else}
                        <div class="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <PrinterCheck class="w-8 h-8 mb-2 opacity-50" />
                            <p>No labels to render</p>
                            <p class="text-sm">Start the service to fetch and render labels</p>
                        </div>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</Navbar>
