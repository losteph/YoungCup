document.addEventListener('DOMContentLoaded', () => {
    caricaMarcatori();
});

async function caricaMarcatori() {
    try {
        const [marcatoriRes, squadreRes] = await Promise.all([
            fetch('dati/marcatori.json'),
            fetch('dati/squadre.json')
        ]);
        const marcatori = await marcatoriRes.json();
        const squadreData = await squadreRes.json();

        marcatori.sort((a, b) => b.gol - a.gol || b.assist - a.assist);

        const tbody = document.getElementById('corpo-marcatori');
        tbody.innerHTML = '';

        marcatori.forEach((p, index) => {
            const squadraInfo = squadreData.find(s => s.nome === p.squadra);
            const logoUrl = squadraInfo ? squadraInfo.logo : 'img/logo.jpeg';

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${p.nome}</td>
                    <td>
                        <div class="tabella-squadra-logo">
                            <img src="${logoUrl}" class="mini-logo">
                            <span>${p.squadra}</span>
                        </div>
                    </td>
                    <td><strong>${p.gol}</strong></td>
                    <td>${p.assist}</td>
                    <td>${p.ammonizioni}</td>
                    <td>${p.espulsioni}</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
}
