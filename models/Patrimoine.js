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
    if (possession.possesseur !== this.possesseur) {
      return(
        `${possession.libelle} n'appartient pas à ${this.possesseur}`
      );
    } else {
      this.possessions.push(possession);
      return true;
    }
  }
  removePossession(possession) {
    this.possessions = this.possessions.filter(
      (p) => p.libelle !== possession.libelle,
    );
  }
}
