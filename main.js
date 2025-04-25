import { fight } from "./arena.js";

import { Random } from "./players/Random.js";
import { Teacher } from "./players/Teacher.js";
import { Astraeus } from "./players/Astraeus.js";

fight([
    Random,
    Teacher,
    Astraeus
], 10);
