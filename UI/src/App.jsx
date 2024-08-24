import { useState } from 'react';
import { Button } from "react-bootstrap";
import Possession from "../../models/possessions/Possession.js";
import './App.css';

const PossessionArray = [];

function App() {
    const [view, setView] = useState('home'); // 'home', 'creation', 'list', or 'update'
    const [possessions, setPossessions] = useState([]);
    const [url, setUrl] = useState('');
    const [newPossession, setNewPossession] = useState({
        possesseur: 'John Doe', // Valeur par défaut
        libelle: '',
        valeur: 0,
        dateDebut: '',
        dateFin: '',
        tauxAmortissement: 0,
    });
    const [updatePossession, setUpdatePossession] = useState({
        libelle: '',
        newDateFin: '',
    });

    const fetchPossessions = async () => {
        try {
            const response = await fetch('http://localhost:3001/possessionListe');
            const data = await response.json();
            setPossessions(data);
            setUrl('/possessionListe');
            setView('list'); // Affiche uniquement la liste et les boutons
        } catch (error) {
            console.error("Erreur lors de la récupération des possessions :", error);
        }
    };

    const createPossession = async () => {
        try {
            const response = await fetch('http://localhost:3001/possessionCreation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPossession),
            });

            const result = await response.json();
            if (result.status === 'OK') {
                alert('Possession créée avec succès');
                setNewPossession({
                    possesseur: 'John Doe', // Réinitialisation à la valeur par défaut
                    libelle: '',
                    valeur: 0,
                    dateDebut: '',
                    dateFin: '',
                    tauxAmortissement: 0,
                });
                setView('home'); // Retour au mode d'accueil
            } else {
                alert('Erreur lors de la création de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la création de la possession :", error);
        }
    };

    const updatePossessionDateFin = async () => {
        try {
            const response = await fetch(`http://localhost:3001/possession/${updatePossession.libelle}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dateFin: updatePossession.newDateFin }),
            });

            const result = await response.json();
            if (result.status === 'OK') {
                alert('Possession mise à jour avec succès');
                setUpdatePossession({
                    libelle: '',
                    newDateFin: '',
                });
                setView('home'); // Retour au mode d'accueil
            } else {
                alert('Erreur lors de la mise à jour de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la possession :", error);
        }
    };

    const closePossession = async (libelle) => {
        try {
            const response = await fetch(`http://localhost:3001/possession/${libelle}/close`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.status === 'OK') {
                alert('Possession clôturée avec succès');
                fetchPossessions(); // Rafraîchir la liste des possessions
            } else {
                alert('Erreur lors de la clôture de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la clôture de la possession :", error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <Button onClick={() => setView('home')}>Accueil</Button>
                <Button onClick={() => setView('creation')}>Créer une Possession</Button>
                <Button onClick={() => fetchPossessions()}>Liste des Possessions</Button>
                {view === 'home' && <div>Bienvenue dans l'application de gestion des possessions</div>}
                {view === 'creation' && (
                    <div className="creation-form">
                        <h2>Créer une nouvelle possession</h2>
                        <input
                            type="text"
                            value={newPossession.libelle}
                            onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
                            placeholder="Libelle"
                        />
                        <input
                            type="number"
                            value={newPossession.valeur}
                            onChange={(e) => setNewPossession({ ...newPossession, valeur: parseFloat(e.target.value) })}
                            placeholder="Valeur"
                        />
                        <input
                            type="date"
                            value={newPossession.dateDebut}
                            onChange={(e) => setNewPossession({ ...newPossession, dateDebut: e.target.value })}
                            placeholder="Date Début"
                        />
                        <input
                            type="date"
                            value={newPossession.dateFin}
                            onChange={(e) => setNewPossession({ ...newPossession, dateFin: e.target.value })}
                            placeholder="Date Fin"
                        />
                        <input
                            type="number"
                            value={newPossession.tauxAmortissement}
                            onChange={(e) => setNewPossession({ ...newPossession, tauxAmortissement: parseFloat(e.target.value) })}
                            placeholder="Taux Amortissement"
                        />
                        <Button onClick={createPossession}>Créer</Button>
                    </div>
                )}
                {view === 'update' && (
                    <div className="update-form">
                        <h2>Mettre à jour une possession</h2>
                        <input
                            type="text"
                            value={updatePossession.libelle}
                            onChange={(e) => setUpdatePossession({ ...updatePossession, libelle: e.target.value })}
                            placeholder="Libelle"
                        />
                        <input
                            type="date"
                            value={updatePossession.newDateFin}
                            onChange={(e) => setUpdatePossession({ ...updatePossession, newDateFin: e.target.value })}
                            placeholder="Nouvelle Date Fin"
                        />
                        <Button onClick={updatePossessionDateFin}>Mettre à jour</Button>
                    </div>
                )}
                {view === 'list' && (
                    <div className="list-view">
                        <h2>Liste des possessions</h2>
                        <table className="table table-striped w-75 align-items-center">
                            <thead>
                            <tr>
                                <th>Libelle</th>
                                <th>Valeur</th>
                                <th>DateDebut (yyyy/mm/dd)</th>
                                <th>DateFin (yyyy/mm/dd)</th>
                                <th>Amortissement</th>
                                <th>Valeur Actuel</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {possessions.map((possession, index) => {
                                const valeur = new Possession(
                                    possession.possesseur.nom, possession.libelle, possession.valeur, new Date(possession.dateDebut),
                                    (possession.dateFin !== null ? new Date(possession.dateFin) : null), possession.tauxAmortissement
                                );
                                PossessionArray.push(valeur);
                                return (
                                    <tr key={index}>
                                        <td>{valeur.libelle}</td>
                                        <td>{valeur.valeur}</td>
                                        <td>{new Date(valeur.dateDebut).toLocaleDateString()}</td>
                                        <td>{valeur.dateFin === null ? 'null' : new Date(valeur.dateFin).toLocaleDateString()}</td>
                                        <td>{valeur.tauxAmortissement !== null ? valeur.tauxAmortissement : 'null'}</td>
                                        <td>{valeur.getValeur(new Date())}</td>
                                        <td>
                                            <Button onClick={() => closePossession(valeur.libelle)}>Clore</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
