const API_URL = "https://alphadesk-backend-6zsz.onrender.com";

let token = "";

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

        if (!Array.isArray(chamados)) {
            console.error(chamados);
            return;
        }

        const lista = document.getElementById("lista");

        lista.innerHTML = "";

        chamados.forEach(c => {
            const item = document.createElement("li");

            item.innerHTML = `
                <strong>${c.titulo}</strong> - ${c.status} <br>
                ${c.descricao}<br><br>

                <button onclick="atualizar(${c.id}, 'em andamento')">
                    Em andamento
                </button>

                <button onclick="atualizar(${c.id}, 'resolvido')">
                    Resolver
                </button>
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