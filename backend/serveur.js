import http from 'node:http';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    // Ajoutez les en-têtes CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Remplacez par l'URL de votre frontend
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Répondre aux requêtes OPTIONS avec un statut 204
        res.writeHead(204); // 204 No Content
        res.end();
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const method = req.method;

        if (parsedUrl.pathname === '/possessionListe' && method === 'GET') {
            const data = await fs.readFile('../UI/public/data.json', 'utf8');
            const jsonData = JSON.parse(data);
            const patrimoine = jsonData.find(item => item.model === "Patrimoine");

            if (!patrimoine) {
                throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(patrimoine.data.possessions));
        } else if (parsedUrl.pathname.startsWith('/possession/') && method === 'PUT') {
            const libelle = parsedUrl.pathname.split('/')[2];

            if (parsedUrl.pathname.endsWith('/update')) {
                // Mise à jour de la date de fin
                const body = [];
                req.on('data', chunk => body.push(chunk));
                req.on('end', async () => {
                    const data = Buffer.concat(body).toString();
                    const { dateFin } = JSON.parse(data);

                    const fileData = await fs.readFile('../UI/public/data.json', 'utf8');
                    const jsonData = JSON.parse(fileData);
                    const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                    if (!patrimoine) {
                        throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                    }

                    const possessions = patrimoine.data.possessions;
                    const possession = possessions.find(p => p.libelle === libelle);

                    if (!possession) {
                        throw new Error('Possession non trouvée');
                    }

                    possession.dateFin = dateFin;

                    await fs.writeFile('../UI/public/data.json', JSON.stringify(jsonData), 'utf8');

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'OK' }));
                });
            } else if (parsedUrl.pathname.endsWith('/close')) {
                // Clore la possession en mettant à jour la date de fin à aujourd'hui
                const fileData = await fs.readFile('../UI/public/data.json', 'utf8');
                const jsonData = JSON.parse(fileData);
                const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                if (!patrimoine) {
                    throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                }

                const possessions = patrimoine.data.possessions;
                const possession = possessions.find(p => p.libelle === libelle);

                if (!possession) {
                    throw new Error('Possession non trouvée');
                }

                possession.dateFin = new Date().toISOString();

                await fs.writeFile('../UI/public/data.json', JSON.stringify(jsonData), 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'OK' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        } else if (parsedUrl.pathname === '/possessionCreation' && method === 'POST') {
            // Création d'une nouvelle possession
            const body = [];
            req.on('data', chunk => body.push(chunk));
            req.on('end', async () => {
                const data = Buffer.concat(body).toString();
                const newPossession = JSON.parse(data);

                // Définir le possesseur par défaut
                newPossession.possesseur = newPossession.possesseur || 'John Doe';

                const fileData = await fs.readFile('../UI/public/data.json', 'utf8');
                const jsonData = JSON.parse(fileData);
                const patrimoine = jsonData.find(item => item.model === "Patrimoine");

                if (!patrimoine) {
                    throw new Error('Données de patrimoine non trouvées dans le fichier JSON');
                }

                patrimoine.data.possessions.push(newPossession);

                await fs.writeFile('../UI/public/data.json', JSON.stringify(jsonData), 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'OK' }));
            });
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
