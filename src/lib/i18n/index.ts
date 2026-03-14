import { browser } from '$app/environment';
import en from './en.json';
import es from './es.json';

type Translations = typeof en;
const dictionaries: Record<string, Translations> = { en, es };

// Svelte 5 Rune for Global State
class I18nManager {
    lang = $state('en');

    constructor() {
        if (browser) {
            const saved = localStorage.getItem('notracer_lang');
            if (saved === 'en' || saved === 'es') {
                this.lang = saved;
            } else {
                // Auto-detect from browser
                const navLang = navigator.language.split('-')[0];
                this.lang = dictionaries[navLang] ? navLang : 'en';
            }
        }
    }

    setLang(l: 'en' | 'es') {
        this.lang = l;
        if (browser) localStorage.setItem('notracer_lang', l);
    }

    // Translation function (t)
    t(path: string): string {
        const parts = path.split('.');
        let val: any = dictionaries[this.lang];

        for (const part of parts) {
            val = val?.[part];
        }

        return val || path;
    }
}

export const i18n = new I18nManager();
