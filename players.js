import { Astraeus } from "./players/Astraeus.js";
import { Colonia } from "./players/Colonia.js";
import { RandomDirection } from "./players/RandomDirection.js";
import { Teacher } from "./players/Teacher.js";

export const players = [
    {
        name: 'RandomDirection',
        algorithm: RandomDirection,
    },
    {
        name: 'Astraeus',
        algorithm: Astraeus,
    },
    {
        name: 'Colonia',
        algorithm: Colonia
    },
    {
        name: 'Teacher',
        algorithm: Teacher
    }
]