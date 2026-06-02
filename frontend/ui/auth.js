function mostrarApp() {

    document.getElementById("auth")
        .style.display = "none";

    document.getElementById("app")
        .style.display = "flex";
}


function logout() {

    window.token = "";

    localStorage.removeItem("token");

    document.getElementById("auth")
        .style.display = "none";

    document.getElementById("app")
        .style.display = "none";

    mostrarMensagem(
        "Saiu da conta",
        "sucesso"
    );
}

async function login() {

    mostrarLoading();

    try {

        const email =
            document.getElementById("email").value;

        const senha =
            document.getElementById("senha").value;


        const data =
            await apiLogin(email, senha);

        state.token = data.token;

        localStorage.setItem(
            "token",
            state.token
        );

        mostrarMensagem(
            "Login realizado!",
            "sucesso"
        );

        mostrarApp();

        carregarChamados();

    } catch (err) {

        mostrarMensagem(
            err.message,
            "erro"
        );

    } finally {

        esconderLoading();
    }
}

async function registrar() {

    try {

        const email =
            document.getElementById("email").value;

        const senha =
            document.getElementById("senha").value;

        await apiRegister(
            email,
            senha
        );

        mostrarMensagem(
            "Usuário registrado com sucesso!",
            "sucesso"
        );

    } catch (err) {

        mostrarMensagem(
            err.message,
            "erro"
        );
    }
}