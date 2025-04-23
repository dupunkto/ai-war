import { play } from "./maze.js";
import { players } from "./players.js";

console.log(`Elysium wove dreams into code, Astraeus sharpened logic into blades.
Their battle raged until, at last, one rewrote the other into oblivion.`);

const allPlayerStats = players.reduce((map, player) => {
    map[player.name] = {
        totalNodeCount: 0,
        totalRoundsPlayed: 0,
        name: player.name,
        totalPoints: 0,
        playCount: 0,
        wins: 0,
        losses: 0,
        unsupportedActions: 0,
        forbiddenActions: 0,
    };
    return map;
}, {});

function updatePlayerStats(result, player) {
    const playerStats = allPlayerStats[player.name];
    playerStats.totalPoints += player.points;
    playerStats.playCount++;
    playerStats.totalNodeCount += result.nodeCount;
    playerStats.totalRoundsPlayed += result.roundsPlayed;
    if (player.lossCondition.unsupportedAction) {
        playerStats.unsupportedAction++;
        playerStats.losses++;
    } else if (player.lossCondition.forbiddenActions) {
        playerStats.forbiddenActions++;
        playerStats.losses++;
    } else if (player.lossCondition.points) {
        playerStats.losses++;
    }
}

for (let i = 0; i < 100; i++) {
    for (const pa of players) {
        for (const pb of players) {
            // remove if to play against self
            if (pa.name === pb.name) {
                continue;
            }
            let result = play(pa.name, pa.algorithm, pb.name, pb.algorithm);
            updatePlayerStats(result, result.player1);
            updatePlayerStats(result, result.player2);
            if (result.victor) {
                allPlayerStats[result.victor.name].wins++;
            }
        }
    }
}

console.log(
    Object.values(allPlayerStats).sort((sa, sb) => sb.wins - sa.wins)
);