<script lang="ts">
    import type { BlogPost } from '$lib/data/posts';
    import { i18n } from '$lib/i18n';

    let { data } = $props<{ data: { post: BlogPost } }>();
    let post = $derived(data.post);
    let t = $derived((path: string) => i18n.t(path));

    let currentTitle = $derived(post.title[i18n.lang] || post.title['en']);
    let currentDesc = $derived(post.seoDescription[i18n.lang] || post.seoDescription['en']);
    let currentExcerpt = $derived(post.excerpt[i18n.lang] || post.excerpt['en']);
    let currentContent = $derived(post.content[i18n.lang] || post.content['en']);
</script>

<svelte:head>
    <title>{currentTitle} | NoTracer_Suite</title>
    <meta name="description" content={currentDesc} />
    
    <!-- Open Graph -->
    <meta property="og:title" content="{currentTitle} | NoTracer_Suite" />
    <meta property="og:description" content={currentDesc} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={post.date} />

    <!-- JSON-LD Article Schema -->
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "{post.title['en']}",
            "description": "{post.seoDescription['en']}",
            "datePublished": "{post.date}",
            "author": {
                "@type": "Organization",
                "name": "NoTracer Data Resistance"
            },
            "publisher": {
                "@type": "Organization",
                "name": "NoTracer",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://notracer.com/icon.png"
                }
            }
        }
    </script>
</svelte:head>

<div class="max-w-3xl mx-auto py-12 px-4 selection:bg-neon selection:text-black">
    <a href="/blog" class="inline-flex items-center gap-2 text-gray-500 hover:text-neon transition-colors font-mono text-xs uppercase tracking-widest mb-12">
        <span>←</span> {t('blog.back')}
    </a>

    <header class="mb-12 border-b border-gray-900 pb-8">
        <div class="flex items-center gap-4 text-xs tracking-widest font-mono text-neon/70 mb-6">
            <span class="bg-neon/10 px-2 py-1">{t('blog.declassified')}</span>
            <span>{post.date}</span>
        </div>
        
        <h1 class="text-3xl md:text-5xl font-black text-gray-100 tracking-tighter uppercase mb-6 leading-tight">
            {currentTitle}
        </h1>
        
        <p class="text-xl text-gray-400 font-mono tracking-wide leading-relaxed border-l-2 border-gray-800 pl-4 py-2">
            {currentExcerpt}
        </p>
    </header>

    <div class="prose prose-invert prose-neon max-w-none font-sans text-gray-300 leading-loose">
        {@html currentContent}
    </div>

    <div class="mt-16 pt-8 border-t border-gray-900 text-center">
        <p class="text-gray-500 font-mono text-xs uppercase tracking-widest mb-6">
            {t('blog.end')}
        </p>
        <a href="/blog" class="inline-block border text-xs border-neon text-neon hover:bg-neon hover:text-black transition-colors font-bold uppercase tracking-widest px-8 md:px-12 py-4">
            {t('blog.close')}
        </a>
    </div>
</div>

<style>
    /* Styling for the raw injected HTML content (Prose imitation) */
    :global(.prose-neon h2) {
        color: #00FF41; /* neon */
        font-family: monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 3rem;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        border-bottom: 1px solid rgba(0, 255, 65, 0.2);
        padding-bottom: 0.5rem;
    }
    :global(.prose-neon p) {
        margin-bottom: 1.5rem;
    }
    :global(.prose-neon strong) {
        color: #fff;
    }
    :global(.prose-neon code) {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: monospace;
        color: #00FF41;
    }
    :global(.prose-neon ul) {
        list-style-type: square;
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
    }
    :global(.prose-neon li) {
        margin-bottom: 0.5rem;
        color: #aaa;
    }
</style>
