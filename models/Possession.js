
export default class Possession {
  constructor(possesseur, type, libelle, valeur, amortissement, date) {
    this.possesseur = possesseur;
    this.type = type;
    this.libelle = libelle;
    this.valeur = valeur;
    this.amortissement = amortissement;
    this.date = date;
  }
}