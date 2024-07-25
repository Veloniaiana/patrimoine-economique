import Patrimoine from "./models/Patrimoine.js";
import Possession from "./models/Possession.js";
import Personne from "./models/Personne.js";

const ilo = new Personne("Ilo");
const date1 = new Date("2024-05-13");
const possession1 = new Possession(ilo, "argent", "espece", 400_000, 0, date1);
const possession2 = new Possession(
  ilo,
  "argent",
  "compte epargne",
  200_000,
  0,
  date1,
);
const possession3 = new Possession(
  ilo,
  "argent",
  "conpte courant",
  600_000,
  0,
  date1,
);
const possession4 = new Possession(
  ilo,
  "bien materiel",
  "ordinateur",
  2_000_000,
  10,
  new Date("2021-10-26"),
);
const possession5 = new Possession(
  ilo,
  "bien materiel",
  "vetement",
  1_000_000,
  20,
  new Date("2024-01-01"),
);
const possession6 = new Possession(
  ilo,
  "train de vie",
  "train de vie",
  500_000,
  0,
  date1,
);
const possessionIlo = [
  possession1,
  possession2,
  possession3,
  possession4,
  possession5,
  possession6,
];
const patrimoineIlo = new Patrimoine(ilo, date1, possessionIlo);

const result = patrimoineIlo.getValeur(new Date("2024-06-26"));
console.log(result);