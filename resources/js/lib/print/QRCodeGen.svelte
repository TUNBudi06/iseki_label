<script lang="ts">
    import QRCode from 'qrcode';
    import { cn } from '$shadcn/utils.ts';

    let {
        data = '',
        size = 128,
        class: className = '',
        ref = $bindable(),
    } = $props();
    let qrCodeDataUrl = $state<string>('');

    let classValue = $derived(cn('mx-auto w-[17mm] h-[17mm]', className));

    async function generateQRCode(data: string = '') {
        try {
            qrCodeDataUrl = await QRCode.toDataURL(data, {
                width: size,
                margin: 1,
            });
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    }

    $effect(() => {
        generateQRCode(data);
    });
</script>

<img src={qrCodeDataUrl} alt="QR Code" class={classValue} />
