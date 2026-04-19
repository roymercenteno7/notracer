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
            en: 'qr-codes-privacy-anonymous-digital-identity',
            es: 'codigos-qr-privacidad-identidad-digital-anonima'
        },
        date: '2026-04-18',
        title: {
            es: 'QR Codes: La Última Frontera de la Privacidad Digital',
            en: 'QR Codes: The Last Frontier of Digital Privacy'
        },
        excerpt: {
            es: 'Por qué los códigos QR pueden ser más peligrosos que las cookies y cómo proteger tu identidad digital.',
            en: 'Why QR codes can be more dangerous than cookies and how to protect your digital identity.'
        },
        seoDescription: {
            es: 'Análisis técnico: Los códigos QR rastrean tu ubicación, dispositivo y hábitos de navegación. Aprende a generar QR anónimaos y proteger tu privacidad.',
            en: 'Technical analysis: QR codes track your location, device, and browsing habits. Learn to generate anonymous QR and protect your privacy.'
        },
        content: {
            es: `
                <p>Cada vez que escaneas un código QR, no estás simplemente accediendo a una URL. Estás entregándote a ti mismo a una infraestructura de rastreo que sabe exactamente dónde estás, cuándo estuviste ahí, y qué hiciste a continuación.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Metadata Oculto del QR</h2>
                <p>Un código QR parece inofensivo — solo píxeles negros en un fondo blanco. Pero cada QR generado por plataformas comerciales contiene metadatos integrados:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">ID Único:</strong> Un identificador que vincula tu escaneo directamente a tu perfil.</li>
                    <li><strong class="text-gray-300">Timestamp:</strong> Registro exacto de cuándo y dónde escaneaste.</li>
                    <li><strong class="text-gray-300">Geolocalización:</strong> Coordenadas del lugar físico donde accediste.</li>
                    <li><strong class="text-gray-300"> fingerprinting de dispositivo:</strong> Información sobre tu teléfono, modelo, y sistema operativo.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Modelo de Negocio Escondido</h2>
                <p>Empresas como QR Stuff, Bitly, y servicios de generación de QR "gratuitos" monetizan tus datos:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li>Venden metadatos de escaneo a anunciantes y analistas de mercado</li>
                    <li>Construyen perfiles de movimiento físico de millones de usuarios</li>
                    <li>Correlacionan actividad online con offline</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Protocolo NoTracer QR</h2>
                <p>El generador de QR de NoTracer opera bajo principios opuestos:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Sin Registro:</strong> No requiere cuenta, email, o identificación</li>
                    <li><strong class="text-gray-300">Sin Metadatos:</strong> Solo la URL que tú proporcionas, nada más</li>
                    <li><strong class="text-gray-300">Sin Tracking:</strong> No registramos timestamps, ubicaciones, ni dispositivos</li>
                    <li><strong class="text-gray-300">Local Generation:</strong> El QR se genera en tu navegador, no en nuestro servidor</li>
                </ul>

                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "Escanea el código. No el rastreo. Comparte el enlace. No tus datos."
                </blockquote>
            `,
            en: `
                <p>Every time you scan a QR code, you're not just accessing a URL. You're handing yourself over to tracking infrastructure that knows exactly where you are, when you were there, and what you did next.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The Hidden QR Metadata</h2>
                <p>A QR code looks harmless — just black pixels on a white background. But every commercially-generated QR contains embedded metadata:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Unique ID:</strong> An identifier that links your scan directly to your profile.</li>
                    <li><strong class="text-gray-300">Timestamp:</strong> Exact record of when and where you scanned.</li>
                    <li><strong class="text-gray-300">Geolocation:</strong> Coordinates of the physical place where you accessed.</li>
                    <li><strong class="text-gray-300">Device Fingerprinting:</strong> Information about your phone, model, and OS.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The Hidden Business Model</h2>
                <p>Companies like QR Stuff, Bitly, and "free" QR generators monetize your data:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li>Sell scan metadata to advertisers and market analysts</li>
                    <li>Build physical movement profiles of millions of users</li>
                    <li>Correlate online activity with offline behavior</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The NoTracer QR Protocol</h2>
                <p>The NoTracer QR generator operates under opposite principles:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">No Registration:</strong> No account, email, or identification required</li>
                    <li><strong class="text-gray-300">No Metadata:</strong> Only the URL you provide, nothing else</li>
                    <li><strong class="text-gray-300">No Tracking:</strong> We don't log timestamps, locations, or devices</li>
                    <li><strong class="text-gray-300">Local Generation:</strong> QR generates in your browser, not our server</li>
                </ul>

                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "Scan the code. Not the tracking. Share the link. Not your data."
                </blockquote>
            `
        }
    },
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
    },
    {
        slug: {
            en: 'webp-privacy-revolution-image-optimization',
            es: 'webp-revolucion-privacidad-optimizacion-imagenes'
        },
        date: '2026-04-09',
        title: {
            es: 'WebP: La Revolución Silenciosa de la Privacidad en Imágenes',
            en: 'WebP: The Silent Privacy Revolution in Image Optimization'
        },
        excerpt: {
            es: 'Por qué WebP no es solo un formato más, sino una declaración de guerra contra la telemetría invasiva incrustada en tus fotos.',
            en: 'Why WebP is not just another format, but a declaration of war against invasive telemetry embedded in your photos.'
        },
        seoDescription: {
            es: 'Análisis técnico: WebP elimina metadatos EXIF que revelan tu ubicación GPS, dispositivo yhora exacta. Aprende cómo Media Shifter te protege.',
            en: 'Technical analysis: WebP removes EXIF metadata revealing your GPS location, device and exact time. Learn how Media Shifter protects you.'
        },
        content: {
            es: `
                <p>Cada vez que subes una fotografía a internet, no solo compartes píxeles. Adjuntas inadvertidamente un archivo de inteligencia personal: <strong>metadatos EXIF</strong>. Dentro de esa imagen aparentemente inofensiva se ocultan coordenadas GPS exactas, modelo del dispositivo, marca de tiempo del software, y a veces hasta el nombre del propietario de la cámara.</p>
                <p>WebP no es solo un formato de compresión superior (entre 25-35% más pequeño que JPEG con calidad equivalente). Es también un mecanismo de defensa <strong>quirúrgico</strong> que decapita todos esos datos personales antes de que tu imagen toque la web.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Metadata Oculto: Tu Huella Digital en Cada Foto</h2>
                <p>Los datos EXIF (Exchangeable Image File Format) nacieron con buena intención: ayudar a fotógrafos a organizar sus archivos. Pero se convirtieron en una mina de oro para:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Rastreo de ubicación:</strong> Las etiquetas GPS revelan exactamente dónde tomaste cada foto.metadata.</li>
                    <li><strong class="text-gray-300">Perfil de dispositivo:</strong> El modelo de cámara y software revelan tu nivel socioeconómico y hábitos tecnológicos.</li>
                    <li><strong class="text-gray-300">Análisis forense:</strong> Timestamps exactos permiten construir cronologías de tus movimientos.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">Por Qué WebP Es El Escudo Definitivo</h2>
                <p>Cuando conviertes una imagen a WebP utilizando <em>Media Shifter</em>, el proceso de recompresión crea un entirely new archivo binario. Este proceso:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Destruye todos los metadatos EXIF</strong> - coordenadas GPS, modelo de dispositivo, timestamps - se evaporan durante la recodificación.</li>
                    <li><strong class="text-gray-300">Elimina thumbnails embebidos</strong> - miniaturas ocultas que pueden revelar la edición original.</li>
                    <li><strong class="text-gray-300">Reduce tamaño sin pérdida perceptible</strong> - misma calidad visual, menor superficie de ataque.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Costo Oculto de JPEG/PNG</h2>
                <p>Cada archivo JPEG o PNG que subes a redes sociales o sitios web es un vectors de ataque potencial. Las plataformas pueden — y lo hacen — extraer esos metadatos para:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li>Mapear tus ubicaciones frecuentes</li>
                    <li>Identificar tus dispositivos y patrones de uso</li>
                    <li>Vincular fotos entre diferentes plataformas a través de firmas únicas de dispositivo</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">El Protocolo Media Shifter</h2>
                <p><em>Media Shifter</em> de NoTracer automatiza este proceso de sanitización. Arrastra una imagen, obtienes un WebP limpio. Sin configuración. Sin preguntas. Sin metadata.</p>
                <p>El flujo de trabajo es simple pero implacable:</p>
                <ol class="list-decimal pl-6 space-y-2 my-4 text-gray-400">
                    <li>Arrastras tu imagen original (JPEG/PNG)</li>
                    <li>El servidor recibe el archivo binario</li>
                    <li>Sharp (motor de procesamiento) decodifica y recodifica a WebP</li>
                    <li>El nuevo archivo sale sin metadatos, sin EXIF, sin GPS</li>
                    <li>Descargas tu imagen sanitizada lista para la web</li>
                </ol>

                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "No subas a la web lo que no quieres que el mundo sepa. WebP es tu borrador digital."
                </blockquote>
            `,
            en: `
                <p>Every time you upload a photograph to the internet, you are not just sharing pixels. You are inadvertently attaching a personal intelligence file: <strong>EXIF metadata</strong>. Hidden within that seemingly harmless image are exact GPS coordinates, device model, software timestamps, and sometimes even the camera owner's name.</p>
                <p>WebP is not just a superior compression format (25-35% smaller than JPEG with equivalent quality). It is also a <strong>surgical</strong> defense mechanism that decapitates all that personal data before your image touches the web.</p>
                
                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The Hidden Metadata: Your Digital Fingerprint in Every Photo</h2>
                <p>EXIF data (Exchangeable Image File Format) was born with good intention: helping photographers organize their files. But it became a goldmine for:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Location tracking:</strong> GPS tags reveal exactly where you took each photo.</li>
                    <li><strong class="text-gray-300">Device profiling:</strong> Camera model and software reveal your socioeconomic level and tech habits.</li>
                    <li><strong class="text-gray-300">Forensic analysis:</strong> Exact timestamps allow building chronologies of your movements.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">Why WebP Is the Ultimate Shield</h2>
                <p>When you convert an image to WebP using <em>Media Shifter</em>, the recompression process creates an entirely new binary file. This process:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li><strong class="text-gray-300">Destroys all EXIF metadata</strong> - GPS coordinates, device model, timestamps - evaporate during recoding.</li>
                    <li><strong class="text-gray-300">Removes embedded thumbnails</strong> - hidden thumbnails that can reveal original edits.</li>
                    <li><strong class="text-gray-300">Reduces size without perceptible loss</strong> - same visual quality, smaller attack surface.</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The Hidden Cost of JPEG/PNG</h2>
                <p>Every JPEG or PNG file you upload to social media or websites is a potential attack vector. Platforms can — and do — extract that metadata to:</p>
                <ul class="list-disc pl-6 space-y-2 my-4 text-gray-400">
                    <li>Map your frequent locations</li>
                    <li>Identify your devices and usage patterns</li>
                    <li>Link photos across platforms through unique device signatures</li>
                </ul>

                <h2 class="text-2xl font-bold text-neon mt-8 mb-4 border-b border-gray-900 pb-2">The Media Shifter Protocol</h2>
                <p><em>Media Shifter</em> from NoTracer automates this sanitization process. Drag an image, get a clean WebP. No configuration. No questions. No metadata.</p>
                <p>The workflow is simple but relentless:</p>
                <ol class="list-decimal pl-6 space-y-2 my-4 text-gray-400">
                    <li>Drag your original image (JPEG/PNG)</li>
                    <li>Server receives the binary file</li>
                    <li>Sharp (processing engine) decodes and re-encodes to WebP</li>
                    <li>New file exits without metadata, without EXIF, without GPS</li>
                    <li>Download your sanitized image ready for the web</li>
                </ol>

                <blockquote class="border-l-2 border-neon pl-4 py-2 mt-8 text-gray-300 italic opacity-80">
                    "Don't upload to the web what you don't want the world to know. WebP is your digital eraser."
                </blockquote>
            `
        }
    }
];
