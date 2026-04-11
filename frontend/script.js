let token = "";

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
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    token = data.token;

    console.log("Logado!");
    carregarChamados();
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