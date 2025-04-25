import { play } from "./play.js";

export const fight = (players, iterations) => {
    const allPlayerStats = players.reduce((map, player) => {
        map[player.name] = {
            totalNodeCount: 0,
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
    
        if (player.won) {
            playerStats.wins++;
        } else if (player.lossCondition.unsupportedAction) {
            playerStats.unsupportedActions++;
            playerStats.losses++;
        } else if (player.lossCondition.forbiddenAction) {
            playerStats.forbiddenActions++;
            playerStats.losses++;
        } else if (player.lost) {
            playerStats.losses++;
        }
    }

    console.log(`FIGHT! FIGHT! FIGHT!`);

    for (let i = 0; i < iterations; i++) {
        for (const pa of players) {
            for (const pb of players) {
                // remove if to play against self
                if (pa.name === pb.name) {
                    continue;
                }
                let result = play(pa.name, pa.algorithm(), pb.name, pb.algorithm());
                updatePlayerStats(result, result.player1);
                updatePlayerStats(result, result.player2);
            }
        }
    }

    console.log(
        Object.values(allPlayerStats).sort((sa, sb) => sb.wins - sa.wins)
    );
}