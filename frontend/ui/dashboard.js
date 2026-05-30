let grafico;

function renderizarDashboard(chamados) {

    document.getElementById("totalChamados")
        .innerText = chamados.length;

    document.getElementById("andamentoChamados")
        .innerText =
            chamados.filter(
                c => c.status === "em andamento"
            ).length;

    document.getElementById("resolvidosChamados")
        .innerText =
            chamados.filter(
                c => c.status === "resolvido"
            ).length;

    renderizarGrafico(chamados);
}

function renderizarGrafico(chamados) {

    const abertos =
        chamados.filter(
            c => c.status === "aberto"
        ).length;

    const andamento =
        chamados.filter(
            c => c.status === "em andamento"
        ).length;

    const resolvidos =
        chamados.filter(
            c => c.status === "resolvido"
        ).length;

    if (grafico) {
        grafico.destroy();
    }

    const ctx =
        document.getElementById("graficoChamados")
        .getContext("2d");

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
}