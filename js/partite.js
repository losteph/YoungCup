document.addEventListener('DOMContentLoaded', () => {
    caricaPartite();
});

async function caricaPartite() {
    try {
        // Carichiamo sia le partite che le squadre per avere i loghi
        const [partiteRes, squadreRes] = await Promise.all([
            fetch('dati/partite.json'),
            fetch('dati/squadre.json')
        ]);

        const partite = await partiteRes.json();
        const squadreData = await squadreRes.json();

        const container = document.getElementById('calendario-completo');
        container.innerHTML = '';

        let currentGiornata = 0;
        let giornataHtml = '';

        partite.forEach(partita => {
            if (partita.giornata !== currentGiornata) {
                if (currentGiornata !== 0) {
                    container.innerHTML += giornataHtml; 
                }
                currentGiornata = partita.giornata;
                giornataHtml = `<h3>Giornata ${currentGiornata}</h3>`;

                // Se è una partita di playoff, usa la descrizione invece del numero giornata
                let titolo = partita.fase === "playoff" ? "🏆 FASE FINALE" : `Giornata ${currentGiornata}`;
                giornataHtml = `<h3>${titolo}</h3>`;
            }

            // Se è un playoff, aggiungi la descrizione (es. "Semifinale 1") sotto il risultato
            let descPlayoff = partita.descrizione ? `<div class="playoff-label">${partita.descrizione}</div>` : "";

            // Recuperiamo i loghi delle due squadre
            const infoCasa = squadreData.find(s => s.nome === partita.squadraCasa);
            const infoOspite = squadreData.find(s => s.nome === partita.squadraOspite);
            
            const logoCasa = infoCasa ? infoCasa.logo : 'img/logo.jpeg';
            const logoOspite = infoOspite ? infoOspite.logo : 'img/logo.jpeg';

            const risultato = partita.status === 'giocata' 
                ? `${partita.golCasa} - ${partita.golOspite}` 
                : 'vs';

            let infoExtraShootout = "";
            if (partita.status === 'giocata' && partita.golCasa === partita.golOspite && partita.vincitoreShootout) {
                infoExtraShootout = `
                    <div class="shootout-info">
                        🏆 Shootout: ${partita.vincitoreShootout}
                    </div>
                `;
            }

            let dateTimeHtml = (partita.data && partita.ora) ? `
                <div class="match-datetime">
                    <span>${partita.data}</span>
                    <span>${partita.ora}</span>
                </div>
            ` : '';

            // HTML aggiornato con i loghi inseriti prima e dopo il risultato
            giornataHtml += `
                <div class="match">
                    <div class="match-info">
                        <div class="match-team team-casa">
                            <span>${partita.squadraCasa}</span>
                            <img src="${logoCasa}" class="mini-logo">
                        </div>
                        
                        <div class="match-risultato">
                            ${risultato}
                            ${infoExtraShootout}
                            ${descPlayoff}
                        </div>
                        
                        <div class="match-team team-ospite">
                            <img src="${logoOspite}" class="mini-logo">
                            <span>${partita.squadraOspite}</span>
                        </div>
                    </div>
                    ${dateTimeHtml}
                </div>
            `;
        });

        container.innerHTML += giornataHtml;

    } catch (error) {
        console.error("Errore:", error);
    }
}
