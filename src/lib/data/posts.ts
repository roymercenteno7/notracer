export interface BlogPost {
    slug: Record<'en' | 'es', string>;
    date: string;
    title: Record<'en' | 'es', string>;
    excerpt: Record<'en' | 'es', string>;
    content: Record<'en' | 'es', string>; // HTML string
    seoDescription: Record<'en' | 'es', string>;
}

export const posts: BlogPost[] = [
    {
        slug: {
            en: 'anatomy-of-web-trackers-utm-fbclid-privacy-threats',
            es: 'anatomia-de-rastreadores-web-utm-fbclid-amenazas-privacidad'
        },
        date: '2026-03-19',
        title: {
            es: 'La Anatomía de los Rastreadores Web (UTM, fbclid)',
            en: 'The Anatomy of Web Trackers (UTM, fbclid)'
        },
        excerpt: {
            es: 'Descubre cómo las megacorporaciones inyectan código invisible en cada enlace que compartes para mapear tu huella digital.',
            en: 'Discover how megacorporations inject invisible code into every link you share to map your digital footprint.'
        },
        seoDescription: {
            es: 'Un análisis técnico de cómo los parámetros utm_source, gclid y fbclid rastrean tu navegación y privacidad en internet, y cómo NoTracer los destruye quirúrgicamente.',
            en: 'A technical analysis of how utm_source, gclid, and fbclid parameters track your internet navigation and privacy, and how NoTracer surgically neutralizes them.'
        },
        content: {
            es: `
                <p>La web moderna no está diseñada para la privacidad; está construida como una red masiva de sensores. Cada vez que copias un enlace desde una plataforma como Facebook, TikTok o Amazon, rara vez obtienes una URL limpia. En su lugar, obtienes una cadena tóxica y mutada llena de parámetros incomprensibles como <code>?fbclid=IwAR...</code> o <code>?utm_medium=social</code>.</p>
                <p>Estos parámetros no tienen ninguna función técnica real para cargar la página. Su único propósito es actuar como una <strong>etiqueta de rastreo radiactiva</strong>.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">Vectores de Infección: ¿Qué son exactamente?</h2>
                <p>Un rastreador web (o Tracker URL Parameter) es un fragmento de texto añadido al final de un enlace oficial. Los más agresivos incluyen:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">fbclid (Facebook Click ID):</strong> Una firma única y encriptada que Facebook usa para rastrear exactamente quién hizo clic en qué, incluso si cruzas dominios ajenos a Meta. Exponiendo tu perfil privado al exterior.</li>
                    <li><strong class="text-gray-300">gclid / wbraid (Google):</strong> Los identificadores de Google Ads. Vinculan permanentemente tu historial de clicks a la base de datos central de inteligencia de Google.</li>
                    <li><strong class="text-gray-300">UTM Parameters:</strong> Creados originalmente para marketing analítico corporativo (Urchin Tracking Module), hoy en día se utilizan para perfilar el tamaño, la demografía y las influencias de audiencias enteras.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">La Contaminación P2P (Peer-to-Peer)</h2>
                <p>El problema más grave es la "infección secundaria". Si copias un enlace contaminado desde tu feed de Instagram y se lo envías por chat a un familiar o colega de tu trabajo, el algoritmo de vigilancia ahora establece que <strong>TÚ</strong> y <strong>ESA PERSONA</strong> tienen una relación de conocimiento directo, debido a que el identificador <code>igshid</code> único estaba amarrado a la sesión de tu cuenta origen.</p>
                <p>Estás sacrificando tu grafo social e intimidad sin darte cuenta, enriqueciendo bases de datos de corporaciones a miles de kilómetros de distancia.</p>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Protocolo NoTracer</h2>
                <p>El motor de <em>Link Purger</em> fue diseñado y levantado arquitectónicamente de forma estricta y hostil contra esta amenaza.</p>
                <p>Al pasar un enlace radiactivo por la terminal de NoTracer, el núcleo del sistema desmonta los hipervínculos en sus fragmentos más fundamentales y despliega más de 200 algoritmos reconocidos en bases de datos abiertas para <strong>sintetizar y amputar</strong> quirúrgicamente todo rastro de código malicioso parasitario de rastreo.</p>
                <p>El resultado devuelto a ti es la URL original, prístina y matemáticamente idéntica al destino, pero completamente "ciega" ante los analistas de big data apostados a la espera.</p>
                
                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "Mantente oculto en las sombras del ruido. Comparte el contenido. No tus datos."
                </blockquote>
            `,
            en: `
                <p>The modern web isn't designed for privacy; it functions as a massive covert sensor network. Every time you copy a link from a platform like Facebook, TikTok, or Amazon, you rarely get a clean URL. Instead, you extract a toxic, mutated string loaded with incomprehensible parameters like <code>?fbclid=IwAR...</code> or <code>?utm_medium=social</code>.</p>
                <p>These parameters serve no real technical purpose for loading the page. Their sole function is to act as a <strong>radioactive tracking tag</strong>.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">Infection Vectors: What exactly are they?</h2>
                <p>A web tracker (or Tracker URL Parameter) is a text fragment appended to the end of an official link. The most aggressive include:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">fbclid (Facebook Click ID):</strong> A unique, encrypted signature that Facebook uses to track exactly who clicked what, even if you cross domains outside of Meta. Exposing your private profile outwards.</li>
                    <li><strong class="text-gray-300">gclid / wbraid (Google):</strong> Google Ads identifiers. They permanently tether your click history to Google's central intelligence database.</li>
                    <li><strong class="text-gray-300">UTM Parameters:</strong> Originally created for corporate marketing analytics (Urchin Tracking Module), they are actively leveraged to aggressively trace demographics, behaviors, and influences across sweeping audiences.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">P2P Contamination (Peer-to-Peer)</h2>
                <p>The most severe problem is "secondary infection". If you copy a contaminated link from your Instagram feed and forward it via private chat to a family member or coworker, the surveillance algorithm maps out that <strong>YOU</strong> and <strong>THEY</strong> have an active, trusted link. Why? Because the unique <code>igshid</code> identifier tethered onto the string was baked into your origin session.</p>
                <p>You are sacrificing your close social graph and interpersonal privacy without realizing it, enriching databases of mega-corporations thousands of miles away.</p>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The NoTracer Protocol</h2>
                <p>The <em>Link Purger</em> engine was inherently architected and erected as a strict, hostile response against this invasive surveillance modeling.</p>
                <p>Sending a radioactive link through the NoTracer endpoint de-marshalls the URLs to their base fundamental shards, triggering over 200 recognized algorithmic tracking signatures modeled on open databases to surgically <strong>synthesize and amputate</strong> all traces of parasitic tracker code.</p>
                <p>The resulting payload pushed into your clipboard is the pristine root URL, mathematically identical to the intended endpoint, but fully "blind" to external big data analysts waiting down the line.</p>
                
                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "Stay concealed within the noise. Share the content. Not your data."
                </blockquote>
            `
        }
    }
];
