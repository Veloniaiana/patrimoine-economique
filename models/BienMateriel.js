import Possession from "./Possession"

export default class BienMateriel extends Possession{
    constructor(possesseur, type, libelle, valeur, amortissement, date, bienMaterielType){
        super(possesseur, type, libelle, valeur, amortissement, date);
        this.bienMaterielType = bienMaterielType;
    }
}