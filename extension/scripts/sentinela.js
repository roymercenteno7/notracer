/**
 * NoTracer Sentinela - Content Script
 * Real-time tracking link detector and cleaner.
 */

(function () {
    const GLOBAL_TRACKERS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'utm_id', 'fbclid', 'gclid', 'msclkid', 'igsh', 'mibextid'
    ];

    const DOMAIN_PARAMS = {
        'amazon': ['ref', 'ref_', '_encoding', 'qid', 'keywords'],
        'youtube': ['si', 'pp', 'feature'],
        'tiktok': ['_r', '_t', 'u_code'],
        'spotify': ['si']
    };

    function hasTrackers(urlStr) {
        try {
            const url = new URL(urlStr);
            const params = Array.from(url.searchParams.keys()).map(k => k.toLowerCase());
            if (params.some(p => GLOBAL_TRACKERS.includes(p))) return true;
            for (const [domain, list] of Object.entries(DOMAIN_PARAMS)) {
                if (url.hostname.includes(domain)) {
                    if (params.some(p => list.includes(p))) return true;
                }
            }
            return false;
        } catch (e) { return false; }
    }

    let sentinelBtn = document.createElement('div');
    sentinelBtn.id = 'notracer-sentinela-btn';
    sentinelBtn.innerHTML = 'N';
    sentinelBtn.style.display = 'none';
    document.body.appendChild(sentinelBtn);

    let activeLink = null;

    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && hasTrackers(link.href)) {
            activeLink = link;
            showButton(link);
        } else if (!e.target.closest('#notracer-sentinela-btn')) {
            hideButton();
        }
    });

    function showButton(link) {
        const rect = link.getBoundingClientRect();
        sentinelBtn.style.top = `${window.scrollY + rect.top - 30}px`;
        sentinelBtn.style.left = `${window.scrollX + rect.left + rect.width / 2 - 12}px`;
        sentinelBtn.style.display = 'flex';
    }

    function hideButton() {
        if (!sentinelBtn.matches(':hover')) {
            sentinelBtn.style.display = 'none';
        }
    }

    sentinelBtn.addEventListener('click', async () => {
        if (!activeLink) return;

        sentinelBtn.innerHTML = '...';
        sentinelBtn.classList.add('loading');

        try {
            // NoTracer API Endpoint
            const API_ORIGIN = 'https://notracer.com';

            const response = await fetch(`${API_ORIGIN}/api/links/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: activeLink.href })
            });

            const result = await response.json();

            if (result.success) {
                sentinelBtn.innerHTML = '✓';
                sentinelBtn.title = 'Saved to Dashboard!';
                sentinelBtn.style.borderColor = '#ffffff';
                sentinelBtn.style.color = '#ffffff';
            } else {
                throw new Error(result.error || 'Failed');
            }

            setTimeout(() => {
                sentinelBtn.innerHTML = 'N';
                sentinelBtn.style.borderColor = '#00ff41';
                sentinelBtn.style.color = '#00ff41';
                sentinelBtn.classList.remove('loading');
                sentinelBtn.style.display = 'none';
            }, 3000);
        } catch (err) {
            sentinelBtn.innerHTML = '!';
            sentinelBtn.title = err.message === 'Unauthorized' ? 'Login to notracer.com first' : err.message;
            console.error('[SENTINELA] Error:', err);
            setTimeout(() => {
                sentinelBtn.innerHTML = 'N';
                sentinelBtn.classList.remove('loading');
            }, 3000);
        }
    });
})();
