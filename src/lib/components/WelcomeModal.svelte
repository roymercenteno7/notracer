<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { i18n } from '$lib/i18n';

    let show = false;
    let step = 1;

    // Svelte 5 reactive derivation for cards
    let cards = $derived([
        {
            title: i18n.t('tutorial.step1_title'),
            description: i18n.t('tutorial.step1_desc'),
            image: '/images/tutorial/step1.png'
        },
        {
            title: i18n.t('tutorial.step2_title'),
            description: i18n.t('tutorial.step2_desc'),
            image: '/images/tutorial/step2.png'
        },
        {
            title: i18n.t('tutorial.step3_title'),
            description: i18n.t('tutorial.step3_desc'),
            image: '/images/tutorial/step3.png'
        }
    ]);

    onMount(() => {
        const visited = localStorage.getItem('notracer_v3_tutorial');
        if (!visited) {
            show = true;
        }
    });

    function nextStep() {
        if (step < 3) {
            step++;
        } else {
            finish();
        }
    }

    function skip() {
        finish();
    }

    function finish() {
        localStorage.setItem('notracer_v3_tutorial', 'true');
        show = false;
    }
</script>

{#if show}
    <div class="modal-backdrop" transition:fade={{ duration: 300 }}>
        <div class="modal-content" transition:fly={{ y: 50, duration: 400 }}>
            <div class="step-indicator">
                {#each Array(3) as _, i}
                    <div class="dot {step === i + 1 ? 'active' : ''}"></div>
                {/each}
            </div>

            <div class="card-container">
                {#key step}
                    <div class="card" in:fly={{ x: 20, duration: 300 }} out:fly={{ x: -20, duration: 300 }}>
                        <div class="visual">
                            <img src={cards[step - 1].image} alt={cards[step - 1].title} />
                        </div>
                        <h2>{cards[step - 1].title}</h2>
                        <p>{cards[step - 1].description}</p>
                    </div>
                {/key}
            </div>

            <div class="actions">
                <button class="btn-skip" on:click={skip}>{i18n.t('common.skip')}</button>
                <button class="btn-next" on:click={nextStep}>
                    {step === 3 ? i18n.t('common.start') : i18n.t('common.next')}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal-content {
        background: #000;
        border: 2px solid #00ff41;
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
        max-width: 500px;
        width: 100%;
        padding: 40px;
        position: relative;
        text-align: center;
        overflow: hidden;
    }

    .step-indicator {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .dot {
        width: 8px;
        height: 8px;
        border: 1px solid #00ff41;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .dot.active {
        background: #00ff41;
        box-shadow: 0 0 10px #00ff41;
        width: 20px;
        border-radius: 4px;
    }

    .card-container {
        min-height: 400px;
    }

    .visual {
        width: 100%;
        height: 250px;
        margin-bottom: 30px;
        border: 1px solid #111;
        background: #050505;
        overflow: hidden;
    }

    .visual img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
    }

    h2 {
        color: #00ff41;
        font-size: 1.5rem;
        font-family: 'Space Mono', monospace;
        margin-bottom: 15px;
        text-transform: uppercase;
    }

    p {
        color: #888;
        font-size: 1rem;
        line-height: 1.5;
        min-height: 3rem;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
    }

    .btn-skip {
        background: transparent;
        border: none;
        color: #444;
        font-family: 'Space Mono', monospace;
        font-size: 0.9rem;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    .btn-skip:hover {
        color: #888;
    }

    .btn-next {
        background: #00ff41;
        color: #000;
        border: none;
        padding: 12px 24px;
        font-family: 'Space Mono', monospace;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
        transition: all 0.3s ease;
    }

    .btn-next:hover {
        box-shadow: 0 0 25px #00ff41;
        transform: translateY(-2px);
    }

    @media (max-width: 600px) {
        .modal-content {
            padding: 20px;
        }
        .visual {
            height: 180px;
        }
        h2 {
            font-size: 1.2rem;
        }
    }
</style>
