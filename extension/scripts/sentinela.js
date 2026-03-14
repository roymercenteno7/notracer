/**
 * NoTracer Sentinela - Content Script
 * Real-time tracking link detector and cleaner.
 * Interaction Update: Delegating fetch to background script to bypass CORS.
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
    let hideTimeout = null;

    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        const isBtn = e.target.closest('#notracer-sentinela-btn');

        if (link && link.href && hasTrackers(link.href)) {
            clearTimeout(hideTimeout);
            activeLink = link;
            showButton(link);
        } else if (isBtn) {
            clearTimeout(hideTimeout);
        } else {
            startHideTimeout();
        }
    });

    function showButton(link) {
        const rect = link.getBoundingClientRect();
        sentinelBtn.style.top = `${window.scrollY + rect.top - 18}px`;
        sentinelBtn.style.left = `${window.scrollX + rect.left + rect.width / 2 - 12}px`;
        sentinelBtn.style.display = 'flex';
    }

    function startHideTimeout() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!sentinelBtn.matches(':hover')) {
                sentinelBtn.style.display = 'none';
            }
        }, 800);
    }

    sentinelBtn.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    sentinelBtn.addEventListener('mouseleave', () => startHideTimeout());

    sentinelBtn.addEventListener('click', () => {
        if (!activeLink) return;

        sentinelBtn.innerHTML = '...';
        sentinelBtn.classList.add('loading');

        // Send message to background script to bypass CORS
        chrome.runtime.sendMessage({
            type: 'CREATE_LINK',
            url: activeLink.href
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('[SENTINELA] Runtime Error:', chrome.runtime.lastError);
                showFeedback('!', 'Extension error. Reload page.');
                return;
            }

            if (response && response.success) {
                showFeedback('✓', 'Saved to Dashboard!', '#ffffff');
            } else {
                const errorMsg = response?.data?.error || response?.error || 'Failed';
                showFeedback('!', errorMsg === 'Unauthorized' ? 'Login to notracer.com first' : errorMsg);
            }
        });
    });

    function showFeedback(text, title, color = '#00ff41') {
        sentinelBtn.innerHTML = text;
        sentinelBtn.title = title;
        sentinelBtn.style.borderColor = color;
        sentinelBtn.style.color = color;
        sentinelBtn.classList.remove('loading');

        setTimeout(() => {
            sentinelBtn.innerHTML = 'N';
            sentinelBtn.style.borderColor = '#00ff41';
            sentinelBtn.style.color = '#00ff41';
            sentinelBtn.style.display = 'none';
        }, 3000);
    }
})();
