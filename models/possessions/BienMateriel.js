import Possession from "./Possession.js";
import {TYPE_BIEN_MATERIEL} from "../../constante.js";

export default class BienMateriel extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement,type) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
    if(!Object.values(TYPE_BIEN_MATERIEL).includes(type)){
      throw new Error("Type d'argent invalide");
    }
    this.type = type;
  }

  getValeur(date) {
    return super.getValeur(date);
  }
}
