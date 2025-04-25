import { fight } from "./arena.js";

import { RandomDirection } from "./players/RandomDirection.js";
import { Teacher } from "./players/Teacher.js";

fight([
    RandomDirection,
    Teacher
], 10);
