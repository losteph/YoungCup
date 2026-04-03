document.addEventListener('DOMContentLoaded', () => {
    caricaTutto();
});

async function caricaTutto() {
    try {
        // Carichiamo ENTRAMBI i file JSON
        const [resSquadre, resGiocatori] = await Promise.all([
            fetch('dati/squadre.json'),
            fetch('dati/giocatori.json')
        ]);

        const squadre = await resSquadre.json();
        const listaGiocatoriInfo = await resGiocatori.json();

        const container = document.getElementById('elenco-squadre');
        container.innerHTML = '';

        squadre.forEach(s => {
            // Creiamo la rosa dei giocatori
            let giocatoriHtml = '<ul>' + s.rosa.map(g => {
                
                // Cerchiamo la figurina in giocatori.json
                const infoExtra = listaGiocatoriInfo.find(p => p.nome === g.nome);
                
                if (infoExtra) {
                    // Passiamo anche g.ruolo alla funzione
                    return `<li>
                        <span class="player-link" style="cursor:pointer;" onclick="apriFigurina('${infoExtra.nome}', '${infoExtra.numero}', '${infoExtra.foto}', '${s.logo}', '${s.nome}', '${infoExtra.soprannome}', '${g.ruolo}')">
                            ${g.nome}
                        </span> 
                        <em>(${g.ruolo})</em>
                    </li>`;
                } else {
                    return `<li>${g.nome} <em>(${g.ruolo})</em></li>`;
                }
            }).join('') + '</ul>';

            // Logica Dirigenza
            let dirigenzaHtml = "";
            if (s.vicepresidente && s.vicepresidente.trim() !== "") {
                dirigenzaHtml = `<div class="dirigenza-box"><span class="label-ruolo">Presidenti:</span> <span class="nome-ruolo">${s.presidente}, ${s.vicepresidente}</span></div>`;
            } else {
                dirigenzaHtml = `<div class="dirigenza-box"><span class="label-ruolo">Presidente:</span> <span class="nome-ruolo">${s.presidente}</span></div>`;
            }

            container.innerHTML += `
                <div class="squadra-card">
                    <div class="squadra-header-logo">
                        <img src="${s.logo}" class="logo-squadra-card">
                        <h3>${s.nome}</h3>
                    </div>
                    ${dirigenzaHtml}
                    <div class="rosa-header">Rosa Giocatori</div>
                    ${giocatoriHtml}
                </div>
            `;
        });
    } catch (error) {
        console.error("Errore nel caricamento dati:", error);
        document.getElementById('elenco-squadre').innerHTML = "Errore nel caricamento delle squadre. Controlla i file JSON.";
    }
} // <--- Questa chiusura mancava!

function apriFigurina(nome, numero, foto, logoSquadra, nomeSquadra, soprannome, ruolo) {
    const modal = document.getElementById('player-modal');
    const imgCont = document.getElementById('modal-img');
    const numCont = document.getElementById('modal-number');
    
    imgCont.src = (foto && foto !== "") ? foto : "assets/img/default.png";
    
    const coloriSquadre = {
        "Real MyDrip":      { fondo: "#ccff00", testo: "#000000" },
        "I Trogloditi":     { fondo: "#40e0d0", testo: "#ffffff" },
        "Sangu FC":         { fondo: "#000000", testo: "#ff0000" },
        "Marlboro Goal":    { fondo: "#ff0000", testo: "#000000" },
        "Wild Boys":        { fondo: "#ffffff", testo: "#d4af37" },
        "Imperial Seven":   { fondo: "#008000", testo: "#000000" }
    };

    const colori = coloriSquadre[nomeSquadra] || { fondo: "#333", testo: "#fff" };
    numCont.style.backgroundColor = colori.fondo;
    numCont.style.color = colori.testo;
    numCont.innerText = numero || "-";

    document.getElementById('modal-name').innerText = nome;
    document.getElementById('modal-logo').src = logoSquadra;
    document.getElementById('modal-team').innerText = nomeSquadra;
    
    // Inseriamo il Ruolo
    document.getElementById('modal-role').innerText = ruolo || "";

    const nick = document.getElementById('modal-nickname');
    if (soprannome && soprannome !== "undefined" && soprannome !== "") {
        nick.innerText = `"${soprannome}"`;
        nick.style.display = "block";
    } else {
        nick.style.display = "none";
    }

    modal.style.display = 'flex';
}
