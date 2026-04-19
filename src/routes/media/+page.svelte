<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { Upload, Download, Image, CheckCircle, AlertCircle, Loader2, X, Files } from 'lucide-svelte';

    const t = (path: string) => i18n.t(path);

    let dragOver = $state(false);
    let loading = $state(false);
    let error = $state('');
    let result = $state<{
        isBatch: boolean;
        results: Array<{
            original: { size: number; width: number; height: number; type: string; name: string };
            converted: { size: number; dataUrl: string };
            savings: number;
        }>;
    } | null>(null);
    let fileInput: HTMLInputElement | undefined = $state();
    let previewUrls = $state<string[]>([]);

    function formatBytes(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragOver = false;
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) processFiles(files);
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (files && files.length > 0) processFiles(files);
    }

    async function processFiles(files: FileList) {
        error = '';
        result = null;
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        previewUrls = [];

        const validFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 10 * 1024 * 1024) {
                validFiles.push(file);
                previewUrls.push(URL.createObjectURL(file));
            }
        }

        if (validFiles.length === 0) {
            error = t('media.error_type');
            return;
        }

        loading = true;

        const formData = new FormData();
        validFiles.forEach(file => formData.append('images', file));

        try {
            const res = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.error || t('media.error_process');
                return;
            }

            result = data;
        } catch (err) {
            error = t('media.error_process');
        } finally {
            loading = false;
        }
    }

    function downloadImage(dataUrl: string, name: string) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = name.replace(/\.(jpg|png)$/i, '.webp');
        link.click();
    }

    function downloadAll() {
        if (!result) return;
        result.results.forEach((r, i) => {
            const originalName = r.original.name || `image_${i}`;
            downloadImage(r.converted.dataUrl, originalName);
        });
    }

    function reset() {
        result = null;
        error = '';
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        previewUrls = [];
        if (fileInput) fileInput.value = '';
    }
</script>

<svelte:head>
    <title>Media Shifter | NoTracer - Convert to WebP</title>
    <meta name="description" content="Convert images to WebP format. Remove EXIF metadata, GPS coordinates, and device information. Privacy-first image optimization." />
    <meta property="og:title" content="Media Shifter | NoTracer" />
    <meta property="og:description" content="Convert images to WebP. Remove all EXIF metadata." />
    <meta property="og:image" content="https://notracer.com/og-image.png" />
    <meta name="twitter:title" content="Media Shifter | NoTracer" />
    <meta name="twitter:description" content="Convert images to WebP. Remove EXIF metadata." />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://notracer.com/media" />
</svelte:head>

<div class="absolute top-4 right-4 border border-neon text-neon font-mono text-xs px-3 py-1 bg-black/80 backdrop-blur-sm z-50 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
    [ {t('nav.status')} ]
