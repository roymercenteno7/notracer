<script lang="ts">
    import { Gauge, Download, Upload, Timer, ArrowRight, Loader2, CheckCircle, AlertCircle, Wifi } from 'lucide-svelte';
    import { i18n } from '$lib/i18n';

    const t = (path: string) => i18n.t(path);

    let status = $state<'idle' | 'testing' | 'complete'>('idle');
    let phase = $state<'download' | 'upload'>('download');
    let downloadSpeed = $state(0);
    let uploadSpeed = $state(0);
    let latency = $state(0);
    let progress = $state(0);
    let error = $state('');

    const TEST_DURATION = 5000;
    const CHUNK_SIZE = 1024 * 1024;

    async function runSpeedTest() {
        status = 'testing';
        phase = 'download';
        error = '';
        progress = 0;

        try {
            const latencyStart = performance.now();
            await fetch('/api/speedtest/ping', { cache: 'no-store' });
            latency = Math.round(performance.now() - latencyStart);

            phase = 'download';
            const downloadTest = await runDownloadTest();
            downloadSpeed = downloadTest.speed;
            progress = 50;

            phase = 'upload';
            const uploadTest = await runUploadTest();
            uploadSpeed = uploadTest.speed;
            progress = 100;

            status = 'complete';
        } catch (err) {
            error = 'Error al realizar la prueba. Intenta de nuevo.';
            status = 'idle';
        }
    }

    async function runDownloadTest() {
        const startTime = performance.now();
        let bytesTransferred = 0;
        
        const testUrl = '/api/speedtest/download';

        while (performance.now() - startTime < TEST_DURATION) {
            try {
                const res = await fetch(testUrl + '?t=' + Date.now(), { cache: 'no-store' });
                const blob = await res.blob();
                bytesTransferred += blob.size;
            } catch {
                break;
            }
        }

        const duration = (performance.now() - startTime) / 1000;
        const speedMbps = (bytesTransferred * 8) / (duration * 1000000);
        
        return { speed: Math.round(speedMbps * 100) / 100 };
    }

    async function runUploadTest() {
        const startTime = performance.now();
        let bytesTransferred = 0;
        
        const chunk = new Uint8Array(CHUNK_SIZE);
        
        while (performance.now() - startTime < TEST_DURATION) {
            try {
                await fetch('/api/speedtest/upload', {
                    method: 'POST',
                    body: chunk,
                    cache: 'no-store'
                });
                bytesTransferred += CHUNK_SIZE;
            } catch {
                break;
            }
        }

        const duration = (performance.now() - startTime) / 1000;
        const speedMbps = (bytesTransferred * 8) / (duration * 1000000);
        
        return { speed: Math.round(speedMbps * 100) / 100 };
    }

    function formatSpeed(speed: number): string {
        if (speed < 1) return (speed * 1000).toFixed(0) + ' Kbps';
        return speed.toFixed(1) + ' Mbps';
    }
</script>

<svelte:head>
    <title>Speed Test | NoTracer</title>
    <meta name="description" content={t('speedtest.description')} />
</svelte:head>

<div class="absolute top-4 right-4 border border-neon text-neon font-mono text-xs px-3 py-1 bg-black/80 backdrop-blur-sm z-50 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
    [ BETA ]
</div>

