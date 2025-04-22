let iterCounter = 0;
let relativeZ = 0;

const claimedTerritory = [];
const enemyTerritory = [];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const Astraeus = function (myName, node, enemyNode) {
  iterCounter++;

  // node is where we are now.
  // enemyNode is where the enemy is now.

  node.z = relativeZ;

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
    // `p` is short for possibleNode
    const p = neighbouringNodes[direction];

    p.potentialEnemyNode = enemyTerritory.some((n) => n.x == p.x && n.y == p.y);
    p.alreadyClaimed = claimedTerritory.some(
      (n) => n.x == p.x && n.y == p.y && n.z == p.z
    );

    const debug = claimedTerritory.filter(
      (n) => n.x == p.x && n.y == p.y && n.z == p.z
    );

    console.log(`alreadyClaimedlen: ${debug.length} and ${p.alreadyClaimed}`);

    p.direction = direction;
    possibleMoves.push(p);
  }

  // Determine which node we want to move to.

  let finalDecision;
  let basedOn;

  const freeMoves = possibleMoves.filter(
    (n) => !n.alreadyClaimed && !n.potentialEnemyNode
  );

  const dangerousButFree = possibleMoves.filter(
    (n) => !n.alreadyClaimed && n.potentialEnemyNode
  );

  const lastResortMoves = possibleMoves.filter(
    (n) => !freeMoves.includes(n) && !dangerousButFree.includes(n)
  );

  if (freeMoves.length != 0) {
    // Check which nodes are neither potential enemies or
    // already claimed. If any, pick a random one.
    finalDecision = random(freeMoves).direction;
    basedOn = "free";
  } else if (dangerousButFree.length != 0) {
    // Otherwise, prefer a potential enemy node over an
    // already claimed node.
    finalDecision = random(dangerousButFree).direction;
    basedOn = "risky";
  } else {
    // If we boxed ourselves in, just do *something*.
    finalDecision = random(lastResortMoves).direction;
    basedOn = "last-resort";
  }

  // Keep track of where we are relative to our starting
  // position.
  if (finalDecision == "up") relativeZ -= 1;
  if (finalDecision == "down") relativeZ += 1;

  console.log(
    `[${iterCounter}] Am at ${node.x},${node.y},${
      node.z
    }, moving ${finalDecision} to ${JSON.stringify(
      neighbouringNodes[finalDecision]
    )} because ${basedOn}`
  );

  return finalDecision;
};
