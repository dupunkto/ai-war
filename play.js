import { distinctRandomNodes, maze } from "./maze.js";

const ownership = Array({length: maze.length});

export const play = (playerName1, playerFunc1, playerName2, playerFunc2) => {
    ownership.fill(null);
   
    const randomNodes = distinctRandomNodes();
    let nodePlayer1 = randomNodes[0];
    let nodePlayer2 = randomNodes[1];
    ownership[nodePlayer1.id] = playerName1;
    ownership[nodePlayer2.id] = playerName2;

    const rounds = maze.length * 4;
    const result = {
        nodeCount: maze.length,
        player1: {
            name: playerName1,
            start: nodePlayer1,
            points: 0,
            won: 0,
            lost: 0,
            lossCondition: {
                unsupportedAction: false,    
                forbiddenAction: false,
                points: false,
            }
        },
        player2: {
            name: playerName2,
            start: nodePlayer2,
            points: 0,
            won: 0,
            lost: 0,
            lossCondition: {
                unsupportedAction: false,    
                forbiddenAction: false,
                points: false,
            }
        }
    };

    for (let i = 0; i < rounds; i++) {

        let direction = playerFunc1(nodePlayer1, nodePlayer2);
        nodePlayer1 = nodePlayer1[direction];
        
        if (!nodePlayer1 || typeof nodePlayer1.x !== 'number') {
            result.player2.won = true;
            result.player1.lost = true;
            result.player1.lossCondition.unsupportedAction = true;
            return result;
        }
        if (ownership[nodePlayer1.id] === playerName2) {
            result.player2.won = true;
            result.player1.lost = true;
            result.player1.lossCondition.forbiddenAction = true;
            return result;
        }
        ownership[nodePlayer1.id] = playerName1;

        direction = playerFunc2(nodePlayer2, nodePlayer1);
        nodePlayer2 = nodePlayer2[direction];
      
        if (!nodePlayer2 || typeof nodePlayer2.x !== 'number') {
            result.player1.won = true;
            result.player2.lost = true;
            result.player2.lossCondition.unsupportedAction = true;
            return result;
        }
        if (ownership[nodePlayer2.id] === playerName1) {
            result.player1.won = true;
            result.player2.lost = true;
            result.player2.lossCondition.forbiddenAction = true;
            return result;
        }
        ownership[nodePlayer2.id] = playerName2;
    }

    for (const node of maze) {
        if (ownership[node.id] === playerName1) {
            result.player1.points++;
        } else if (ownership[node.id] === playerName2) {
            result.player2.points++;
        }
    }

    if (result.player1.points > result.player2.points) {
        result.player2.lossCondition.points = true;
        result.player2.lost = true;
        result.player1.won = true;
    } else if(result.player1.points < result.player2.points) {
        result.player1.lossCondition.points = true;
        result.player1.lost = true;
        result.player2.won = true;
    }
    return result;
}