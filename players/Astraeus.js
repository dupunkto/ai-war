const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const opposites = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
  forward: "backward",
  backward: "forward",
};

function factory() {
  let roundIter = 0;
  let backtrackIter = 0;

  let claimedTerritory = new Set();
  let enemyTerritory = new Set();

  let backtrack = []; // backtrack contains the opposite of all the moves

  // node is where we are now.
  // enemyNode is where the enemy is now.
  return function (node, enemyNode) {  
    roundIter++;
  
    claimedTerritory.add(node.id);
    enemyTerritory.add(enemyNode.id);
  
    // claimedTerritory is where we have been already
    // enemyTerritory is where the enemy has been already
  
    // possibleDirections contains all the directions where there is a node
    const possibleDirections = [];
  
    if (node.left) possibleDirections.push("left");
    if (node.right) possibleDirections.push("right");
    if (node.up) possibleDirections.push("up");
    if (node.down) possibleDirections.push("down");
    if (node.forward) possibleDirections.push("forward");
    if (node.backward) possibleDirections.push("backward");
  
    // freeNodes containes all the node objects (with some extra info) for all the nodes that are free.
    // ownNodes containes all the node objects (with some extra info) for all the nodes that are already ours.
    
    const freeNodes = [];
    const ownNodes = [];
  
    for (const direction of possibleDirections) {
      // `p` is short for possibleNode, so that is the node object for that direction
      const p = node[direction];
    
      const claimed = claimedTerritory.has(p.id)
      const enemyClaimed = enemyTerritory.has(p.id);
  
      if (!claimed && !enemyClaimed) freeNodes.push(direction);
      if (!enemyClaimed) ownNodes.push(direction);
    }
  
    // Determine which node we want to move to.
  
    let decision;
    let reason;
  
    if (freeNodes.length != 0) {
      // Check which nodes are neither potential enemies or
      // already claimed. If any, pick a random one.
      decision = random(freeNodes);
      reason = "free";
    } else if (backtrack.length != 0) {
      // If there are no free nodes, backtrack (if we can), so we can find a space
      // where there is a free node
      decision = backtrack.pop();
      backtrackIter++;
      reason = "backtrack";
    } else {
      // If we detect there are no options left, at least stay in our
      // own territory, so we never enter enemy territory
      decision = random(ownNodes);
      reason = "stuck";
    }
  
    // prompt("Next?");
  
    if(roundIter % 1 == 0) {
      console.log(`Astreaus: total territory: ${claimedTerritory.size}, iter: ${roundIter}, backtrack: ${backtrackIter}, debug: ${enemyTerritory.size}`);
    }
  
    // Unless we are already backtracking, push the move 
    // that would be needed to backtrack.
    if (reason !== "backtrack") {
      backtrack.push(opposites[decision]);
    }
  
    return decision;
  }
}

export const Astraeus = {
    name: 'Astraeus', // mandatory and must be unique amongst all player
    algorithm: factory, // must always be a factory function that returns the player function
}
