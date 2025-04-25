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

  let backtrack = []; // backtrack contains the opposite of all moves

  // node is where we are now.
  // enemyNode is where the enemy is now.
  return function (node, enemyNode) {
    claimedTerritory.add(node.id);
    enemyTerritory.add(enemyNode.id);

    if (roundIter == 0) {
      // In the first round, add all nodes adjacent to the enemyNode to the
      // enemy territory to prevent stepping on the missing starting position.
      for (const direction of [
        "left",
        "right",
        "up",
        "down",
        "forward",
        "backward",
      ]) {
        if (enemyNode[direction]) enemyTerritory.add(enemyNode[direction].id);
      }
    }

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

    // freeNodes containes all the node objects for all the nodes (adjecent to our current node) that are free.
    // directionsOwnNodes containes all directions for all the nodes (adjecent to our current node) that are already ours.

    const freeNodes = [];
    const directionsOwnNodes = [];


    for (const direction of possibleDirections) {
      // possibleNode is the node object for that direction
      const possibleNode = node[direction];

      const claimed = claimedTerritory.has(possibleNode.id);
      const enemyClaimed = enemyTerritory.has(possibleNode.id);
      

      if (!claimed && !enemyClaimed) freeNodes.push({ node: possibleNode, direction: direction });

      if (claimed) directionsOwnNodes.push(direction);
    }

    // Determine which node we want to move to.

    let decision;
    let reason;

    if (freeNodes.length != 0) {
      // Check which nodes are neither potential enemies or
      // already claimed. If any, pick the one where that node
      // has the least amount of empty nodes next to it

      const getNullCount = node => Object.values(node).filter(v => v === null).length;
      
      decision = freeNodes.reduce((min, current) => getNullCount(current.node) < getNullCount(min.node) ? current : min).direction;

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
      decision = random(directionsOwnNodes);
      reason = "stuck";
    }

    // prompt("Next?");

    // Unless we are already backtracking, push the move
    // that would be needed to backtrack.
    if (reason !== "backtrack") {
      backtrack.push(opposites[decision]);
    }

    roundIter++;

    if (roundIter % 100 == 0) {
      console.log(
        `Astreaus: total territory: ${claimedTerritory.size}, iter: ${roundIter}, backtrack: ${backtrackIter}`,
      );
    }

    return decision;
  };
}

export const Astraeus = {
  name: "Astraeus", // mandatory and must be unique amongst all player
  algorithm: factory, // must always be a factory function that returns the player function
};
