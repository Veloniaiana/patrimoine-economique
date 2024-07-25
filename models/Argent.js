import Possession from "./Possession"

export default class Argent extends Possession{
    constructor(possesseur, type, libelle, valeur, amortissement, date, argentType){
        super(possesseur, type, libelle, valeur, amortissement, date);
        this.argentType = argentType;
    }
}