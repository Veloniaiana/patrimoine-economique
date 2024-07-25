export default class Patrimoine {
  constructor(possesseur, date, possessions) {
    this.possesseur = possesseur;
    this.date = date;
    this.possessions = [...possessions]; // [Possession, Possession, ...]
  }
  getValeur(date) {
    let result = 0;
    for (const possession of this.possessions) {
      if (possession.amortissement == 0) {
        result += possession.valeur;
      } else {
        let year = date.getFullYear() - possession.date.getFullYear();
        let valeur_amortissement =
          (possession.valeur * possession.amortissement) / 100;
        let valeur_final = possession.valeur - year * valeur_amortissement;
        result += valeur_final;
      }
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
}