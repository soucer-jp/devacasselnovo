document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONSERTO DE IMAGENS ---
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      img.style.color = 'inherit'; 
      if (img.getAttribute('data-nimg')) {
        img.removeAttribute('data-nimg');
      }
    });

   const form = document.getElementById('whatsapp-form');
    
    // Inicializa ícones Lucide (biblioteca de ícones)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    if (form) {
        const nameInput = document.getElementById('name');
        const modalidadeBtns = document.querySelectorAll('.modalidade-btn');
        const descDiv = document.getElementById('descricao-modalidade');
        let modalidadeSelecionada = "";

        modalidadeBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 1. Reseta todos para o estilo "Desativado" (Cinza/Vidro)
                modalidadeBtns.forEach(b => {
                    b.className = "modalidade-btn flex-1 px-4 py-4 rounded-2xl border-2 border-white/30 bg-white/40 text-gray-600 hover:border-brand-300 transition-all duration-200 flex flex-col items-center gap-2 group";
                    const icon = b.querySelector('svg');
                    if (icon) {
                        icon.classList.remove('text-brand-600');
                        icon.classList.add('text-brand-300');
                    }
                });
                
                // 2. Ativa o botão clicado com as cores do tema (Brand)
                this.className = "modalidade-btn flex-1 px-4 py-4 rounded-2xl border-2 border-brand-600 bg-brand-50 text-brand-700 shadow-sm transition-all duration-200 flex flex-col items-center gap-2";
                
                const activeIcon = this.querySelector('svg');
                if (activeIcon) {
                    activeIcon.classList.remove('text-brand-300');
                    activeIcon.classList.add('text-brand-600');
                }
                
                modalidadeSelecionada = this.getAttribute('data-value');
                
                // Feedback de texto
                descDiv.classList.remove('hidden');
               if (modalidadeSelecionada === "online") {
    // Texto Novo (com negrito no início e sem emojis)
    descDiv.innerHTML = '<span class="font-bold">Ótima escolha!</span> Atendimento via videochamada no conforto da sua casa.';
} else {
    // Texto Novo
    descDiv.innerHTML = '<span class="font-bold">Perfeito!</span> Atendimento acolhedor no consultório físico.';
}
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = nameInput.value.trim();
            let numero = form.getAttribute('data-whatsapp'); // Mudei de const para let para poder alterar

            // --- CORREÇÃO DE NÚMERO (Adiciona 55 se faltar) ---
            if (numero) {
                // 1. Remove tudo que não é número (traços, espaços, parênteses)
                numero = numero.replace(/\D/g, '');
                
                // 2. Se o número tiver entre 10 e 11 dígitos (DDD + Número), assume que é Brasil e põe 55
                if (numero.length >= 10 && numero.length <= 11) {
                    numero = '55' + numero;
                }
            }
            // ---------------------------------------------------

            // --- LÓGICA NOVA: DETECTA MODO FIXO (SUPER CARTÃO) ---

            // --- LÓGICA NOVA: DETECTA MODO FIXO (SUPER CARTÃO) ---
            // Se o site estiver em modo "Apenas Online", pegamos o valor automaticamente
            const inputModoFixo = document.getElementById('modo-fixo');
            if (inputModoFixo) {
                modalidadeSelecionada = inputModoFixo.value;
            }

            if (!nome) {
                alert("Por favor, digite seu nome.");
                nameInput.focus();
                return;
            }

            if (!modalidadeSelecionada) {
                alert("Por favor, selecione Online ou Presencial.");
                return;
            }

            // Verifica se o número foi configurado corretamente
            if (!numero || numero.includes("{{")) {
                alert("Por favor, configure o número do WhatsApp.");
                return;
            }

            const tipoAtendimento = modalidadeSelecionada === "online" ? "consultas *online*" : "consultas *presenciais*";
            
            const mensagem = `Olá! 👋\n\nMeu nome é *${nome}* e gostaria de agendar uma sessão de psicoterapia.\n\nTenho interesse em ${tipoAtendimento}.\n\nPoderia me informar sobre:\n• Valores das sessões\n• Disponibilidade de horários\n• Como funciona o processo\n\nFico no aguardo do seu retorno! 😊`;
            
            const linkWhatsapp = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
            
            window.open(linkWhatsapp, '_blank');
            
            // Opcional: Limpar formulário após envio
            // nameInput.value = "";
            // resetarBotoes(); // precisaria criar função separada para isso
        });
    }

    // --- 3. LÓGICA DO FAQ (Cálculo Exato de Altura) ---
    const sectionDuvidas = document.getElementById('duvidas');
    if (sectionDuvidas) {
        sectionDuvidas.addEventListener('click', function(e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            const wrapper = btn.nextElementSibling;
            if (!wrapper || !wrapper.classList.contains('faq-wrapper')) return;

            const iconeContainer = btn.querySelector('.flex-shrink-0');
            const iconeSvg = iconeContainer ? iconeContainer.querySelector('svg') : null;
            
            // Verifica se está aberto checando se tem altura definida e diferente de 0
            const estaAberto = wrapper.style.height && wrapper.style.height !== '0px';

            // 1. Fecha TODOS os outros (Reseta altura para 0px)
            const allWrappers = sectionDuvidas.querySelectorAll('.faq-wrapper');
            const allBtns = sectionDuvidas.querySelectorAll('button');
            
            allWrappers.forEach((w, index) => {
                if (w !== wrapper) {
                    w.style.height = '0px'; // Força fechamento
                    
                    const otherBtn = w.previousElementSibling; // O botão está logo antes
                    if (otherBtn) {
                        const iCont = otherBtn.querySelector('.flex-shrink-0');
                        const iSvg = otherBtn.querySelector('svg');
                        if (iCont) iCont.classList.remove('rotate-45', 'bg-brand-200');
                        if (iSvg) iSvg.classList.remove('text-brand-700');
                    }
                }
            });

            // 2. Toggle do atual (Calcula ScrollHeight ou Zera)
            if (!estaAberto) {
                // Pega a altura real do conteúdo interno (scrollHeight)
                // O faq-inner é o primeiro filho, medimos ele para garantir precisão
                const height = wrapper.scrollHeight; 
                wrapper.style.height = height + "px";
                
                if (iconeContainer) iconeContainer.classList.add('rotate-45', 'bg-brand-200');
                if (iconeSvg) iconeSvg.classList.add('text-brand-700');
            } else {
                wrapper.style.height = '0px';
                
                if (iconeContainer) iconeContainer.classList.remove('rotate-45', 'bg-brand-200');
                if (iconeSvg) iconeSvg.classList.remove('text-brand-700');
            }
        });
    
    
    }

    // --- 4. MENU MOBILE ---
    const menuBtn = document.querySelector('header button[aria-label="Menu"]');
    const headerContainer = document.querySelector('header .container');
    
    if (menuBtn && headerContainer) {
        const mobileMenuDiv = document.createElement('div');
        // Adicionei 'absolute top-full left-0 w-full shadow-xl'
        mobileMenuDiv.className = "absolute top-full left-0 w-full lg:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur shadow-xl hidden";
        mobileMenuDiv.innerHTML = `
            <nav class="py-4 space-y-1">
                <a href="#inicio" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Início</a>
                <a href="#sobre" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Sobre mim</a>
                <a href="#servicos" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Serviços</a>
                <a href="#duvidas" class="block px-4 py-3 text-neutral-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium">Dúvidas</a>
                <a href="#contato" class="flex items-center gap-2 mx-4 mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors justify-center">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    Agendar Consulta
                </a>
            </nav>
        `;
        headerContainer.appendChild(mobileMenuDiv);

        menuBtn.addEventListener('click', function() {
            const isHidden = mobileMenuDiv.classList.contains('hidden');
            const icon = this.querySelector('svg');
            if (isHidden) {
                mobileMenuDiv.classList.remove('hidden');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                mobileMenuDiv.classList.add('hidden');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        mobileMenuDiv.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuDiv.classList.add('hidden');
                const icon = menuBtn.querySelector('svg');
                if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }

     

});