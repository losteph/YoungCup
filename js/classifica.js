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
                gf: 0, gs: 0, dr: 0, 
                logo: squadra.logo // Salviamo il logo qui per usarlo dopo
            };
        });

        partite.forEach(partita => {

    if (partita.fase === "playoff") return;
            
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

        // Trasformazione in array e ordinamento
        const classificaArray = Object.keys(classifica).map(nome => ({ squadra: nome, ...classifica[nome] }));
        classificaArray.sort((a, b) => b.punti - a.punti || b.dr - a.dr);

        const tbody = document.getElementById('corpo-classifica');
        tbody.innerHTML = ''; 
        classificaArray.forEach((s, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="tabella-squadra-logo">
                            <img src="${s.logo}" class="mini-logo">
                            <span>${s.squadra}</span>
                        </div>
                    </td>
                    <td><strong>${s.punti}</strong></td>
                    <td>${s.giocate}</td>
                    <td>${s.vittorie}</td>
                    <td>${s.pareggi}</td>
                    <td>${s.sconfitte}</td>
                    <td>${s.gf}</td>
                    <td>${s.gs}</td>
                    <td>${s.dr}</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
}
