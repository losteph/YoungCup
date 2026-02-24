document.addEventListener('DOMContentLoaded', () => {
    caricaSquadre();
});

async function caricaSquadre() {
    const response = await fetch('dati/squadre.json');
    const squadre = await response.json();
    const container = document.getElementById('elenco-squadre');
    container.innerHTML = '';

    squadre.forEach(s => {
        let giocatori = '<ul>' + s.rosa.map(g => `<li>${g.nome} <em>(${g.ruolo})</em></li>`).join('') + '</ul>';
        container.innerHTML += `
            <div class="squadra-card">
                <div class="squadra-header-logo">
                    <img src="${s.logo}" class="logo-squadra-card">
                    <h3>${s.nome}</h3>
                </div>
                <div class="presidente-box">
                    <span class="label-presidente">Presidente:</span>
                    <span class="nome-presidente">${s.presidente}</span>
                </div>
                ${giocatori}
            </div>
        `;
    });
}
