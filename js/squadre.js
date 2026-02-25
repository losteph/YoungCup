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
    
    // LOGICA CONDIZIONALE:
    let dirigenzaHtml = "";
    if (s.vicepresidente && s.vicepresidente.trim() !== "") {
        // Se c'è il vice, usiamo il plurale e la virgola
        dirigenzaHtml = `
            <div class="dirigenza-box">
                <span class="label-ruolo">Presidenti:</span>
                <span class="nome-ruolo">${s.presidente}, ${s.vicepresidente}</span>
            </div>`;
    } else {
        // Se non c'è, mostriamo solo il presidente come prima
        dirigenzaHtml = `
            <div class="dirigenza-box">
                <span class="label-ruolo">Presidente:</span>
                <span class="nome-ruolo">${s.presidente}</span>
            </div>`;
    }

    container.innerHTML += `
        <div class="squadra-card">
            <div class="squadra-header-logo">
                <img src="${s.logo}" class="logo-squadra-card">
                <h3>${s.nome}</h3>
            </div>
            
            ${dirigenzaHtml}
            
            <div class="rosa-header">Rosa Giocatori</div>
            ${giocatori}
        </div>
    `;
});
}
