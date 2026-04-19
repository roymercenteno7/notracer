<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { QrCode, Download, Trash2, Plus, Loader2, Copy, Check } from 'lucide-svelte';
    import QRCodeLib from 'qrcode';
    import { onMount } from 'svelte';

    const t = (path: string) => i18n.t(path);

    let { data } = $props();
    let qrCodes = $derived(data.qrCodes || []);
    let user = $derived(data.user);
    let totalGenerated = $derived(data.totalGenerated || 0);

    let url = $state('');
    let name = $state('');
    let loading = $state(false);
    let error = $state('');
    let generatedQr = $state('');
    let copied = $state(false);

    async function generateQR() {
        if (!url) {
            error = 'URL is required';
            return;
        }

        loading = true;
        error = '';

        try {
            const canvas = document.createElement('canvas');
            await QRCodeLib.toCanvas(canvas, url, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#00FF41',
                    light: '#050505'
                },
                errorCorrectionLevel: 'H'
            });
            generatedQr = canvas.toDataURL('image/png');
            
            await fetch('/api/qr/count', { method: 'POST' });
        } catch (e) {
            console.error(e);
            error = 'Failed to generate QR code';
        } finally {
            loading = false;
        }
    }

    async function saveQR() {
        loading = true;
        
        const formData = new FormData();
        formData.append('url', generatedQr);
        formData.append('name', name || 'Unnamed QR');

        try {
            const res = await fetch('?/create', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            
            if (result.type === 'success') {
                window.location.reload();
            }
        } catch (e) {
            error = 'Failed to save QR code';
        } finally {
            loading = false;
        }
    }

    async function deleteQR(id: string) {
        const formData = new FormData();
        formData.append('id', id);

        await fetch('?/delete', {
            method: 'POST',
            body: formData
        });

        window.location.reload();
    }

    function downloadQR() {
        if (!generatedQr) return;
        const link = document.createElement('a');
        link.href = generatedQr;
        link.download = `qr-${name || 'code'}.png`;
        link.click();
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(url);
        copied = true;
        setTimeout(() => copied = false, 2000);
    }

    async function renderSavedQR(url: string, index: number) {
        const canvas = document.createElement('canvas');
        try {
            await QRCodeLib.toCanvas(canvas, url, {
                width: 128,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            const container = document.getElementById(`qr-canvas-${index}`);
            if (container) {
                container.innerHTML = '';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                container.appendChild(canvas);
            }
        } catch (e) {
            console.error(e);
        }
    }

    onMount(async () => {
        for (let i = 0; i < qrCodes.length; i++) {
            await renderSavedQR(qrCodes[i].url, i);
        }
    });
</script>

<svelte:head>
    <title>QR Code Generator | NoTracer - Anonymous, No Tracking</title>
    <meta name="description" content="Generate privacy-first QR codes. No registration, no tracking, no metadata. Create anonymous QR codes locally in your browser." />
    <meta property="og:title" content="QR Code Generator | NoTracer" />
    <meta property="og:description" content="Generate anonymous QR codes without tracking. Zero logs, no metadata." />
    <meta property="og:image" content="https://notracer.com/og-image.png" />
    <meta name="twitter:title" content="QR Code Generator | NoTracer" />
    <meta name="twitter:description" content="Generate anonymous QR codes without tracking." />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://notracer.com/qr" />
</svelte:head>

<div class="absolute top-4 right-4 border border-neon text-neon font-mono text-xs px-3 py-1 bg-black/80 backdrop-blur-sm z-50 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
    [ BETA ]
</div>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-8">
    <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-16 h-16 border border-neon/50 rounded-lg bg-neon/5">
            <QrCode class="text-neon" size={32} />
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-neon tracking-tight">
            QR_CODE
        </h1>
        <p class="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            {t('qr.subtitle')}
        </p>
        <p class="text-neon text-xs font-mono tracking-widest mt-2">
            [{totalGenerated.toLocaleString()} QR CODES GENERATED]
        </p>
    </div>

    <!-- Generator Form -->
    <div class="border border-gray-800 bg-[#050505] rounded-lg p-6">
        <div class="flex flex-col gap-4">
            <div>
                <label class="text-xs text-gray-500 uppercase tracking-widest mb-2 block">{t('qr.url_label')}</label>
                <div class="flex gap-2">
                    <input
                        type="url"
                        bind:value={url}
                        placeholder="https://example.com"
                        class="flex-1 bg-black border border-gray-800 px-4 py-3 text-gray-300 focus:border-neon focus:outline-none font-mono"
                    />
                    <button
                        onclick={copyToClipboard}
                        class="border border-gray-800 px-4 hover:text-neon transition-colors"
                        title="Copy URL"
                    >
                        {#if copied}
                            <Check size={20} />
                        {:else}
                            <Copy size={20} />
                        {/if}
                    </button>
                </div>
            </div>

            {#if data.user}
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest mb-2 block">{t('qr.name_label')}</label>
                    <input
                        type="text"
                        bind:value={name}
                        placeholder={t('qr.name_placeholder')}
                        class="w-full bg-black border border-gray-800 px-4 py-3 text-gray-300 focus:border-neon focus:outline-none font-mono"
                    />
                </div>
            {/if}

            <button
                onclick={generateQR}
                disabled={loading || !url}
                class="flex items-center justify-center gap-2 px-8 py-3 bg-neon text-black font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {#if loading}
                    <Loader2 class="animate-spin" size={20} />
                {:else}
                    <QrCode size={20} />
                {/if}
                {t('qr.generate')}
            </button>

            {#if error}
                <p class="text-red-500 text-sm">{error}</p>
            {/if}
        </div>
    </div>

    <!-- Generated QR -->
    {#if generatedQr}
        <div class="border border-neon/30 bg-[#050505] rounded-lg p-8">
            <div class="flex flex-col items-center gap-6">
                <div class="border-4 border-neon/20 p-4">
                    <img src={generatedQr} alt="QR Code" class="w-64 h-64" />
                </div>

                <div class="flex gap-4">
                    <button
                        onclick={downloadQR}
                        class="flex items-center gap-2 px-6 py-3 bg-neon text-black font-bold hover:bg-white transition-colors"
                    >
                        <Download size={20} />
                        {t('qr.download')}
                    </button>

                    {#if data.user}
                        <button
                            onclick={saveQR}
                            class="flex items-center gap-2 px-6 py-3 border border-neon/50 text-neon hover:bg-neon hover:text-black transition-colors"
                        >
                            <Plus size={20} />
                            {t('qr.save')}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <!-- Saved QRs (only for logged in users) -->
    {#if qrCodes.length > 0}
        <div class="border border-gray-800 bg-[#050505] rounded-lg p-6">
            <h2 class="text-neon text-sm uppercase tracking-widest mb-6">{t('qr.saved')}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each qrCodes as qr, i}
                    <div class="border border-gray-800 rounded-lg p-4 flex items-center gap-4">
                        <canvas id="qr-canvas-{i}" class="w-16 h-16"></canvas>
                        <div class="flex-1 min-w-0">
                            <p class="text-gray-300 font-medium truncate">{qr.name}</p>
                            <p class="text-gray-600 text-xs truncate">{qr.url}</p>
                        </div>
                        <button
                            onclick={() => deleteQR(qr.id)}
                            class="text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>