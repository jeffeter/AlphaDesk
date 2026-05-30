const API_URL =
    "https://alphadesk-backend-6zsz.onrender.com";


async function apiLogin(email, senha) {

    const res = await fetch(`${API_URL}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            senha
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

async function apiRegister(email, senha) {

    const res = await fetch(`${API_URL}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            senha
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.text();
}

async function apiGetChamados(token) {

    const res = await fetch(`${API_URL}/chamados`, {

        headers: {
            "Authorization": token
        }
    });

    if (!res.ok) {
        throw new Error("Erro ao carregar chamados");
    }

    return await res.json();
}

async function apiCriarChamado(token, titulo, descricao) {

    const res = await fetch(`${API_URL}/chamados`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },

        body: JSON.stringify({
            titulo,
            descricao
        })
    });

    if (!res.ok) {
        throw new Error("Erro ao criar chamado");
    }

    return await res.json();
}

async function apiAtualizarChamado(token, id, status) {

    const res = await fetch(`${API_URL}/chamados/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },

        body: JSON.stringify({
            status
        })
    });

    if (!res.ok) {
        throw new Error("Erro ao atualizar chamado");
    }

    return await res.json();
}
