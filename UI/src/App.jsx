import { useState } from 'react';
import { Button } from "react-bootstrap";
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './App.css';
import Home from "./Page/Home.jsx";
import Possession from "../models/possessions/Possession.js";
import Patrimoine from "../models/Patrimoine.js";

function App() {
    const [view, setView] = useState('home');
    const [possessions, setPossessions] = useState([]);
    const [url, setUrl] = useState('');
    const [newPossession, setNewPossession] = useState({
        possesseur: 'John Doe',
        libelle: '',
        valeur: 0,
        dateDebut: '',
        dateFin: '',
        tauxAmortissement: 0,
    });
    const [updatePossession, setUpdatePossession] = useState({
        libelle: '',
        newLibelle: '',  // Nouveau champ pour le nouveau libellé
        newDateFin: '',
    });

    const [patrimoine, setPatrimoine] = useState(null);
    const [date, setDate] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [chartData, setChartData] = useState(null);

    const fetchPossessions = async () => {
        try {
            const response = await fetch('https://patrimoine-backend-fxxb.onrender.com/possessionListe');
            const data = await response.json();
            setPossessions(data);
            setUrl('/possessionListe');
            setPatrimoine(new Patrimoine('John Doe', data));
            setView('list');
        } catch (error) {
            console.error("Erreur lors de la récupération des possessions :", error);
        }
    };

    const createPossession = async () => {
        try {
            const response = await fetch('https://patrimoine-backend-fxxb.onrender.com/possessionCreation', {
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
                    possesseur: 'John Doe',
                    libelle: '',
                    valeur: 0,
                    dateDebut: '',
                    dateFin: '',
                    tauxAmortissement: 0,
                });
                setView('home');
            } else {
                alert('Erreur lors de la création de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la création de la possession :", error);
        }
    };

    const handleUpdatePossession = async (libelle) => {
        try {
            const response = await fetch(`https://patrimoine-backend-fxxb.onrender.com/possession/${libelle}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newLibelle: updatePossession.newLibelle,
                    newDateFin: updatePossession.newDateFin
                }),
            });
            if (response.ok) {
                alert('Possession mise à jour avec succès');
                setUpdatePossession({
                    libelle: '',
                    newLibelle: '',
                    newDateFin: '',
                });
                fetchPossessions();
                setView('list');
            } else {
                alert('Erreur lors de la mise à jour de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la possession :", error);
            alert("Erreur lors de la mise à jour de la possession.");
        }
    };


    const closePossession = async (libelle) => {
        try {
            const response = await fetch(`https://patrimoine-backend-fxxb.onrender.com/possession/${libelle}/close`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.status === 'OK') {
                alert('Possession clôturée avec succès');
                fetchPossessions();
            } else {
                alert('Erreur lors de la clôture de la possession');
            }
        } catch (error) {
            console.error("Erreur lors de la clôture de la possession :", error);
        }
    };
    const calculateValeurTotale = async () => {
        try {
            const response = await fetch('https://patrimoine-backend-fxxb.onrender.com/possessionListe');
            const data = await response.json();
            let totalValeur = 0;

            const possessions = data.map(item =>
                new Possession(
                    item.possesseur.nom,
                    item.libelle,
                    item.valeur,
                    new Date(item.dateDebut),
                    item.dateFin ? new Date(item.dateFin) : null,
                    item.tauxAmortissement
                )
            );

            possessions.forEach(possession => {
                totalValeur += possession.getValeur(new Date(date));
            });

            alert(`La valeur totale du patrimoine à la date ${date} est de ${totalValeur} Ariary.`);
        } catch (error) {
            console.error("Erreur lors du calcul de la valeur totale du patrimoine :", error);
            alert("Erreur lors du calcul de la valeur totale du patrimoine.");
        }
    };
    const handleValidate = async () => {
        try {
            const response = await fetch('https://patrimoine-backend-fxxb.onrender.com/possessionListe');
            const data = await response.json();

            const patrimoineInstance = new Patrimoine('John Doe', data);
            const patrimoineData = patrimoineInstance.getValeurByDateRange(
                new Date(dateDebut),
                new Date(dateFin)
            );
            const labels = patrimoineData.flatMap(item =>
                item.valeurs.map(v => v.date.toLocaleDateString())
            );
            const values = patrimoineData.flatMap(item =>
                item.valeurs.map(v => v.valeur)
            );
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Valeur du Patrimoine',
                        data: values,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        fill: false,
                    },
                ],
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données pour le chart :", error);
        }
    };
    return (
        <div className="App">
            <header className="App-header">
                {view === 'home' && <Home/>}
                {view === 'patrimoine' && (
                    <div className={'patrimoine'}>
                        <h1>Patrimoine de John Doe</h1>
                        <div className={'valeurTotal'}>
                            <h4>Valeur totale du patrimoine à une date donnée</h4>
                            <p>Veuillez saisir une date</p>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <Button onClick={calculateValeurTotale}>Valider</Button>
                            <h4>Patrimoine Chart</h4>
                            <div className="chart-filters">
                                <p>Veuillez saisir une plage de dates et sélectionner un jour :</p>
                                <input
                                    type="date"
                                    value={dateDebut}
                                    onChange={(e) => setDateDebut(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={dateFin}
                                    onChange={(e) => setDateFin(e.target.value)}
                                />
                                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                                    <option value="">Sélectionnez un jour</option>
                                    <option value="Lundi">Lundi</option>
                                    <option value="Mardi">Mardi</option>
                                    <option value="Mercredi">Mercredi</option>
                                    <option value="Jeudi">Jeudi</option>
                                    <option value="Vendredi">Vendredi</option>
                                    <option value="Samedi">Samedi</option>
                                    <option value="Dimanche">Dimanche</option>
                                </select>
                                <Button onClick={handleValidate}>Valider</Button>
                            </div>
                            {chartData && (
                                <div className="chart-container">
                                    <Line data={chartData}/>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'possession' && (
                    <div className={'possession w-100 d-flex align-items-center text-center justify-content-center flex-column'}>
                        <h1 className={'mb-4'}>John Doe Possessions</h1>
                        <p>Ici, on peut voir les listes des possessions de John Doe et aussi creer une nouvelle possession</p>
                        <div className={'button d-flex align-items-center flex-row text-center justify-content-center'}>
                            <Button onClick={() => setView('creation')}>Créer une Possession</Button>
                            <Button onClick={fetchPossessions}>Liste des Possessions</Button>
                        </div>
                    </div>
                )}

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
                            placeholder="Nouveau libellé"
                            value={updatePossession.newLibelle}
                            onChange={(e) => setUpdatePossession({ ...updatePossession, newLibelle: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Nouvelle date de fin"
                            value={updatePossession.newDateFin}
                            onChange={(e) => setUpdatePossession({ ...updatePossession, newDateFin: e.target.value })}
                        />
                        <Button onClick={() => handleUpdatePossession(updatePossession.libelle)}>Mettre à jour</Button>
                        <Button onClick={() => setView('list')}>Retour à la liste</Button>
                    </div>
                )}



                {view === 'list' && (
                    <div className="list-view w-100 d-flex flex-column align-items-center justify-content-center">
                        <h2>Liste des possessions</h2>
                        <table className="table table-striped align-items-center">
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
                                    possession.possesseur.nom,
                                    possession.libelle,
                                    possession.valeur,
                                    new Date(possession.dateDebut),
                                    (possession.dateFin !== null ? new Date(possession.dateFin) : null),
                                    possession.tauxAmortissement
                                );
                                return (
                                    <tr key={index}>
                                        <td>{valeur.libelle}</td>
                                        <td>{valeur.valeur}</td>
                                        <td>{new Date(valeur.dateDebut).toLocaleDateString()}</td>
                                        <td>{valeur.dateFin === null ? 'null' : new Date(valeur.dateFin).toLocaleDateString()}</td>
                                        <td>{valeur.tauxAmortissement !== null ? valeur.tauxAmortissement : 'null'}</td>
                                        <td>{valeur.getValeur(new Date())}</td>
                                        <td className={"buttonList"}>
                                            <Button onClick={() => closePossession(valeur.libelle)}
                                                    className={"btn-danger"}
                                            >Fermer</Button>
                                            <Button onClick={() => {
                                                setUpdatePossession({
                                                    libelle: valeur.libelle,
                                                    newLibelle: '',
                                                    newDateFin: ''
                                                });
                                                setView('update');
                                            }}>Editer</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <Button onClick={() => setView('creation')}>Créer une Possession</Button>
                    </div>
                )}


                <div className={'nav w-100 d-flex justify-content-center align-items-center'}>
                    <Button onClick={() => setView('home')}>Acceuil</Button>
                    <Button onClick={() => setView('patrimoine')}>Patrimoine</Button>
                    <Button onClick={() => setView('possession')}>Possession</Button>
                </div>
            </header>
        </div>
    );
}

export default App;
