<script>
    import * as Dialog from '$shadcn/components/ui/dialog';
    import { Button } from '$shadcn/components/ui/button';
    import { Input } from '$shadcn/components/ui/input';
    import { Label } from '$shadcn/components/ui/label';
    import { Checkbox } from '$shadcn/components/ui/checkbox';
    import * as Select from '$shadcn/components/ui/select';
    import { useForm } from '@inertiajs/svelte';
    import { toast } from 'svelte-sonner';
    import {untrack} from "svelte";
    import {rackStore, rackUpdate} from "$routes/rack/index.ts";
    import {routeUrl} from "@tunbudi06/inertia-route-helper";

    // Props using Svelte 5 runes
    let {
        open = $bindable(false),
        rackPart = null,
        onSuccess = () => {}
    } = $props();

    // Initialize form with existing data or defaults
    let form = useForm({
        rack_no: '',
        item_code: '',
        part_name: '',
        cek: 'BENAR',
        supplier: '',
        part_hydrolis: false,
        type_tractor: '',
        satuan: '',
        sample: '',
    });

    // Reset form when rackPart changes
    $effect(() => {
        if (rackPart) {
            $form.rack_no = rackPart.rack_no ?? '';
            $form.item_code = rackPart.item_code ?? '';
            $form.part_name = rackPart.part_name ?? '';
            $form.cek = rackPart.cek ?? 'BENAR';
            $form.supplier = rackPart.supplier ?? '';
            $form.part_hydrolis = Boolean(rackPart.part_hydrolis);
            $form.type_tractor = rackPart.type_tractor ?? '';
            $form.satuan = rackPart.satuan ?? '';
            $form.sample = rackPart.sample ?? '';
        } else {
            untrack(()=>{
                $form.reset();
            })
        }
    });

    let isEdit = $derived(!!rackPart?.id);
    let title = $derived(isEdit ? 'Edit Rack Part' : 'Create Rack Part');

    // Selected value for Select component
    let selectedCek = $derived(
        $form.cek
            ? { value: $form.cek, label: $form.cek }
            : { value: 'BENAR', label: 'BENAR' }
    );

    function handleSubmit(e) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(isEdit ? 'Rack part updated successfully' : 'Rack part created successfully');
                open = false;
                $form.reset();
                onSuccess();
            },
            onError: (errors) => {
                toast.error('Failed to save rack part');
                console.error(errors);
            },
            preserveScroll: true,
        };

        if (isEdit) {
            $form.post(routeUrl(rackUpdate({id:rackPart.id})), options);
        } else {
            $form.post(routeUrl(rackStore()), options);
        }
    }

    function handleClose() {
        $form.reset();
        $form.clearErrors();
        open = false;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Content class="sm:max-w-[600px] bg-pink-300/80">
        <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>
                {isEdit ? `Update details for ${rackPart?.rack_no}` : 'Add a new rack part to the system'}
            </Dialog.Description>
        </Dialog.Header>

        <form onsubmit={handleSubmit} class="space-y-4 py-4">
            <!-- Rack No -->
            <div class="grid gap-2">
                <Label for="rack_no" class={$form.errors.rack_no ? 'text-destructive' : ''}>
                    Rack No <span class="text-destructive">*</span>
                </Label>
                <Input
                    id="rack_no"
                    bind:value={$form.rack_no}
                    placeholder="e.g., SX-A264"
                    class={$form.errors.rack_no ? 'border-destructive' : ''}
                />
                {#if $form.errors.rack_no}
                    <p class="text-sm text-destructive">{$form.errors.rack_no}</p>
                {/if}
            </div>

            <!-- Item Code -->
            <div class="grid gap-2">
                <Label for="item_code" class={$form.errors.item_code ? 'text-destructive' : ''}>
                    Item Code <span class="text-destructive">*</span>
                </Label>
                <Input
                    id="item_code"
                    bind:value={$form.item_code}
                    placeholder="e.g., 62819990211A"
                    class={$form.errors.item_code ? 'border-destructive' : ''}
                />
                {#if $form.errors.item_code}
                    <p class="text-sm text-destructive">{$form.errors.item_code}</p>
                {/if}
            </div>

            <!-- Part Name -->
            <div class="grid gap-2">
                <Label for="part_name">Part Name</Label>
                <Input
                    id="part_name"
                    bind:value={$form.part_name}
                    placeholder="e.g., BRACKET/CONNECTOR COMP"
                />
            </div>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-2 gap-4">
                <!-- Cek (Status) -->
                <div class="grid gap-2">
                    <Label for="cek">Status (Cek)</Label>
                    <Select.Root type="single" id="cek"
                                 selected={selectedCek}
                                 bind:value={$form.cek}>
                        <Select.Trigger id="cek">
                            {selectedCek ? selectedCek.value : 'Select status'}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="BENAR">BENAR</Select.Item>
                            <Select.Item value="SALAH">SALAH</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    <Select.Root
                        selected={selectedCek}
                        onSelectedChange={(v) => {
              if (v) $form.cek = v.value;
            }}
                    >
                        <Select.Content>
                            <Select.Item value="BENAR">BENAR</Select.Item>
                            <Select.Item value="SALAH">SALAH</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>

                <!-- Part Hydrolis -->
                <div class="flex items-center gap-2 pt-6">
                    <Checkbox
                        id="part_hydrolis"
                        checked={$form.part_hydrolis}
                        onCheckedChange={(v) => $form.part_hydrolis = v}
                    />
                    <Label for="part_hydrolis" class="cursor-pointer">
                        Part Hydrolis
                    </Label>
                </div>
            </div>

            <!-- Supplier -->
            <div class="grid gap-2">
                <Label for="supplier">Supplier</Label>
                <Input
                    id="supplier"
                    bind:value={$form.supplier}
                    placeholder="e.g., ISEKI CO. LTD"
                />
            </div>

            <!-- Type Tractor -->
            <div class="grid gap-2">
                <Label for="type_tractor">Type Tractor</Label>
                <Input
                    id="type_tractor"
                    bind:value={$form.type_tractor}
                    placeholder="e.g., SF237 ALL"
                />
            </div>

            <!-- Satuan & Sample -->
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="satuan">Satuan (Unit)</Label>
                    <Input
                        id="satuan"
                        bind:value={$form.satuan}
                        placeholder="e.g., PCS"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="sample">Sample</Label>
                    <Input
                        id="sample"
                        bind:value={$form.sample}
                        placeholder="e.g., S = 10"
                    />
                </div>
            </div>

            <Dialog.Footer class="gap-2 pt-4">
                <Button type="button" variant="outline" onclick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={$form.processing}>
                    {#if $form.processing}
                        <span class="mr-2">⏳</span>
                        Saving...
                    {:else}
                        {isEdit ? 'Update' : 'Create'}
                    {/if}
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
