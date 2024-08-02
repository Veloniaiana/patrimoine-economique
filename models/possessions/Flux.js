// THIS MAY CHANGE IN THE FUTURE
// dateDebut = 01/01/2024
// montant = 400_000
// jour = 1
import Possession from "./Possession.js";
export default class Flux extends Possession {
  // Si salaire => +
  // Si train de vie => -
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement, jour) {
    super(jour, dateDebut, libelle, dateFin, dateFin, dateFin);
    this.valeur = valeur;
    this.jour = jour;
    // this.source = source; // null || Compte
    // this.destination = destination; // Compte
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
  }

  getValeur(date) {
    // TODO: calculer le montant total du flux en prenant compte du jour de versement
    // calcul différence entre date et date debut
    const differenceDate = {
      annee: date.getFullYear() - this.dateDebut.getFullYear(),
      mois: date.getMonth() - this.dateDebut.getMonth(),
    };

    // calcul montant total
    let valeurTotal = 0;
    if (differenceDate.annee > 0 || differenceDate.mois > 0) {
      valeurTotal = this.valeur * differenceDate.mois + this.valeur * differenceDate.annee * 12;
    }

    return valeurTotal;
  }
}