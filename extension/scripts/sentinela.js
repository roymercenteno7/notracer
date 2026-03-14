/**
 * NoTracer Sentinela - Content Script
 * V2.1: Robust YouTube support and CSS accessibility fixes.
 */

(function () {
    const GLOBAL_TRACKERS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'utm_id', 'fbclid', 'gclid', 'msclkid', 'igsh', 'mibextid', 'si', 'ref_', 'qid', 'feature', 'pp'
    ];

    const DOMAIN_PARAMS = {
        'amazon': ['ref', 'ref_', '_encoding', 'qid', 'keywords', 'dib', 'dib_tag'],
        'youtube': ['si', 'pp', 'feature', 't'],
        'tiktok': ['_r', '_t', 'u_code'],
        'spotify': ['si']
    };

    function analyzeURL(urlStr) {
        try {
            // Handle relative URLs
            const url = new URL(urlStr, window.location.origin);
            let trackerCount = 0;
            const hostname = url.hostname.toLowerCase();

            url.searchParams.forEach((value, key) => {
                const lowerKey = key.toLowerCase();
                let isTracker = false;
                if (GLOBAL_TRACKERS.includes(lowerKey)) isTracker = true;
                else {
                    for (const [domain, list] of Object.entries(DOMAIN_PARAMS)) {
                        if (hostname.includes(domain)) {
                            if (list.includes(lowerKey) || list.some(p => lowerKey.startsWith(p))) {
                                isTracker = true;
                                break;
                            }
                        }
                    }
                }
                if (isTracker) trackerCount++;
            });
            return { trackerCount, url };
        } catch (e) { return { trackerCount: 0, url: null }; }
    }

    function getCleanURL(urlStr) {
        try {
            const url = new URL(urlStr, window.location.origin);
            const paramsToDelete = [];
            const hostname = url.hostname.toLowerCase();
            url.searchParams.forEach((value, key) => {
                const lowerKey = key.toLowerCase();
                let isTracker = false;
                if (GLOBAL_TRACKERS.includes(lowerKey)) isTracker = true;
                else {
                    for (const [domain, list] of Object.entries(DOMAIN_PARAMS)) {
                        if (hostname.includes(domain)) {
                            if (list.includes(lowerKey) || list.some(p => lowerKey.startsWith(p))) {
                                isTracker = true;
                                break;
                            }
                        }
                    }
                }
                if (isTracker) paramsToDelete.push(key);
            });
            paramsToDelete.forEach(p => url.searchParams.delete(p));
            return url.toString();
        } catch (e) { return urlStr; }
    }

    // UI ELEMENTS
    let sentinelBtn = document.createElement('div');
    sentinelBtn.id = 'notracer-sentinela-btn';
    sentinelBtn.innerHTML = 'N';
    sentinelBtn.style.display = 'none';
    document.body.appendChild(sentinelBtn);

    const modalHost = document.createElement('div');
    modalHost.id = 'notracer-xray-host';
    modalHost.style.position = 'absolute';
    modalHost.style.zIndex = '2147483647';
    modalHost.style.pointerEvents = 'none';
    document.body.appendChild(modalHost);

    const shadow = modalHost.attachShadow({ mode: 'open' });
    const balloonRoot = document.createElement('div');
    balloonRoot.className = 'sentinela-balloon';
    balloonRoot.style.display = 'none';
    balloonRoot.style.pointerEvents = 'auto';
    shadow.appendChild(balloonRoot);

    // Load styles into Shadow DOM
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('styles/sentinela.css');
    shadow.appendChild(styleLink);

    let activeLink = null;
    let hideTimeout = null;

    // Use capturing phase to get ahead of YouTube/Amazon SPAs
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && (link.href.startsWith('http') || link.href.startsWith('/'))) {
            const { trackerCount } = analyzeURL(link.href);
            if (trackerCount > 0) {
                clearTimeout(hideTimeout);
                activeLink = link;
                showButton(link);
            }
        } else if (!e.target.closest('#notracer-sentinela-btn')) {
            startHideTimeout();
        }
    }, true);

    function showButton(link) {
        if (balloonRoot.style.display === 'flex') return;
        const rect = link.getBoundingClientRect();
        sentinelBtn.style.top = `${window.scrollY + rect.top - 18}px`;
        sentinelBtn.style.left = `${window.scrollX + rect.left + rect.width / 2 - 12}px`;
        sentinelBtn.style.display = 'flex';
    }

    function startHideTimeout() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!sentinelBtn.matches(':hover') && balloonRoot.style.display !== 'flex') {
                sentinelBtn.style.display = 'none';
            }
        }, 800);
    }

    sentinelBtn.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    sentinelBtn.addEventListener('mouseleave', () => startHideTimeout());

    // Robust click handling
    sentinelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeLink) showBalloon(activeLink.href);
    }, true);

    function showBalloon(url) {
        const { trackerCount } = analyzeURL(url);
        sentinelBtn.style.display = 'none';

        const rect = activeLink.getBoundingClientRect();
        modalHost.style.top = `${window.scrollY + rect.top - 80}px`;
        modalHost.style.left = `${window.scrollX + rect.left + rect.width / 2 - 80}px`;

        balloonRoot.innerHTML = `
            <div class="balloon-header">
                <span>[ SENTINELA_V2 ]</span>
                <div class="trash-container">
                    <span>🗑️</span> <span style="font-size: 14px;">${trackerCount}</span>
                </div>
            </div>
            <div class="balloon-actions">
                <button class="balloon-btn balloon-btn-go">GO</button>
                <button class="balloon-btn balloon-btn-save">SAVE</button>
            </div>
        `;
        balloonRoot.style.display = 'flex';

        balloonRoot.querySelector('.balloon-btn-go').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(getCleanURL(url), '_blank');
            closeBalloon();
        };

        balloonRoot.querySelector('.balloon-btn-save').onclick = async function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.innerHTML = '...';
            this.disabled = true;
            chrome.runtime.sendMessage({ type: 'CREATE_LINK', url }, (res) => {
                if (res && res.success) {
                    this.innerHTML = '✓';
                    setTimeout(closeBalloon, 1000);
                } else {
                    this.innerHTML = 'ERR';
                    this.disabled = false;
                }
            });
        };
    }

    function closeBalloon() {
        balloonRoot.style.display = 'none';
        activeLink = null;
    }

    document.addEventListener('mousedown', (e) => {
        if (!modalHost.contains(e.target) && !sentinelBtn.contains(e.target)) closeBalloon();
    }, true);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBalloon();
    }, true);
})();
