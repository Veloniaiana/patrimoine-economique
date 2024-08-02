import { assert } from 'chai'
import {describe, it } from 'mocha';
import Personne from "../models/Personne.js";
import Argent from "../models/possessions/Argent.js";
import {TYPE_ARGENT} from "../constante.js";
import {TYPE_BIEN_MATERIEL} from "../constante.js";
import BienMateriel from "../models/possessions/BienMateriel.js";
import Patrimoine from "../models/Patrimoine.js";

const Ilo = new Personne("Ilo");
const Bob = new Personne("Bob");
const possession1 = new Argent(Ilo, "Argent", 400_000, new Date(2024,5,13),new Date(2026,5,13), 0, TYPE_ARGENT.Espece);
const possession2 = new Argent(Ilo, "Argent", 200_000, new Date(2024,5,13),new Date(2026,5,13), 0, TYPE_ARGENT.Epargne);
const possession3 = new Argent(Ilo, "Argent", 600_000, new Date(2024,5,13), new Date(2026,5,13), 0, TYPE_ARGENT.Courant);
const possession4 = new  BienMateriel(Ilo, "Bien Materiel", 2_000_000, new Date(2021,10,26),new Date(2026,5,13),10, TYPE_BIEN_MATERIEL.Materiel_Informatique);
const possession5 = new BienMateriel(Ilo, "Bien Materiel", 1_000_000,new Date(2024,1,1),new Date(2027,5,13), 20, TYPE_BIEN_MATERIEL.Vetement);
const possession6 = new Argent(Bob, "Argent", 400_000, new Date(2024,5,13),new Date(2026,5,13), 0, TYPE_ARGENT.Espece);
let IloPatrimoine = new Patrimoine(Ilo, [possession1, possession2, possession3, possession4, possession5]);
let BobPatrimoine = new Patrimoine(Bob,[]);

describe("Test", function() {
    describe("Avoir la valeur d'une patrimoine qui ne possede pas d'amortissement", ()=>{
        it("Test sans amortissement", function() {
            assert.equal(possession1.getValeur(new Date(2025,5,13)),400_000);
        });
    });
    describe("Avoir la valeur d'une Possession avec un amortissement", function() {
        it("Valeur après 3 mois", () => {
            assert.equal(possession4.getValeurApresAmortissement(new Date(2022,1,26)),1_950_000);
        });
        it("Valeur après 6 mois", function (){
            assert.equal(possession4.getValeurApresAmortissement(new Date(2022,4,26)),1_900_000);
        });
        it("Valeur après une année", function (){
            assert.equal(possession5.getValeurApresAmortissement(new Date(2025,1,1)),800_000);
        });
        it("Valeur après 2 ans", function (){
            assert.equal(possession5.getValeurApresAmortissement(new Date(2026,1,1)),600_000);
        });
    });
    describe("Ajouter et supprimer une possession dans un patrimoine", ()=>{
        it('Ajouter une possession qui appartient au possesseur du patrimoine', () => {
            BobPatrimoine.addPossession(possession6);
            assert.equal(BobPatrimoine.possessions.includes(possession6), true);
        });
        it("Refuser d'ajouter une possession qui n'appartient pas au possesseur du patrimoine", ()=>{
            IloPatrimoine.addPossession(possession6);
            assert.equal(IloPatrimoine.possessions.includes(possession6), false);
        });
        it('Supprimer une possession dans un patrimoine', () => {
            BobPatrimoine.removePossession(possession6);
            assert.equal(BobPatrimoine.possessions.includes(possession6), false);
        });
    });
})