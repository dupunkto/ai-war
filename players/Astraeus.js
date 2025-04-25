let roundIter = 0;
let backtrackIter = 0;

const claimedTerritory = [];
const enemyTerritory = [];

const backtrack = []; // backtrack contains the opposite of all the moves

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const opposites = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
  forward: "backward",
  backward: "forward",
};

export const Astraeus = function (myName, node, enemyNode) {
  roundIter++;

  // node is where we are now.
  // enemyNode is where the enemy is now.

  claimedTerritory.push(node);
  enemyTerritory.push(enemyNode);

  // claimedTerritory is where we have been already
  // enemyTerritory is where the enemy has been already

  const neighbouringNodes = {
    left: { x: node.x - 1, y: node.y, z: node.z },
    right: { x: node.x + 1, y: node.y, z: node.z },
    up: { x: node.x, y: node.y - 1, z: node.z },
    down: { x: node.x, y: node.y + 1, z: node.z },
    forward: { x: node.x, y: node.y, z: node.z + 1 },
    backward: { x: node.x, y: node.y, z: node.z - 1 },
  };

  // possibleDirections contains all the directions where there is a node
  const possibleDirections = [];

  if (node.left) possibleDirections.push("left");
  if (node.right) possibleDirections.push("right");
  if (node.up) possibleDirections.push("up");
  if (node.down) possibleDirections.push("down");
  if (node.forward) possibleDirections.push("forward");
  if (node.backward) possibleDirections.push("backward");

  // freeNodes containes all the node objects (with some extra info) for all the nodes that are free
  const freeNodes = [];

  // ownNodes containes all the node objects (with some extra info) for all the nodes that are already ours
  const ownNodes = [];

  for (const direction of possibleDirections) {
    // `p` is short for possibleNode, so that is the node object for that direction
    const p = neighbouringNodes[direction];

    p.direction = direction;

    const sameNode = (n) => n.x == p.x && n.y == p.y && n.z == p.z;

    const claimed = claimedTerritory.some(sameNode);
    const enemyClaimed = enemyTerritory.some(sameNode);

    if (!claimed && !enemyClaimed) freeNodes.push(p)
    if (!enemyClaimed) ownNodes.push(p)
  }

  // Determine which node we want to move to.

  let finalDecision;
  let reason;

  if (freeNodes.length != 0) {
    // Check which nodes are neither potential enemies or
    // already claimed. If any, pick a random one.
    finalDecision = random(freeNodes).direction;
    reason = "free";
  } else if (backtrack.length != 0) {
    // If there are no free nodes, backtrack (if we can), so we can find a space
    // where there is a free enemy node
    finalDecision = backtrack.pop();
    backtrackIter++;
    reason = "backtrack";
  } else {
    // If we detect there are no options left, at least stay in our
    // own territory, so we never enter enemy territory
    finalDecision = random(ownNodes).direction;
    reason = "stuck";
  }

  // prompt("Next?");

  // console.log(
  //   `[${iterCounter}] coords: ${node.x},${node.y},${node.z} move: ${finalDecision} (${reason}) ter: ${territory.size}`
  // );

  console.log(
    `Astreaus: total territory (estimate): ${claimedTerritory.length - backtrackIter}, iter: ${roundIter}, backtrack: ${backtrackIter}`
  );

  // Unless we are already backtracking, push the move 
  // that would be needed to backtrack
  if (reason !== "backtrack") {
    backtrack.push(opposites[finalDecision]);
  }

  return finalDecision;
};
