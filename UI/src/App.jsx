import './App.css'
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import Possession from "../../models/possessions/Possession.js";
import Patrimoine from "../../models/Patrimoine.js";
import {readFile} from "../../data/index.js";

let PossessionArray = [];

function Tableau(){
    const [possessions, setPossessions] = useState([])
    useEffect(()=>{
        readFile('./data.json').then((result) => {
            setPossessions(result.find(item => item.model === "Patrimoine").data.possessions);
        });
    },[]);
    return (
        <div className={"w-100 d-flex align-items-center justify-content-center"}>
            <table className={"table table-striped w-75 align-items-center"}>
                <thead>
                <tr>
                    <th>Libelle</th>
                    <th>Valeur</th>
                    <th>DateDebut (yyyy/mm/dd)</th>
                    <th>DateFin (yyyy/mm/dd)</th>
                    <th>Amortissement</th>
                    <th>Valeur Actuel</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((possession, index) => {
                        const valeur = new Possession(
                            possession.possesseur, possession.libelle, possession.valeur, new Date(possession.dateDebut),
                            (possession.dateFin !== null ? new Date(possession.dateFin) : null), possession.tauxAmortissement);
                        PossessionArray.push(valeur);
                        return (
                            <tr key={index}>
                                <td>{valeur.libelle}</td>
                                <td>{valeur.valeur}</td>
                                <td>{new Date(valeur.dateDebut).toLocaleDateString()}</td>
                                <td>{valeur.dateFin === null ? 'null' : new Date(valeur.dateFin).toLocaleDateString()}</td>
                                <td>{valeur.tauxAmortissement !== null ? valeur.tauxAmortissement : 'null'}</td>
                                <td>{valeur.getValeur(new Date())}</td>
                            </tr>
                        )
                    }
                )}
                </tbody>
            </table>
        </div>
    );
}

function ValeurPatrimoine(date) {
    const patrimoine = new Patrimoine("John Doe", PossessionArray.slice(0, 6))
    console.log(PossessionArray.slice(0, 6))
    let result = patrimoine.getValeur(new Date(date));
    if (isNaN(result)) {
        return '';
    }
    return result;
}

function App() {
    let [InputDate, setInputDate] = useState('');
    let [DateFinal, SetDateFinal] = useState('...');

    const handleInputChange = (e) => {
        setInputDate(e.target.value);
    };
    const handleButtonClick = () => {
        SetDateFinal(InputDate);
    }
    return (
        <div className={"body position-fixed top-0 w-100"}>
            <div className={"title"}>
                <h1 className={"mt-3 mb-5 text-center text-primary"}>Patrimoine Economique</h1>
            </div>
            <Tableau/>
            <h2 className={"mt-5 mb-3"}>Valeur total du Patrimoine</h2>
            <p className={'mb-2'}>Veuillez selectionner une date</p>
            <div className={"d-flex align-items-center mb-3"}>
                <input
                    type={"date"}
                    value={InputDate}
                    onChange={handleInputChange}
                />
                <Button
                    className={'m-lg-1'}
                    onClick={() => {
                        handleButtonClick()
                    }}
                >Valider</Button>
            </div>
            <p className={"mt-2"}>La Valeur de la patrimoine à <span className={"text-danger"}>{DateFinal}</span> est de : <span className={"text-danger"}>{ValeurPatrimoine(DateFinal)}</span></p>
        </div>
    );
}

export default App;