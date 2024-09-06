import http from 'node:http';
import fs from 'node:fs/promises';
import { URL } from 'node:url';
import Possession from "./models/possessions/Possession.js";

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const method = req.method;

        if (parsedUrl.pathname === '/possessionListe' && method === 'GET') {
            const data = await fs.readFile('./data.json', 'utf8');
            const jsonData = JSON.parse(data);
            const patrimoine = jsonData.find(item => item.model === "Patrimoine");

            if (!patrimoine) {
                throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(patrimoine.data.possessions));
        } else if (parsedUrl.pathname === '/patrimoineValeur' && method === 'POST') {
            const body = [];
            req.on('data', chunk => body.push(chunk));
            req.on('end', async () => {
                const { dateDebut, dateFin, jour } = JSON.parse(Buffer.concat(body).toString());

                const data = await fs.readFile('./data.json', 'utf8');
                const jsonData = JSON.parse(data);
                const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                if (!patrimoine) {
                    throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                }

                const possessions = patrimoine.data.possessions;
                let valeurTotale = 0;

                possessions.forEach(possession => {
                    const possessionInstance = new Possession(
                        possession.possesseur,
                        possession.libelle,
                        possession.valeur,
                        new Date(possession.dateDebut),
                        possession.dateFin ? new Date(possession.dateFin) : null,
                        possession.tauxAmortissement
                    );

                    const valeurByDate = possessions.getValeurByDateRange(new Date(dateDebut), new Date(dateFin));
                    valeurTotale += valeurByDate;
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ valeurTotale }));
            });
        } else if (parsedUrl.pathname === '/possessionCreation' && method === 'POST') {
            const body = [];
            req.on('data', chunk => body.push(chunk));
            req.on('end', async () => {
                const data = Buffer.concat(body).toString();
                const newPossession = JSON.parse(data);

                newPossession.possesseur = newPossession.possesseur || 'John Doe';

                const fileData = await fs.readFile('./data.json', 'utf8');
                const jsonData = JSON.parse(fileData);
                const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                if (!patrimoine) {
                    throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                }

                patrimoine.data.possessions.push(newPossession);

                await fs.writeFile('./data.json', JSON.stringify(jsonData), 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'OK' }));
            });
        } else if (parsedUrl.pathname.startsWith('/possession/') && method === 'PUT') {
            const segments = parsedUrl.pathname.split('/');
            const libelle = decodeURIComponent(segments[2]);

            if (parsedUrl.pathname.endsWith('/update')) {
                const body = [];
                req.on('data', chunk => body.push(chunk));
                req.on('end', async () => {
                    const { newLibelle, newDateFin } = JSON.parse(Buffer.concat(body).toString());

                    try {
                        const fileData = await fs.readFile('./data.json', 'utf8');
                        const jsonData = JSON.parse(fileData);
                        const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                        if (!patrimoine) {
                            throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                        }

                        const possessions = patrimoine.data.possessions;
                        const possession = possessions.find(p => p.libelle === libelle);

                        if (!possession) {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: 'ERROR', message: 'Possession non trouvée' }));
                            return;
                        }

                        if(newLibelle !== ""){
                            possession.libelle = newLibelle
                        }if(newLibelle === ""){
                            possession.libelle = libelle
                        }
                        possession.dateFin = newDateFin ? new Date(newDateFin).toISOString() : null;

                        await fs.writeFile('./data.json', JSON.stringify(jsonData), 'utf8');

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'OK' }));
                    } catch (err) {
                        console.error('Erreur du serveur :', err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            status: "ERROR",
                            error: err.message,
                        }));
                    }
                });
            } else if (parsedUrl.pathname.endsWith('/close')) {
                const body = [];
                req.on('data', chunk => body.push(chunk));
                req.on('end', async () => {
                    try {
                        const fileData = await fs.readFile('./data.json', 'utf8');
                        const jsonData = JSON.parse(fileData);
                        const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                        if (!patrimoine) {
                            throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                        }

                        const possessions = patrimoine.data.possessions;
                        const possession = possessions.find(p => p.libelle === libelle);

                        if (!possession) {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: 'ERROR', message: 'Possession non trouvée' }));
                            return;
                        }
                        possession.dateFin = new Date().toISOString();

                        await fs.writeFile('./data.json', JSON.stringify(jsonData), 'utf8');

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'OK' }));
                    } catch (err) {
                        console.error('Erreur du serveur :', err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            status: "ERROR",
                            error: err.message,
                        }));
                    }
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } catch (err) {
        console.error('Erreur du serveur :', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "ERROR",
            error: err.message,
        }));
    }
});

server.listen(PORT, () => {
    console.log(`Serveur Node.js démarré sur le port ${PORT}`);
});
