function mostrarMensagem(texto, tipo) {

    const el =
        document.getElementById("mensagem");

    el.innerText = texto;

    el.className = tipo;

    el.style.display = "block";

    setTimeout(() => {

        el.style.display = "none";

    }, 3000);
}


function mostrarLoading() {

    document.getElementById("loading")
        .style.display = "block";
}


function esconderLoading() {

    document.getElementById("loading")
        .style.display = "none";
}