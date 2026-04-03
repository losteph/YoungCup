document.addEventListener('DOMContentLoaded', () => {
    caricaTutto();
});

async function caricaTutto() {
    // Carichiamo ENTRAMBI i file JSON insieme
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
            
            // COLLEGAMENTO: Cerchiamo se questo giocatore ha una figurina nel file giocatori.json
            const infoExtra = listaGiocatoriInfo.find(p => p.nome === g.nome);
            
            // Se troviamo info extra (foto, numero, etc.), creiamo il link alla figurina
            // Altrimenti, lasciamo il nome semplice
            if (infoExtra) {
                return `<li>
                    <span class="player-link" style="cursor:pointer; color:#d21f1f; font-weight:bold; text-decoration:underline;" 
                        onclick="apriFigurina('${infoExtra.nome}', '${infoExtra.numero}', '${infoExtra.foto}', '${s.logo}', '${s.nome}', '${infoExtra.soprannome}')">
                        ${g.nome}
                    </span> 
                    <em>(${g.ruolo})</em>
                </li>`;
            } else {
                return `<li>${g.nome} <em>(${g.ruolo})</em></li>`;
            }
        }).join('') + '</ul>';

        // Logica Dirigenza (Presidenti)
        let dirigenzaHtml = "";
        if (s.vicepresidente && s.vicepresidente.trim() !== "") {
            dirigenzaHtml = `<div class="dirigenza-box"><span class="label-ruolo">Presidenti:</span> <span class="nome-ruolo">${s.presidente}, ${s.vicepresidente}</span></div>`;
        } else {
            dirigenzaHtml = `<div class="dirigenza-box"><span class="label-ruolo">Presidente:</span> <span class="nome-ruolo">${s.presidente}</span></div>`;
        }

        // Aggiungiamo la card della squadra al sito
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
}

// Funzione che riempie e mostra il Pop-up della Figurina
function apriFigurina(nome, numero, foto, logoSquadra, nomeSquadra, soprannome) {
    const fotoFinale = (foto && foto !== "") ? foto : "assets/img/default.png";
    
    document.getElementById('modal-img').src = fotoFinale;
    document.getElementById('modal-name').innerText = nome;
    document.getElementById('modal-number').innerText = numero || "-";
    document.getElementById('modal-logo').src = logoSquadra;
    document.getElementById('modal-team').innerText = nomeSquadra;

    const nickElement = document.getElementById('modal-nickname');
    if (soprannome && soprannome !== "undefined" && soprannome !== "") {
        nickElement.innerText = `"${soprannome}"`;
        nickElement.style.display = "block";
    } else {
        nickElement.style.display = "none";
    }

    document.getElementById('player-modal').style.display = 'flex';
}
