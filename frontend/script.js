const API_URL = "https://alphadesk-backend-6zsz.onrender.com";

let token = "";
let filtroAtual = "todos";
let grafico;

const savedToken = localStorage.getItem("token");

if (savedToken) {
    token = savedToken;
    mostrarApp();
    carregarChamados();
}

async function registrar() {
    try {
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const mensagem = await res.text();

        if (!res.ok) {
            throw new Error(mensagem);
        }

        mostrarMensagem("Usuário registrado com sucesso!", "sucesso");

    } catch (err) {
        mostrarMensagem(err.message, "erro");
        }
}

async function login() {
    mostrarLoading();

    try {
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        const data = await res.json();

        token = data.token;

        localStorage.setItem("token", token);

        mostrarMensagem("Login realizado!", "sucesso");

        mostrarApp();

        carregarChamados();

    } catch (err) {
        mostrarMensagem(err.message, "erro");
    } finally {
        esconderLoading();
    }
}

async function carregarChamados() {
    try {
        const res = await fetch(`${API_URL}/chamados`, {
            headers: {
                "Authorization": token
            }
        });

        if (!res.ok) {
            throw new Error("Erro ao carregar chamados");
        }

        const chamados = await res.json();

        let chamadosFiltrados = chamados

        if (filtroAtual !== "todos") {
            chamadosFiltrados = chamados.filter(c => c.status === filtroAtual);
        }

        document.getElementById("totalChamados").innerText =
            chamados.length;

        document.getElementById("andamentoChamados").innerText =
            chamados.filter(c => c.status === "em andamento").length

        document.getElementById("resolvidosChamados").innerText =
            chamados.filter(c => c.status === "resolvido").length;

        const abertos = 
            chamados.filter(c => c.status ==='aberto').length;
        const andamento = 
            chamados.filter(c => c.status ==='em andamento').length;
        const resolvidos =
            chamados.filter(c => c.status ==='resolvido').length;
        
        if (grafico) {
            grafico.destroy();
        }

        const ctx =
            document.getElementById("graficoChamados").getContext("2d");

        grafico = new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Abertos",
                    "Em andamento",
                    "Resolvidos"
                ],

                datasets: [{

                    data: [
                        abertos,
                        andamento,
                        resolvidos
                    ],

                    backgroundColor: [
                        "#3b82f6",
                        "#f59e0b",
                        "#22c55e"
                    ],

                    borderWidth: 0
                }]
            },

            options: {

                plugins: {

                    legend: {
                        labels: {
                            color: "white"
                        }
                    }
                }
            }
        });
        
        const lista = document.getElementById("lista");

        lista.innerHTML = "";

        chamadosFiltrados.forEach(c => {
            const item = document.createElement("li");

            item.innerHTML = `
                <div class="chamado-header">
                    <strong>${c.titulo}</strong>
                    <span class="
                        status-badge
                        ${c.status === "resolvido" ? "status-resolvido" : ""}
                        ${c.status === "em andamento" ? "status-andamento" : ""}
                        ${c.status === "aberto" ? "status-aberto" : ""}
                    ">
                        ${c.status}
                    </span>
                </div>

                <p class="descricao">
                    ${c.descricao}
                </p>

                <div class="acoes">

                    <button onclick="atualizar(${c.id}, 'em andamento')">
                        Em andamento
                    </button>

                    <button onclick="atualizar(${c.id}, 'resolvido')">
                        Resolver
                    </button>

                </div>

            `;

            lista.appendChild(item);
        });

    } catch (err) {
        mostrarMensagem(err.message, "erro");
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

        await fetch(`${API_URL}/chamados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ titulo, descricao })
        });

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
        await fetch(`${API_URL}/chamados/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ status })
        });

        mostrarMensagem("Chamado atualizado!", "sucesso");

        carregarChamados();

    } catch (err) {
        mostrarMensagem(err.message, "erro");
    }
}

function mostrarMensagem(texto, tipo) {
    const el = document.getElementById("mensagem");

    el.innerText = texto;
    el.className = tipo;

    el.style.display = "block";

    setTimeout(() => {
        el.style.display = "none";
    }, 3000);
}

function mostrarLoading() {
    document.getElementById("loading").style.display = "block";
}

function esconderLoading() {
    document.getElementById("loading").style.display = "none";
}

function mostrarApp() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
}

function logout() {
    token = "";

    localStorage.removeItem("token");

    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";

    mostrarMensagem("Saiu da conta", "sucesso");
}

function alterarFiltro(status) {
    
    filtroAtual = status;

    carregarChamados();
}