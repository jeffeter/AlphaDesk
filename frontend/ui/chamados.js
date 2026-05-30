function criarCardChamado(c) {

    return `

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
}
function renderizarChamados(chamados) {

    const lista =
        document.getElementById("lista");

    lista.innerHTML = "";

    chamados.forEach(c => {

        const item =
            document.createElement("li");

        item.innerHTML =
            criarCardChamado(c);

        lista.appendChild(item);
    });
}