</div>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-8">
    
    <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-16 h-16 border border-neon/50 rounded-lg bg-neon/5">
            <Image class="text-neon" size={32} />
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-neon tracking-tight">
            MEDIA_SHIFTER
        </h1>
        <p class="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            {t('media.subtitle')}
        </p>
    </div>

    {#if !result && !loading}
        <div
            role="button"
            tabindex="0"
            ondragover={(e) => { e.preventDefault(); dragOver = true; }}
            ondragleave={() => dragOver = false}
            ondrop={handleDrop}
            onclick={() => fileInput?.click()}
            onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
            class="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 {dragOver ? 'border-neon bg-neon/10' : 'border-gray-800 hover:border-gray-700'}"
        >
            <input
                bind:this={fileInput}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onchange={handleFileSelect}
                class="hidden"
            />
            
            <div class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center {dragOver ? 'border-neon bg-neon/10' : ''}">
                    <Upload class="text-gray-500 {dragOver ? 'text-neon' : ''}" size={24} />
                </div>
                
                <div class="space-y-2">
                    <p class="text-gray-300 font-medium">
                        {t('media.drop_title')}
                    </p>
                    <p class="text-gray-600 text-sm">
                        {t('media.drop_subtitle')}
                    </p>
                </div>

                <div class="flex items-center gap-2 text-[10px] text-gray-700 tracking-widest uppercase">
                    <span>JPG</span>
                    <span class="text-gray-800">|</span>
                    <span>PNG</span>
                    <span class="text-gray-800">|</span>
                    <span class="text-neon">→ WEBP</span>
                </div>
            </div>
        </div>
    {/if}

    {#if loading}
        <div class="border border-gray-800 bg-[#050505] rounded-lg p-12 text-center">
            <div class="flex flex-col items-center gap-4">
                <Loader2 class="text-neon animate-spin" size={48} />
                <p class="text-gray-500 font-mono text-sm uppercase tracking-widest">
                    {t('media.processing')}
                </p>
            </div>
        </div>
    {/if}

    {#if error}
        <div class="border border-red-900/50 bg-red-950/20 rounded-lg p-6">
            <div class="flex items-start gap-4">
                <AlertCircle class="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div class="flex-1">
                    <p class="text-red-400 font-mono text-sm">{error}</p>
                    <button onclick={reset} class="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        {t('media.try_again')}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    {#if result}
        <div class="space-y-6">
            {#if result.isBatch}
                <div class="border border-neon/30 rounded-lg p-4 bg-neon/5">
                    <div class="flex items-center gap-2 text-neon">
                        <Files size={20} />
                        <span class="font-medium">{result.results.length} imágenes procesadas</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each result.results as item, i}
                        <div class="border border-gray-800 rounded-lg overflow-hidden bg-[#050505]">
                            <div class="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                                <span class="text-xs text-gray-500 truncate max-w-[150px]">{item.original.name}</span>
                                <span class="text-xs text-neon font-mono">-{item.savings}%</span>
                            </div>
                            <div class="aspect-square flex items-center justify-center bg-gray-900/50 p-2">
                                <img src={item.converted.dataUrl} alt="Converted" class="max-w-full max-h-full object-contain rounded" />
                            </div>
                            <div class="px-3 py-2 border-t border-gray-800 flex items-center justify-between">
                                <span class="text-xs text-gray-600 font-mono">
                                    {formatBytes(item.original.size)} → {formatBytes(item.converted.size)}
                                </span>
                                <button
                                    onclick={() => downloadImage(item.converted.dataUrl, item.original.name)}
                                    class="p-1 hover:text-neon transition-colors"
                                >
                                    <Download size={14} />
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <CheckCircle class="text-neon" size={20} />
                            <div>
                                <p class="text-gray-300 text-sm font-medium">{t('media.success_title')}</p>
                                <p class="text-gray-500 text-xs">
                                    Total: {formatBytes(result.results.reduce((a, r) => a + r.original.size, 0))} → {formatBytes(result.results.reduce((a, r) => a + r.converted.size, 0))}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                onclick={reset}
                                class="px-4 py-2 text-xs text-gray-400 hover:text-gray-200 border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                {t('media.new_file')}
                            </button>
                            <button
                                onclick={downloadAll}
                                class="flex items-center gap-2 px-6 py-2 bg-neon text-black font-bold text-sm hover:bg-white transition-colors"
                            >
                                <Download size={16} />
                                Descargar todo
                            </button>
                        </div>
                    </div>
                </div>
            {:else}
                {@const r = result.results[0]}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="border border-gray-800 rounded-lg overflow-hidden bg-[#050505]">
                        <div class="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                            <span class="text-xs text-gray-500 uppercase tracking-widest">{t('media.original')}</span>
                            <span class="text-xs text-gray-600 font-mono">
                                {r.original.width}×{r.original.height} • {formatBytes(r.original.size)}
                            </span>
                        </div>
                        <div class="aspect-video flex items-center justify-center bg-gray-900/50 p-4">
                            <img src={previewUrls[0]} alt="Original" class="max-w-full max-h-full object-contain rounded" />
                        </div>
                    </div>

                    <div class="border border-neon/30 rounded-lg overflow-hidden bg-[#050505] relative">
                        <div class="absolute top-2 right-2 bg-neon text-black text-[10px] font-bold px-2 py-1 rounded tracking-widest">
                            -{r.savings}%
                        </div>
                        <div class="px-4 py-2 border-b border-neon/30 flex items-center justify-between">
                            <span class="text-xs text-neon uppercase tracking-widest">{t('media.converted')}</span>
                            <span class="text-xs text-gray-600 font-mono">
                                WEBP • {formatBytes(r.converted.size)}
                            </span>
                        </div>
                        <div class="aspect-video flex items-center justify-center bg-gray-900/50 p-4">
                            <img src={r.converted.dataUrl} alt="Converted" class="max-w-full max-h-full object-contain rounded" />
                        </div>
                    </div>
                </div>

                <div class="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <CheckCircle class="text-neon" size={20} />
                            <div>
                                <p class="text-gray-300 text-sm font-medium">{t('media.success_title')}</p>
                                <p class="text-gray-500 text-xs">
                                    {t('media.saved')} {formatBytes(r.original.size - r.converted.size)} ({r.savings}%)
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                onclick={reset}
                                class="px-4 py-2 text-xs text-gray-400 hover:text-gray-200 border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                {t('media.new_file')}
                            </button>
                            <button
                                onclick={() => downloadImage(r.converted.dataUrl, r.original.name)}
                                class="flex items-center gap-2 px-6 py-2 bg-neon text-black font-bold text-sm hover:bg-white transition-colors"
                            >
                                <Download size={16} />
                                {t('media.download')}
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <div class="border border-gray-900 rounded-lg p-6 bg-[#080808]/50">
        <h3 class="text-neon text-xs uppercase tracking-widest mb-4">{t('media.features_title')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">{t('media.feature_1_title')}</p>
                <p class="text-gray-600">{t('media.feature_1_desc')}</p>
            </div>
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">{t('media.feature_2_title')}</p>
                <p class="text-gray-600">{t('media.feature_2_desc')}</p>
            </div>
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">{t('media.feature_3_title')}</p>
                <p class="text-gray-600">{t('media.feature_3_desc')}</p>
            </div>
        </div>
    </div>
</div>
