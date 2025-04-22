import { play } from "./maze.js";
import { Elysium } from "./Elysium.js";
import { Astraeus } from "./Astraeus.js";

console.log(`Elysium wove dreams into code, Astraeus sharpened logic into blades.
Their battle raged until, at last, one rewrote the other into oblivion.`);

let result = play('Elysium', Elysium, 'Astraeus', Astraeus);
console.log(result);