<div class="w-full max-w-4xl mx-auto flex flex-col gap-8">
    <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-16 h-16 border border-neon/50 rounded-lg bg-neon/5">
            <Gauge class="text-neon" size={32} />
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-neon tracking-tight">
            SPEED_TEST
        </h1>
        <p class="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            {t('speedtest.subtitle')}
        </p>
    </div>

    {#if status === 'idle'}
        <div class="border border-gray-800 bg-[#050505] rounded-lg p-12 text-center">
            <div class="flex flex-col items-center gap-6">
                <div class="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <Wifi class="text-gray-600" size={40} />
                </div>
                <div class="space-y-2">
                    <p class="text-gray-300 font-medium">{t('speedtest.ready')}</p>
                    <p class="text-gray-600 text-sm">{t('speedtest.duration')}</p>
                </div>
                <button
                    onclick={runSpeedTest}
                    class="flex items-center gap-2 px-8 py-3 bg-neon text-black font-bold text-lg hover:bg-white transition-colors"
                >
                    <ArrowRight size={20} />
                    {t('speedtest.start')}
                </button>
            </div>
        </div>
    {/if}

    {#if status === 'testing'}
        <div class="border border-neon/30 bg-[#050505] rounded-lg p-8">
            <div class="flex flex-col items-center gap-8">
                <div class="relative w-32 h-32">
                    <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#1a1a1a"
                            stroke-width="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#00ff41"
                            stroke-width="8"
                            stroke-dasharray={283}
                            stroke-dashoffset={283 - (283 * progress) / 100}
                            stroke-linecap="round"
                            class="transition-all duration-300"
                        />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <Loader2 class="text-neon animate-spin" size={32} />
                    </div>
                </div>
                
                <div class="text-center space-y-2">
                    <p class="text-neon font-mono text-sm uppercase tracking-widest">
                        {phase === 'download' ? t('speedtest.download') : t('speedtest.upload')} {t('speedtest.testing')}
                    </p>
                    <p class="text-gray-500 text-xs">...</p>
                </div>

                <div class="grid grid-cols-3 gap-6 w-full max-w-md">
                    <div class="text-center p-4 border border-gray-800 rounded-lg">
                        <Timer class="text-gray-500 mx-auto mb-2" size={20} />
                        <p class="text-xs text-gray-500 uppercase">{t('speedtest.latency')}</p>
                        <p class="text-xl font-bold text-gray-300">{latency} ms</p>
                    </div>
                    <div class="text-center p-4 border border-gray-800 rounded-lg">
                        <Download class="text-neon mx-auto mb-2" size={20} />
                        <p class="text-xs text-gray-500 uppercase">{t('speedtest.download')}</p>
                        <p class="text-xl font-bold text-neon">{downloadSpeed ? formatSpeed(downloadSpeed) : '--'}</p>
                    </div>
                    <div class="text-center p-4 border border-gray-800 rounded-lg">
                        <Upload class="text-neon mx-auto mb-2" size={20} />
                        <p class="text-xs text-gray-500 uppercase">{t('speedtest.upload')}</p>
                        <p class="text-xl font-bold text-neon">{uploadSpeed ? formatSpeed(uploadSpeed) : '--'}</p>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if status === 'complete'}
        <div class="border border-neon/30 bg-[#050505] rounded-lg p-8">
            <div class="flex flex-col items-center gap-8">
                <div class="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center">
                    <CheckCircle class="text-neon" size={32} />
                </div>

                <div class="grid grid-cols-3 gap-6 w-full max-w-md">
                    <div class="text-center p-4 border border-gray-800 rounded-lg">
                        <Timer class="text-gray-500 mx-auto mb-2" size={20} />
                        <p class="text-xs text-gray-500 uppercase">{t('speedtest.latency')}</p>
                        <p class="text-xl font-bold text-gray-300">{latency} ms</p>
                    </div>
                    <div class="text-center p-4 border border-neon/30 rounded-lg bg-neon/5">
                        <Download class="text-neon mx-auto mb-2" size={20} />
                        <p class="text-xs text-neon uppercase">{t('speedtest.download')}</p>
                        <p class="text-2xl font-bold text-neon">{formatSpeed(downloadSpeed)}</p>
                    </div>
                    <div class="text-center p-4 border border-neon/30 rounded-lg bg-neon/5">
                        <Upload class="text-neon mx-auto mb-2" size={20} />
                        <p class="text-xs text-neon uppercase">{t('speedtest.upload')}</p>
                        <p class="text-2xl font-bold text-neon">{formatSpeed(uploadSpeed)}</p>
                    </div>
                </div>

                <button
                    onclick={() => status = 'idle'}
                    class="flex items-center gap-2 px-6 py-2 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-colors"
                >
                    <ArrowRight size={16} class="rotate-180" />
                    {t('speedtest.new_test')}
                </button>
            </div>
        </div>
    {/if}

    {#if error}
        <div class="border border-red-900/50 bg-red-950/20 rounded-lg p-6">
            <div class="flex items-start gap-4">
                <AlertCircle class="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div class="flex-1">
                    <p class="text-red-400 font-mono text-sm">{error}</p>
                    <button onclick={() => status = 'idle'} class="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="border border-gray-900 rounded-lg p-6 bg-[#080808]/50">
        <h3 class="text-neon text-xs uppercase tracking-widest mb-4">Información</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">Descarga</p>
                <p class="text-gray-600">Velocidad para recibir datos desde internet</p>
            </div>
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">Subida</p>
                <p class="text-gray-600">Velocidad para enviar datos a internet</p>
            </div>
            <div class="space-y-1">
                <p class="text-gray-400 font-medium">Latencia</p>
                <p class="text-gray-600">Tiempo de respuesta del servidor</p>
            </div>
        </div>
    </div>
</div>
