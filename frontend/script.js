let filtroAtual = "todos";

const savedToken = localStorage.getItem("token");

if (savedToken) {
    state.token = savedToken;
    mostrarApp();
    carregarChamados();
}

async function carregarChamados() {

    try {

        const chamados =
            await apiGetChamados(state.token);

        let chamadosFiltrados =
            chamados;

        if (filtroAtual !== "todos") {

            chamadosFiltrados =
                chamados.filter(
                    c => c.status === filtroAtual
                );
        }

        renderizarDashboard(chamados);

        renderizarChamados(chamadosFiltrados);

    } catch (err) {

        mostrarMensagem(
            err.message,
            "erro"
        );
    }
}

async function criarChamado() {
    try {
        const titulo = document.getElementById("titulo").value;
        const descricao = document.getElementById("descricao").value;

        if (!titulo || !descricao) {
            mostrarMensagem("Preencha Todos os campos", "erro");
            return;
        }

        await apiCriarChamado( state.token, titulo, descricao);

        document.getElementById("titulo").value = "";
        document.getElementById("descricao").value = "";

        mostrarMensagem("Chamado criado!", "sucesso");

        carregarChamados();

    } catch (err) {
        mostrarMensagem(err.message, "erro");
    }
}

async function atualizar(id, status) {
    try {
        await apiAtualizarChamado (state.token, id, status)

        mostrarMensagem("Chamado atualizado!", "sucesso");

        carregarChamados();

    } catch (err) {
        mostrarMensagem(err.message, "erro");
    }
}

function alterarFiltro(status) {
    
    filtroAtual = status;

    carregarChamados();

}