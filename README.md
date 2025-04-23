You are battling for dominance inside an imperfect 3d maze.
You can not enter where your enemy has gone before. 
Both you and your enemy have been assigned a random starting location.

You can only specify one of six directions that you want to explore.
After you got to pick one direction it is up to your enemy to make the same choice.
Collect as much territory as possible to destroy your rival AI!

Before every play cycle the player function is called with all nulls to allow the players to reset persistent data.

Run game.js to get started. Train your own algorithm for dominance by adding it to players.js.

# Wall of fame (180 iterations)
player          | wins     | losses     | based on 
----------------|----------|------------|----------|
Astraeus        | 176 wins | 4 losses   | https://github.com/dupunkto/ai-war/commit/66ed33a38b44a9c417fc2e156f8cb53763b922c4
RandomDirection | 123 wins | 57 losses  | local
Teacher         | 61       | 119        | local
Colonia         | 0 wins   | 180 losses | https://github.com/dupunkto/ai-war/commit/970e35b96442002966962a0208d43cffe2717560

Apr 23, 15:10, 2025
```javascript
  {
    totalNodeCount: 34533540,
    totalRoundsPlayed: 15803,
    name: 'Astraeus',
    totalPoints: 1994060,
    playCount: 180,
    wins: 176,
    losses: 4,
    unsupportedActions: 0,
    forbiddenActions: 0
  },
  {
    totalNodeCount: 34533540,
    totalRoundsPlayed: 20873,
    name: 'RandomDirection',
    totalPoints: 1694058,
    playCount: 180,
    wins: 123,
    losses: 57,
    unsupportedActions: 0,
    forbiddenActions: 0
  },
  {
    totalNodeCount: 34533540,
    totalRoundsPlayed: 16235,
    name: 'Teacher',
    totalPoints: 1586337,
    playCount: 180,
    wins: 61,
    losses: 119,
    unsupportedActions: 0,
    forbiddenActions: 0
  },
  {
    totalNodeCount: 34533540,
    totalRoundsPlayed: 981,
    name: 'Colonia',
    totalPoints: 94367,
    playCount: 180,
    wins: 0,
    losses: 180,
    unsupportedActions: 155,
    forbiddenActions: 0
  }
]
```