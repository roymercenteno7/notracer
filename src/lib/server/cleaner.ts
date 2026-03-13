type SiteConfig = {
    [domainKey: string]: {
        params: string[];
        regex?: RegExp[];
    }
};

// 1. Lista Negra Global de UTMs y rastreadores comunes (Siempre se eliminan)
const GLOBAL_TRACKERS = new Set([
    // Publicidad y Marketing
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
    // Analíticas
    '_ga', '_gl',
    // Click IDs Globales
    'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'wbraid', 'gbraid',
    // Embudos/Campañas externas
    'mc_eid', 'rb_clickid'
]);

// 2. Lista Negra por Dominio (Específica)
const DOMAIN_BLACKLIST: SiteConfig = {
    'amazon': {
        // Mantenemos tag y ascsubtag excluyéndolos de esta lista
        params: ['ref', 'ref_', '_encoding', 'dib', 'dib_tag', 'qid', 'keywords', 'sr', 'content-id'],
        regex: [/^pd_rd_.*/i]
    },
    'facebook': {
        params: ['mibextid', 'igsh']
    },
    'instagram': {
        params: ['mibextid', 'igsh']
    },
    'youtube': {
        // Mantenemos v y t excluyéndolos
        params: ['si', 'pp', 'feature']
    },
    'tiktok': {
        params: ['_r', '_t', 'social_share_type', 'social_share_context', 'u_code', 'ttclid']
    },
    'twitter': {
        params: ['t', 's', 'ref_src', 'ref_url']
    },
    'x': {
        params: ['t', 's', 'ref_src', 'ref_url']
    },
    'pinterest': {
        params: ['epik', 'pp']
    },
    'mercadolibre': {
        params: ['tracking_id', 'component_id', 'page_id', 'order_backend', 'stayonweb']
    },
    'linkedin': {
        params: ['trackingid', 'activetab', 'lipi', 'destpagetype', 'li_fat_id']
    },
    'aliexpress': {
        params: ['_ppc', 'pvid', 'algo_pvid', 'algo_expid', 'btsid', 'ws_ab_test']
    },
    'google': {
        params: ['sourceid', 'oq', 'gs_lcp', 'ved', 'usg']
    },
    'spotify': {
        params: ['si', 'context']
    }
};

export function cleanUrl(urlString: string): { url: string; removed: string[] } {
    try {
        const rawUrl = urlString.trim().replace(/^https?:\/\//i, (match) => match.toLowerCase());
        const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
        const paramsToDelete: string[] = [];
        const removedTrackers: string[] = [];

        const hostname = url.hostname.toLowerCase();

        // 3. Extracción de ASIN y reconstrucción canónica de Amazon
        if (hostname.includes('amazon.')) {
            const asinMatch = url.pathname.match(/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
            if (asinMatch) {
                const asin = asinMatch[1];
                let localePrefix = '';
                const localeMatch = url.pathname.match(/^(\/-\/[^/]+\/)/i);
                if (localeMatch) {
                    localePrefix = localeMatch[1];
                }
                const newPath = `${localePrefix ? localePrefix : '/'}dp/${asin}`;
                if (url.pathname !== newPath) {
                    removedTrackers.push('amazon_seo_path_bloat');
                }
                url.pathname = newPath;
            }
        }

        // 4. Procesamiento de Parámetros de Consulta (Global + Dominio)
        url.searchParams.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            let isTracker = false;

            // A. Revisión Global
            if (GLOBAL_TRACKERS.has(lowerKey)) {
                isTracker = true;
            } else {
                // B. Revisión Específica por Hostname
                for (const [domain, config] of Object.entries(DOMAIN_BLACKLIST)) {
                    if (hostname.includes(domain)) {
                        if (config.params.includes(lowerKey)) {
                            isTracker = true;
                            break;
                        }
                        if (config.regex && config.regex.some(r => r.test(key))) {
                            isTracker = true;
                            break;
                        }
                    }
                }
            }

            if (isTracker) {
                paramsToDelete.push(key);
            }
        });

        // 5. Destrucción de parámetros identificados
        paramsToDelete.forEach((param) => url.searchParams.delete(param));
        removedTrackers.push(...paramsToDelete);

        // 6. Limpieza agresiva de hash
        if (url.hash && url.hash.toLowerCase().includes('utm_')) {
            url.hash = '';
            removedTrackers.push('utm_hash_fragment');
        }

        return { url: url.toString(), removed: removedTrackers };
    } catch (error) {
        // Manejo de Error: Si es inválida, retornar la original de forma controlada
        return { url: urlString, removed: [] };
    }
}
