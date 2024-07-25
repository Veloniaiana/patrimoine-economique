import Possession from "./Possession";

export default class TrainDeVie extends Possession{
    constructor(possesseur, type, libelle, valeur, amortissement, date, trainDeVieType){
        super(possesseur, type, libelle, valeur, amortissement, date);
        this.trainDeVieType = trainDeVieType;
    }
}