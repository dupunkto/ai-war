let roundIter = 0;
let backtrackIter = 0;

const claimedTerritory = [];
const enemyTerritory = [];

const backtrack = []; // Backtrack contains the opposite of those moves.

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

  const possibleDirections = [];

  if (node.left) possibleDirections.push("left");
  if (node.right) possibleDirections.push("right");
  if (node.up) possibleDirections.push("up");
  if (node.down) possibleDirections.push("down");
  if (node.forward) possibleDirections.push("forward");
  if (node.backward) possibleDirections.push("backward");

  const possibleMoves = [];

  for (const direction of possibleDirections) {
    // `p` is short for possibleNode.
    const p = neighbouringNodes[direction];
    const x = (n) => n.x == p.x && n.y == p.y && n.z == p.z;

    p.claimed = claimedTerritory.some(x);
    p.enemyClaimed = enemyTerritory.some(x);

    p.direction = direction;
    possibleMoves.push(p);
  }

  // Determine which node we want to move to.

  let finalDecision;
  let reason;

  const freeMoves = possibleMoves.filter((n) => !n.claimed && !n.enemyClaimed);
  const ownMoves = possibleMoves.filter((n) => !n.enemyClaimed);

  if (freeMoves.length != 0) {
    // Check which nodes are neither potential enemies or
    // already claimed. If any, pick a random one.
    finalDecision = random(freeMoves).direction;
    reason = "free";
  } else if (backtrack.length != 0) {
    // If we find a dead-end, backtrack until we find an free space.
    finalDecision = backtrack.pop();
    backtrackIter++;
    reason = "backtrack";
  } else {
    // If we detect there are no options left, at least stay in our
    // own territory.
    finalDecision = random(ownMoves).direction;
    reason = "stuclk";
  }

  let territory = new Set();

  for (const c of claimedTerritory) {
    // `c` is short for claimedNode.
    territory.add(`${c.x},${c.y},${c.z}`);
  }

  // prompt("Next?");

  // console.log(
  //   `[${iterCounter}] coords: ${node.x},${node.y},${node.z} move: ${finalDecision} (${reason}) ter: ${territory.size}`
  // );

  console.log(
    `territory: ${territory.size} iter: ${roundIter} backtrack: ${backtrackIter}`
  );

  if (reason != "backtrack") {
    if (finalDecision == "left") backtrack.push("right");
    if (finalDecision == "right") backtrack.push("left");
    if (finalDecision == "up") backtrack.push("down");
    if (finalDecision == "down") backtrack.push("up");
    if (finalDecision == "forward") backtrack.push("backward");
    if (finalDecision == "backward") backtrack.push("forward");
  }

  return finalDecision;
};
