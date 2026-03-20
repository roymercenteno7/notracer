<script lang="ts">
    import { posts } from '$lib/data/posts';
    import { i18n } from '$lib/i18n';
    
    const t = (path: string) => i18n.t(path);
</script>

<svelte:head>
    <title>{t('blog.title')} | NoTracer_Suite</title>
    <meta name="description" content={t('blog.subtitle')} />

    <!-- JSON-LD Blog Schema for Sitelinks/Rich Snippets -->
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "NoTracer Data Resistance Bulletins",
            "url": "https://notracer.com/blog",
            "description": "Technical cybersecurity intelligence reports addressing web surveillance and operational privacy workflows.",
            "blogPost": [
                {#each posts as post, i}
                {
                    "@type": "BlogPosting",
                    "headline": "{post.title['en']}",
                    "url": "https://notracer.com/blog/{post.slug['en']}",
                    "datePublished": "{post.date}"
                }{i < posts.length - 1 ? ',' : ''}
                {/each}
            ]
        }
    </script>
</svelte:head>

<div class="max-w-4xl mx-auto py-12 px-4 selection:bg-neon selection:text-black">
    <div class="flex items-center gap-4 mb-12 border-b border-neon pb-6">
        <h1 class="text-3xl md:text-5xl font-black text-neon tracking-tighter uppercase">
            {t('blog.title')}
        </h1>
    </div>

    <p class="text-gray-500 font-mono text-sm tracking-widest uppercase mb-12">
        {t('blog.subtitle')}
    </p>

    <div class="flex flex-col gap-8">
        {#each posts as post}
            <article class="border border-gray-900 bg-[#080808] p-6 hover:border-neon/50 transition-colors group font-mono">
                <div class="flex justify-between items-center text-xs tracking-widest mb-4 text-neon/70">
                    <span>{post.date}</span>
                    <span class="bg-neon/10 text-neon px-2 py-1">{t('blog.declassified')}</span>
                </div>
                
                <h2 class="text-xl md:text-2xl font-bold text-gray-100 uppercase tracking-wider mb-4 group-hover:text-neon transition-colors">
                    <a href="/blog/{post.slug[i18n.lang] || post.slug['en']}" class="block">
                        {post.title[i18n.lang] || post.title['en']}
                    </a>
                </h2>
                
                <p class="text-gray-500 text-sm leading-relaxed mb-6">
                    {post.excerpt[i18n.lang] || post.excerpt['en']}
                </p>

                <a href="/blog/{post.slug[i18n.lang] || post.slug['en']}" class="inline-block border text-xs border-gray-700 text-gray-400 hover:text-neon hover:border-neon transition-colors font-bold uppercase tracking-widest px-4 py-2">
                    {t('blog.read')}
                </a>
            </article>
        {/each}
        
        {#if posts.length === 0}
            <div class="text-gray-600 font-mono text-xs uppercase tracking-widest py-12 text-center border top border-dashed border-gray-800">
                {t('blog.empty')}
            </div>
        {/if}
    </div>
</div>
