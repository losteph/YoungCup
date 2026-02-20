document.addEventListener('DOMContentLoaded', () => {
    caricaPartite();
});

async function caricaPartite() {
    try {
        const response = await fetch('dati/partite.json');
        
        // Controllo se la risposta è valida
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        
        const partite = await response.json();
        const container = document.getElementById('calendario-completo');
        
        if (!container) return; // Sicurezza se l'ID non esiste nell'HTML
        container.innerHTML = '';

        let currentGiornata = 0;
        let giornataHtml = '';

        partite.forEach(partita => {
            // Se entriamo in una nuova giornata, chiudiamo il blocco precedente e ne apriamo uno nuovo
            if (partita.giornata !== currentGiornata) {
                if (currentGiornata !== 0) {
                    container.innerHTML += giornataHtml; 
                }
                currentGiornata = partita.giornata;
                giornataHtml = `<h3>Giornata ${currentGiornata}</h3>`;
            }

            // Gestione del risultato principale
            const risultato = partita.status === 'giocata' 
                ? `${partita.golCasa} - ${partita.golOspite}` 
                : 'vs';

            // LOGICA SHOOTOUT: Se è un pareggio giocato, mostriamo il vincitore extra
            let infoExtraShootout = "";
            if (partita.status === 'giocata' && 
                partita.golCasa === partita.golOspite && 
                partita.vincitoreShootout) {
                
                infoExtraShootout = `
                    <div style="font-size: 0.75em; color: #e67e22; font-weight: normal; margin-top: 5px;">
                        🏆 Shootout: <strong>${partita.vincitoreShootout}</strong>
                    </div>
                `;
            }

            // Blocco per data e ora
            let dateTimeHtml = '';
            if (partita.data && partita.ora) {
                dateTimeHtml = `
                    <div class="match-datetime">
                        <span>${partita.data}</span>
                        <span>${partita.ora}</span>
                    </div>
                `;
            }

            // Costruzione dell'HTML della singola partita
            giornataHtml += `
                <div class="match">
                    <div class="match-info">
                        <span class="match-squadra" style="text-align: right;">${partita.squadraCasa}</span>
                        <div class="match-risultato">
                            ${risultato}
                            ${infoExtraShootout}
                        </div>
                        <span class="match-squadra" style="text-align: left;">${partita.squadraOspite}</span>
                    </div>
                    ${dateTimeHtml}
                </div>
            `;
        });

        // Aggiunge l'ultimo blocco di giornate al container
        container.innerHTML += giornataHtml;

    } catch (error) {
        console.error("Errore nel caricamento delle partite:", error);
        const container = document.getElementById('calendario-completo');
        if (container) {
            container.innerHTML = `<p style="color:red;">Si è verificato un errore nel caricamento del calendario. Controlla il file dati/partite.json</p>`;
        }
    }
}
