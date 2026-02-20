document.addEventListener('DOMContentLoaded', () => {
    caricaClassificaAutomatica();
});

async function caricaClassificaAutomatica() {
    try {
        const [squadreRes, partiteRes] = await Promise.all([
            fetch('dati/squadre.json'),
            fetch('dati/partite.json')
        ]);
        const squadreData = await squadreRes.json();
        const partite = await partiteRes.json();

        let classifica = {};
        squadreData.forEach(squadra => {
            classifica[squadra.nome] = {
                punti: 0, giocate: 0, vittorie: 0, pareggi: 0, sconfitte: 0,
                gf: 0, gs: 0, dr: 0
            };
        });

        partite.forEach(partita => {
    if (partita.status === 'giocata') {
        const casa = partita.squadraCasa;
        const ospite = partita.squadraOspite;
        const golCasa = partita.golCasa;
        const golOspite = partita.golOspite;

        classifica[casa].giocate++;
        classifica[ospite].giocate++;
        classifica[casa].gf += golCasa;
        classifica[casa].gs += golOspite;
        classifica[ospite].gf += golOspite;
        classifica[ospite].gs += golCasa;

        if (golCasa > golOspite) {
            // Vittoria netta
            classifica[casa].vittorie++;
            classifica[casa].punti += 3;
            classifica[ospite].sconfitte++;
        } else if (golOspite > golCasa) {
            // Vittoria netta
            classifica[ospite].vittorie++;
            classifica[ospite].punti += 3;
            classifica[casa].sconfitte++;
        } else {
            // PAREGGIO (1 punto a testa di base)
            classifica[casa].pareggi++;
            classifica[ospite].pareggi++;
            classifica[casa].punti += 1;
            classifica[ospite].punti += 1;

            // Bonus Shootout (+1 extra a chi vince, totale 2)
            if (partita.vincitoreShootout === casa) {
                classifica[casa].punti += 1; 
            } else if (partita.vincitoreShootout === ospite) {
                classifica[ospite].punti += 1;
            }
        }
    }
});

        const classificaArray = Object.keys(classifica).map(nomeSquadra => {
            const stats = classifica[nomeSquadra];
            stats.dr = stats.gf - stats.gs;
            stats.squadra = nomeSquadra;
            return stats;
        });

        classificaArray.sort((a, b) => {
            if (a.punti !== b.punti) return b.punti - a.punti;
            if (a.dr !== b.dr) return b.dr - a.dr;
            return b.gf - a.gf;
        });

        const tbody = document.getElementById('corpo-classifica');
        tbody.innerHTML = ''; 

        classificaArray.forEach((squadra, index) => {
            const riga = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${squadra.squadra}</td>
                    <td><strong>${squadra.punti}</strong></td>
                    <td>${squadra.giocate}</td>
                    <td>${squadra.vittorie}</td>
                    <td>${squadra.pareggi}</td>
                    <td>${squadra.sconfitte}</td>
                    <td>${squadra.gf}</td>
                    <td>${squadra.gs}</td>
                    <td>${squadra.dr}</td>
                </tr>
            `;
            tbody.innerHTML += riga;
        });
    } catch (error) {
        console.error("Errore nel caricamento della classifica:", error);
        document.getElementById('corpo-classifica').innerHTML = '<tr><td colspan="10">Errore nel caricamento dati.</td></tr>';
    }
}
