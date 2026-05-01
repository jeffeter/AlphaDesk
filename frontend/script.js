let token = "";

const savedToken = localStorage.getItem("token");

if (savedToken) {
    token = savedToken;
    mostrarApp();
    carregarChamados();
}

async function registrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, senha })
    });

    console.log(await res.text());
}

async function login() {
    mostrarLoading();

    try {
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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
    const res = await fetch("http://localhost:3000/chamados", {
        headers: {
        "Authorization": token
        }
    });

    const chamados = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    chamados.forEach(c => {
        const item = document.createElement("li");
        item.innerHTML = `
        <strong>${c.titulo}</strong> - ${c.status} <br>
        ${c.descricao}<br>
        <button onclick="atualizar(${c.id}, 'em andamento')">Em andamento</button>
        <button onclick="atualizar(${c.id}, 'resolvido')">Resolver</button>
        `;
        lista.appendChild(item);
    });
}

async function criarChamado() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    await fetch("http://localhost:3000/chamados", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": token
        },
        body: JSON.stringify({ titulo, descricao })
    });

    carregarChamados();
}

async function atualizar(id, status) {
      await fetch(`http://localhost:3000/chamados/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "Authorization": token
        },
        body: JSON.stringify({ status })
    });

    carregarChamados();
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