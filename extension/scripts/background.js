/**
 * NoTracer Sentinela - Background Service Worker
 * Handles API calls to bypass CORS restrictions.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CREATE_LINK') {
        const API_ORIGIN = 'https://notracer.com';

        fetch(`${API_ORIGIN}/api/links/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: message.url })
        })
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => {
                console.error('[BACKGROUND] API Error:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep channel open for async response
    }
});
