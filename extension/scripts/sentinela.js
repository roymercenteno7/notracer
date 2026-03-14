/**
 * NoTracer Sentinela - Content Script
 * Stability Update: Robust activeLink capture and click handling.
 */

(function () {
    const GLOBAL_TRACKERS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'utm_id', 'fbclid', 'gclid', 'msclkid', 'igsh', 'mibextid', 'si', 'ref_', 'qid'
    ];

    const DOMAIN_PARAMS = {
        'amazon': ['ref', 'ref_', '_encoding', 'qid', 'keywords', 'dib', 'dib_tag'],
        'youtube': ['si', 'pp', 'feature'],
        'tiktok': ['_r', '_t', 'u_code'],
        'spotify': ['si']
    };

    function analyzeURL(urlStr) {
        try {
            const url = new URL(urlStr);
            const params = [];
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
                params.push({ key, value, status: isTracker ? 'TRACKER' : 'CLEAN' });
            });
            return params;
        } catch (e) { return []; }
    }

    function getCleanURL(urlStr) {
        try {
            const url = new URL(urlStr);
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
    modalHost.style.position = 'fixed';
    modalHost.style.zIndex = '2147483647'; // Max possible z-index
    modalHost.style.top = '0';
    modalHost.style.left = '0';
    modalHost.style.pointerEvents = 'none'; // Only capture clicks inside the shadow DOM
    document.body.appendChild(modalHost);

    const shadow = modalHost.attachShadow({ mode: 'open' });
    const modalRoot = document.createElement('div');
    modalRoot.id = 'xray-modal-root';
    modalRoot.style.pointerEvents = 'auto'; // Re-enable clicks inside the modal
    shadow.appendChild(modalRoot);

    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('styles/sentinela.css');
    shadow.appendChild(styleLink);

    let activeLink = null;
    let hideTimeout = null;

    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        const isBtn = e.target.closest('#notracer-sentinela-btn');

        if (link && link.href && link.href.startsWith('http')) {
            const analysis = analyzeURL(link.href);
            if (analysis.some(p => p.status === 'TRACKER')) {
                clearTimeout(hideTimeout);
                activeLink = link;
                showButton(link);
            }
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

    sentinelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (activeLink && activeLink.href) {
            console.log('[SENTINELA] X-Ray Triggered for:', activeLink.href);
            openXrayModal(activeLink.href);
        } else {
            console.warn('[SENTINELA] No active link captured on click.');
        }
    });

    function openXrayModal(url) {
        modalHost.style.pointerEvents = 'auto';
        modalRoot.innerHTML = `
            <div class="xray-backdrop">
                <div class="xray-content">
                    <div class="xray-scan-line"></div>
                    <div class="xray-header">
                        [ NOTRACER_XRAY_VISION ]
                        <span class="xray-close">&times;</span>
                    </div>
                    <div class="xray-body">
                        <div class="xray-scanning-text">SCANNING_IN_PROGRESS...</div>
                        <div class="xray-results" style="display: none;"></div>
                    </div>
                    <div class="xray-footer" style="display: none;">
                        <button class="xray-btn xray-btn-redirect">OPEN_CLEAN_URL</button>
                        <button class="xray-btn xray-btn-save">SAVE_TO_DASHBOARD</button>
                    </div>
                </div>
            </div>
        `;
        modalRoot.style.display = 'block';

        const results = analyzeURL(url);
        const resultsDiv = modalRoot.querySelector('.xray-results');
        const footer = modalRoot.querySelector('.xray-footer');
        const scanningText = modalRoot.querySelector('.xray-scanning-text');

        const closeMod = () => {
            modalRoot.style.display = 'none';
            modalHost.style.pointerEvents = 'none';
        };

        modalRoot.querySelector('.xray-close').onclick = closeMod;
        modalRoot.querySelector('.xray-backdrop').onclick = (e) => { if (e.target.className === 'xray-backdrop') closeMod(); };

        setTimeout(() => {
            scanningText.style.display = 'none';
            resultsDiv.style.display = 'block';
            footer.style.display = 'flex';

            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="xray-clean-status">[ STATUS: CLEAN_LINK ]</div>';
            } else {
                resultsDiv.innerHTML = results.map(p => `
                    <div class="xray-param-row">
                        <span class="xray-param-key">${p.key}</span>
                        <span class="xray-param-badge ${p.status === 'TRACKER' ? 'badge-trash' : 'badge-clean'}">${p.status}</span>
                    </div>
                `).join('');
            }
        }, 1200);

        modalRoot.querySelector('.xray-btn-redirect').onclick = () => {
            window.open(getCleanURL(url), '_blank');
            closeMod();
        };

        modalRoot.querySelector('.xray-btn-save').onclick = async function () {
            this.innerHTML = 'SAVING...';
            this.disabled = true;
            chrome.runtime.sendMessage({ type: 'CREATE_LINK', url }, (res) => {
                if (res && res.success) {
                    this.innerHTML = 'SAVED_SUCCESSFULLY';
                    setTimeout(closeMod, 1500);
                } else {
                    this.innerHTML = 'ERROR_SAVING';
                    this.disabled = false;
                }
            });
        };
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalRoot.style.display = 'none';
            modalHost.style.pointerEvents = 'none';
        }
    });
})();
