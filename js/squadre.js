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
                // 1. Cerchiamo il giocatore nel file figurine
                const infoExtra = listaGiocatoriInfo.find(p => p.nome.trim() === g.nome.trim());
    
                if (infoExtra) {
                // --- TRUCCO ANTI-APOSTROFO ---
                // Questa funzione mette una \ davanti all'apostrofo così il JS non crasha
                    const pulisci = (testo) => (testo || "").toString().replace(/'/g, "\\'");

                    const n = pulisci(infoExtra.nome);
                    const sN = pulisci(infoExtra.soprannome);
                    const r = pulisci(g.ruolo);
                    const t = pulisci(s.nome);
                    const f = infoExtra.foto || ""; // La foto non ha apostrofi solitamente
                    const num = infoExtra.numero || "";

                return `<li>
                    <span class="player-link" onclick="apriFigurina('${n}', '${num}', '${f}', '${s.logo}', '${t}', '${sN}', '${r}')">
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
} 

function apriFigurina(nome, numero, foto, logoSquadra, nomeSquadra, soprannome, ruolo) {
    const modal = document.getElementById('player-modal');
    const numCont = document.getElementById('modal-number');
    
    // --- FORZA BRUTA JS: Blocchiamo la striscia qui ---
    numCont.style.all = "unset"; // Reset totale
    numCont.style.position = "absolute";
    numCont.style.top = "5px";
    numCont.style.right = "5px";
    numCont.style.width = "60px";
    numCont.style.height = "60px";
    numCont.style.display = "flex";
    numCont.style.justifyContent = "center";
    numCont.style.alignItems = "center";
    numCont.style.zIndex = "100";
    numCont.style.fontWeight = "900";
    numCont.style.fontSize = "1.4rem";
    numCont.style.fontFamily = "sans-serif";
    // Applichiamo la sagoma maglietta via JS
    numCont.style.clipPath = "polygon(25% 0%, 75% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%)";
    numCont.style.webkitClipPath = "polygon(25% 0%, 75% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%)";

    // --- COLORI SQUADRE ---
    const coloriSquadre = {
        "Real MyDrip":      { fondo: "#ccff00", testo: "#000" },
        "I Trogloditi":     { fondo: "#40e0d0", testo: "#fff" },
        "Sangu FC":         { fondo: "#000", testo: "#f00" },
        "Marlboro Goal":    { fondo: "#f00", testo: "#000" },
        "Wild Boys":        { fondo: "#fff", testo: "#d4af37" },
        "Imperial Seven":   { fondo: "#008000", testo: "#000" }
    };

    const colori = coloriSquadre[nomeSquadra] || { fondo: "#333", testo: "#fff" };
    numCont.style.backgroundColor = colori.fondo;
    numCont.style.color = colori.testo;
    numCont.innerText = numero || "-";

    // --- RIEMPIMENTO ALTRI DATI ---
    document.getElementById('modal-img').src = (foto && foto !== "") ? foto : "assets/img/default.png";
    document.getElementById('modal-name').innerText = nome;
    document.getElementById('modal-logo').src = logoSquadra;
    document.getElementById('modal-team').innerText = nomeSquadra;
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
