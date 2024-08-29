import Possession from "./possessions/Possession.js";

export default class Patrimoine {
  constructor(possesseur, possessions) {
    this.possesseur = possesseur;
    this.possessions = [...possessions]; // [Possession, Possession, ...]
  }
  getValeur(date) {
    let result = 0;
    for (const item of this.possessions) {
      result += item.getValeur(date);
    }
    return result;
  }

  addPossession(possession) {
    if (possession.possesseur != this.possesseur) {
      console.log(
        `${possession.libelle} n'appartient pas à ${this.possesseur}`,
      );
    } else {
      this.possessions.push(possession);
    }
  }
  removePossession(possession) {
    this.possessions = this.possessions.filter(
      (p) => p.libelle !== possession.libelle,
    );
  }
  getValeurByDateRange(dateDebut, dateFin) {
    const result = [];

    this.possessions.forEach((possession) => {
      const possessionInstance = new Possession(
          possession.possesseur,
          possession.libelle,
          possession.valeur,
          new Date(possession.dateDebut),
          possession.dateFin ? new Date(possession.dateFin) : null,
          possession.tauxAmortissement
      );

      const valeurs = [];
      let currentDate = new Date(dateDebut);

      while (currentDate <= dateFin) {
        const valeur = possessionInstance.getValeur(currentDate);
        valeurs.push({
          date: new Date(currentDate),
          valeur: valeur
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      result.push({
        libelle: possession.libelle,
        valeurs: valeurs
      });
    });

    return result;
  }
}
