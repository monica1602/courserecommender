/**
 * EduMatch - Sistema de Recomendação de Cursos
 * Frontend JavaScript para interação com a API Flask
 */

document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
    const form = document.getElementById("filter-form");
    const btnLimpar = document.getElementById("btn-limpar");
    const loadingEl = document.getElementById("loading");
    const resultsSection = document.getElementById("results-section");
    const resultsContainer = document.getElementById("results-container");
    const resultsCount = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");

    // Selects para popular com dados da API
    const selectNivel = document.getElementById("nivel");
    const selectArea = document.getElementById("area");
    const selectHorario = document.getElementById("horario");
    const selectModalidade = document.getElementById("modalidade");
    const selectCidade = document.getElementById("cidade");

    // Inicializar filtros ao carregar a página
    carregarFiltros();

    // Event Listeners
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        buscarCursos();
    });

    btnLimpar.addEventListener("click", () => {
        form.reset();
        resultsSection.classList.add("hidden");
        emptyState.classList.add("hidden");
    });

    /**
     * Carrega as opções de filtros da API
     */
    async function carregarFiltros() {
        try {
            const response = await fetch("/api/filtros");
            const data = await response.json();

            popularSelect(selectNivel, data.niveis);
            popularSelect(selectArea, data.areas);
            popularSelect(selectHorario, data.horarios);
            popularSelect(selectModalidade, data.modalidades);
            popularSelect(selectCidade, data.cidades);
        } catch (error) {
            console.error("Erro ao carregar filtros:", error);
        }
    }

    /**
     * Popula um elemento select com opções
     */
    function popularSelect(selectElement, opcoes) {
        opcoes.forEach((opcao) => {
            const option = document.createElement("option");
            option.value = opcao;
            option.textContent = opcao;
            selectElement.appendChild(option);
        });
    }

    /**
     * Busca cursos com base nos filtros selecionados
     */
    async function buscarCursos() {
        // Mostrar loading
        loadingEl.classList.remove("hidden");
        resultsSection.classList.add("hidden");
        emptyState.classList.add("hidden");

        // Coletar dados do formulário
        const dados = {
            nivel: selectNivel.value,
            area: selectArea.value,
            assuntos: document.getElementById("assuntos").value,
            duracao_max: document.getElementById("duracao_max").value,
            horario: selectHorario.value,
            modalidade: selectModalidade.value,
            preco_max: document.getElementById("preco_max").value,
            cidade: selectCidade.value,
        };

        try {
            const response = await fetch("/api/recomendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await response.json();

            // Esconder loading
            loadingEl.classList.add("hidden");

            if (resultado.erro) {
                console.error("Erro da API:", resultado.erro);
                emptyState.classList.remove("hidden");
                return;
            }

            if (resultado.cursos && resultado.cursos.length > 0) {
                exibirResultados(resultado);
                // Scroll suave até os resultados
                resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                emptyState.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
            loadingEl.classList.add("hidden");
            emptyState.classList.remove("hidden");
        }
    }

    /**
     * Exibe os resultados na tela
     */
    function exibirResultados(resultado) {
        resultsContainer.innerHTML = "";
        resultsCount.textContent = `${resultado.total} curso${resultado.total !== 1 ? "s" : ""} encontrado${resultado.total !== 1 ? "s" : ""}`;

        resultado.cursos.forEach((curso) => {
            const card = criarCardCurso(curso);
            resultsContainer.appendChild(card);
        });

        resultsSection.classList.remove("hidden");
    }

    /**
     * Cria o card HTML de um curso
     */
    function criarCardCurso(curso) {
        const card = document.createElement("article");
        card.className = "course-card";

        // Formatar preço
        let precoFormatado = "0,00";
        try {
            precoFormatado = Number(curso.preco_mensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
        } catch (e) {
            precoFormatado = String(curso.preco_mensal);
        }

        const precoHTML =
            curso.preco_mensal === 0
                ? `<span class="price-free">Gratuito (bolsa)</span>`
                : `<div>
                    <span class="price-value">R$ ${precoFormatado}</span>
                    <span class="price-label">/mês</span>
                   </div>`;

        // Formatar duração
        const duracaoTexto = formatarDuracao(curso.duracao_meses);

        // Criar tags de assuntos
        const assuntos = Array.isArray(curso.assuntos) ? curso.assuntos : [];
        const tagsHTML = assuntos
            .map((a) => `<span class="tag">${a}</span>`)
            .join("");

        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${curso.nome}</h3>
                <span class="card-score" title="Pontuação de relevância">⭐ ${curso.pontuacao}</span>
            </div>

            <div class="card-badges">
                <span class="badge badge-nivel">${curso.nivel}</span>
                <span class="badge badge-area">${curso.area}</span>
                <span class="badge badge-modalidade">${curso.modalidade}</span>
                <span class="badge badge-nota">MEC: ${curso.nota_mec}</span>
            </div>

            <p class="card-description">${curso.descricao}</p>

            <div class="card-details">
                <div class="detail-item">
                    <span class="detail-icon">🏛️</span>
                    <span>${curso.instituicao}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>${curso.cidade}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">⏱️</span>
                    <span>${duracaoTexto}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🕐</span>
                    <span>${curso.horario}</span>
                </div>
            </div>

            <div class="card-tags">
                ${tagsHTML}
            </div>

            <div class="card-price">
                ${precoHTML}
            </div>
        `;

        return card;
    }

    /**
     * Formata duração em meses para texto legível
     */
    function formatarDuracao(meses) {
        if (meses < 12) {
            return `${meses} meses`;
        }
        const anos = Math.floor(meses / 12);
        const mesesRestantes = meses % 12;

        if (mesesRestantes === 0) {
            return `${anos} ano${anos > 1 ? "s" : ""}`;
        }
        return `${anos} ano${anos > 1 ? "s" : ""} e ${mesesRestantes} meses`;
    }
});
