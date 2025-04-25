Navigating a 3D maze with algorithms.

# How to play
To start playing you first have to add your own algorithm to the players directory.
Let's take a look at the existing Teacher.js algorithm.
```javascript
const dangerous = 99999999;

function algorithmFactory() { // this function is called each time you play a new game against another algorithm

    const weightsByLocation = {}; // state you want to keep per game

    // myNode is the node that you currently occupy
    // enemyNode is the node that your enemy currently occupies
    return function (myNode, enemyNode) {
        weightsByLocation[`${enemyNode.x}${enemyNode.y}${enemyNode.z}`] = dangerous;
       
        const directions = {
            left: { x: myNode.x - 1, y: myNode.y, z: myNode.z },
            right: { x: myNode.x + 1, y: myNode.y, z: myNode.z },
            up: { x: myNode.x, y: myNode.y - 1, z: myNode.z },
            down: { x: myNode.x, y: myNode.y + 1, z: myNode.z },
            forward: { x: myNode.x, y: myNode.y, z: myNode.z - 1 },
            backward: { x: myNode.x, y: myNode.y, z: myNode.z + 1 },
        };
    
        const possibleDirections = []
        for(const [k, v] of Object.entries(directions)) {
            if(!myNode[k]) {
                continue;
            }
            const locationHash = `${v.x}${v.y}${v.z}`;
            const existingWeight = weightsByLocation[locationHash]
            possibleDirections.push({
                name: k,
                weight: existingWeight || 0,
                locationHash
            });
        }
        possibleDirections.sort((a, b) => a.weight - b.weight);
        const direction = possibleDirections[0];
        weightsByLocation[direction.locationHash] = (weightsByLocation[direction.locationHash] || 0) + 1;
        return direction.name; // one of: left, right, up, down, forward, backward
    };
}

export const Teacher = {
    name: 'Teacher', // mandatory and must be unique amongst all player
    algorithm: algorithmFactory, // must always be a factory function that returns the player function
}
```

Nodes that are passed to your player function always consist of the following:
```javascript
{
  x: 16,
  y: -1,
  z: -2,
  left: {
    x: 15,
    y: -1,
    z: -2,
    // more nested nodes
  },
  right: null,
  /**
  up: {...},
  down: {...},
  forward: {...},
  backward: {...}
  */
}
```
Where one of the six directions contains either another node or null.

What happens then is that each player function gets a turn until all turns are exhausted or one of the two player functions has made a mistake. Whichever player function has visited the most distinct nodes wins!
If you visit a node that the enemy player has already visited during the game you lose!
Simple as that.

# Rules
To participate you should abide by the following rules:
- add your player code to the players directory in a singular file e.g. Teacher.js and do not modify any of the existing code besides `main.js`.
- your player function must return one of the following results: `'left'`, `'right'`, `'up'`, `'down'`, `'forward'`, `'backward'`.
- your player function MUST not modify the maze in any way.
- you lose when you enter a node that your enemy has already entered.
- you lose when you make an illegal move instead of one of the 6 valid moves that are mentioned above.
- you are disqualified if your code throws an error.



# Wall of fame (20000 battles fought)
player          | wins     | losses     | based on 
----------------|----------|------------|----------|
RandomDirection | 2295     | 17705      | local
Teacher         | 17705    | 2295       | local

Apr 23, 15:10, 2025
```javascript
[
  {
    totalNodeCount: 46200000,
    name: 'Teacher',
    totalPoints: 0,
    playCount: 20000,
    wins: 17705,
    losses: 2295,
    unsupportedActions: 0,
    forbiddenActions: 2295
  },
  {
    totalNodeCount: 46200000,
    name: 'RandomDirection',
    totalPoints: 0,
    playCount: 20000,
    wins: 2295,
    losses: 17705,
    unsupportedActions: 0,
    forbiddenActions: 17705
  }
]
```