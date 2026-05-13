// script.js
document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'eldenRingBossTracker';

    // Carrega dados salvos do localStorage
    let bossStatus = {};
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            bossStatus = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Erro ao carregar dados salvos, resetando...');
        bossStatus = {};
    }

    // Elementos da UI
    const checkboxes = document.querySelectorAll('.boss-checkbox');
    const counterEl = document.getElementById('boss-counter');
    const progressBarEl = document.getElementById('progress-bar');
    const progressTextEl = document.getElementById('progress-text');
    const resetBtn = document.getElementById('reset-btn');
    const categoryCountEls = document.querySelectorAll('.category-count');

    /**
     * Converte texto em slug para usar como chave única
     */
    function slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // remove acentos
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Atualiza toda a interface: contador, barra de progresso e contadores por categoria
     */
    function updateUI() {
        const total = checkboxes.length;
        const defeated = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = total > 0 ? Math.round((defeated / total) * 100) : 0;

        // Contador principal
        counterEl.textContent = `${defeated} / ${total}`;

        // Barra de progresso
        progressBarEl.style.width = `${percentage}%`;
        progressTextEl.textContent = `${percentage}%`;

        // Efeito especial nos 100%
        if (percentage === 100 && defeated > 0) {
            progressBarEl.style.background =
                'linear-gradient(90deg, #c9a45c, #f0d78c, #ffe8a0, #f0d78c, #c9a45c)';
            progressBarEl.style.animation = 'shimmer 2s infinite';
        } else {
            progressBarEl.style.background =
                'linear-gradient(90deg, #8b6914, #c9a45c)';
            progressBarEl.style.animation = '';
        }

        // Atualiza contadores por categoria
        document.querySelectorAll('.boss-category').forEach(category => {
            const categoryCheckboxes = category.querySelectorAll('.boss-checkbox');
            const catTotal = categoryCheckboxes.length;
            const catDefeated = Array.from(categoryCheckboxes).filter(cb => cb.checked).length;
            const countEl = category.querySelector('.category-count');
            if (countEl) {
                countEl.textContent = `${catDefeated}/${catTotal}`;
            }
        });
    }

    /**
     * Salva o estado atual no localStorage
     */
    function saveStatus() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bossStatus));
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
    }

    /**
     * Inicializa os checkboxes e seus event listeners
     */
    checkboxes.forEach(checkbox => {
        const bossItem = checkbox.closest('.boss-item');
        const bossNameEl = bossItem.querySelector('.boss-name');
        const bossName = bossNameEl.textContent.trim();
        const bossId = slugify(bossName);

        // Restaura estado salvo
        if (bossStatus[bossId] === true) {
            checkbox.checked = true;
        }

        // Event listener para mudanças
        checkbox.addEventListener('change', () => {
            bossStatus[bossId] = checkbox.checked;
            saveStatus();
            updateUI();

            // Animação visual ao derrotar um boss
            if (checkbox.checked && bossItem) {
                bossItem.classList.add('just-defeated');
                setTimeout(() => {
                    bossItem.classList.remove('just-defeated');
                }, 700);
            }
        });
    });

    /**
     * Botão de reset com confirmação
     */
    resetBtn.addEventListener('click', () => {
        const confirmReset = confirm(
            '⚠️ Tem certeza que deseja resetar TODO o progresso?\n\n' +
            'Esta ação não pode ser desfeita. Todos os bosses voltarão ao estado "não derrotado".'
        );

        if (confirmReset) {
            bossStatus = {};
            localStorage.removeItem(STORAGE_KEY);
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
            updateUI();

            // Pequeno feedback visual no botão
            resetBtn.textContent = 'Progresso Resetado!';
            resetBtn.style.color = '#c9a45c';
            resetBtn.style.borderColor = '#c9a45c';
            setTimeout(() => {
                resetBtn.textContent = 'Resetar Progresso';
                resetBtn.style.color = '';
                resetBtn.style.borderColor = '';
            }, 2000);
        }
    });

    // Inicializa a UI com os dados carregados
    updateUI();

    // Impede que cliques nos links da wiki/mapgenie ativem o checkbox
    document.querySelectorAll('.boss-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    });

    console.log('🗡️ Elden Ring Boss Tracker carregado!');
    console.log(`   ${Object.values(bossStatus).filter(v => v).length} boss(es) derrotado(s) até agora.`);
    console.log('   Dados salvos em localStorage com a chave:', STORAGE_KEY);
});