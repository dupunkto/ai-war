// TODO optimize for performance
export const play = function (playerName1, playerFunc1, playerName2, playerFunc2) {
  const center = {
    x: 0,
    y: 0,
    z: 0,
    nodes: Array.from({ length: 6 }),
  };

  const right = { x: 1, y: 0, z: 0, id: 0 };
  const left = { x: -1, y: 0, z: 0, id: 1 };
  const down = { x: 0, y: 1, z: 0, id: 2 };
  const up = { x: 0, y: -1, z: 0, id: 3 };
  const forward = { x: 0, y: 0, z: 1, id: 4 };
  const backward = { x: 0, y: 0, z: -1, id: 5 };

  right.inverse = left;
  left.inverse = right;
  forward.inverse = backward;
  backward.inverse = forward;
  up.inverse = down;
  down.inverse = up;

  const directions2D = [right, left, up, down];

  const directions3D = [...directions2D, forward, backward];

  const directionsShuffled = [
    [up, down, left, right, forward, backward],
    [down, up, left, right, forward, backward],
    [down, left, up, right, forward, backward],
    [down, left, right, up, forward, backward],
    [down, left, right, forward, up, backward],
    [down, left, right, forward, backward, up],
    [left, down, right, forward, backward, up],
    [left, right, down, forward, backward, up],
    [left, right, forward, down, backward, up],
    [left, right, forward, backward, down, up],
    [left, right, forward, backward, up, down],
    [right, left, forward, backward, up, down],
    [right, forward, left, backward, up, down],
    [right, forward, backward, left, up, down],
    [right, forward, backward, up, left, down],
    [right, forward, backward, up, down, left],
    [forward, right, backward, up, down, left],
    [right, forward, backward, up, down, left],
    [right, backward, forward, up, down, left],
    [right, backward, up, forward, down, left],
    [right, backward, up, down, forward, left],
    [right, backward, up, down, left, forward],
    [backward, right, up, down, left, forward],
    [right, backward, up, down, left, forward],
    [right, up, backward, down, left, forward],
    [right, up, down, backward, left, forward],
    [right, up, down, left, backward, forward],
    [right, up, down, left, forward, backward],
  ];

  function createNode(allNodes, x, y, z) {
    const existingNode = allNodes[`${x},${y},${z}`];
    if (existingNode) {
      return existingNode;
    }

    const newNode = {
      x: x,
      y: y,
      z: z,
      nodes: Array.from({ length: 6 }),
    };
    allNodes[`${x},${y},${z}`] = newNode;

    for (const direction of directions3D) {
      const locationHash = `${x + direction.x},${y + direction.y},${z + direction.z}`;
      const otherNode = allNodes[locationHash];
      if (otherNode) {
        newNode.nodes[direction.id] = otherNode;
        otherNode.nodes[direction.inverse.id] = newNode;
      }
    }
    return newNode;
  }

  function randomDirections(node, amount) {
    const newDirections = [];
    const r =
      directionsShuffled[Math.floor(Math.random() * directionsShuffled.length)];
    for (const direction of r) {
      const xn = node.x + direction.x;
      const yn = node.y + direction.y;
      const zn = node.z + direction.z;

      if (!allNodes[`${xn},${yn},${zn}`]) {
        newDirections.push(direction);
      }
    }
    if (newDirections.length < amount) {
      return newDirections;
    }
    return newDirections.slice(amount);
  }

  function explodeCenter(allNodes, directions, node, explosions) {
    for (const direction of directions) {
      const x = node.x + direction.x;
      const y = node.y + direction.y;
      const z = node.z + direction.z;

      if (allNodes[`${x},${y},${z}`]) {
        continue;
      }

      const newNode = createNode(allNodes, x, y, z);
      node.nodes[direction.id] = newNode;

      if (explosions >= 400) {
        continue;
      } else if (explosions < 2) {
        explodeCenter(allNodes, directions3D, newNode, explosions + 1);
      } else {
        const amount = Math.round(1.0 + Math.random() * 5);
        const r = randomDirections(newNode, amount);
        explodeCenter(allNodes, r, newNode, explosions + 1);
      }
    }
  }

  const allNodes = {
    "0,0,0": center,
  };
  explodeCenter(allNodes, directions2D, center, 0);

  for (const node of Object.values(allNodes)) {
    const nodes = node.nodes;

    node.left = nodes[left.id] || null;
    node.right = nodes[right.id] || null;
    node.up = nodes[up.id] || null;
    node.down = nodes[down.id] || null;
    node.forward = nodes[forward.id] || null;
    node.backward = nodes[backward.id] || null;
    delete node.nodes;
  }

  function readonlyNode(node) {
    return {
      x: node.x,
      y: node.y,
      z: node.z,
      left: !!node.left,
      right: !!node.right,
      up: !!node.up,
      down: !!node.down,
      forward: !!node.forward,
      backward: !!node.backward,
      owner: node.owner,
    };
  }

  let keys = Object.keys(allNodes);
  let player1 = allNodes[keys[Math.floor(Math.random() * keys.length)]];
  let player2 = allNodes[keys[Math.floor(Math.random() * keys.length)]];
  player1.owner = playerName1;
  player2.owner = playerName2;

  const rounds = keys.length * 4;
  const result = {
    nodeCount: keys.length,
    rounds,
    roundsPlayed: 0,
    player1: {
      name: playerName1,
      start: readonlyNode(player1),
      points: 0,
      lossCondition: {
        unsupportedAction: false,
        forbiddenAction: false,
        points: false,
      },
    },
    player2: {
      name: playerName2,
      start: readonlyNode(player2),
      points: 0,
      lossCondition: {
        unsupportedAction: false,
        forbiddenAction: false,
        points: false,
      },
    },
    victor: null,
  };


  for (let i = 0; i < rounds; i++) {
    let direction = playerFunc1(
      playerName1,
      readonlyNode(player1),
      readonlyNode(player2),
    );
    player1 = player1[direction];

    if (!player1 || typeof player1.x !== "number") {
      result.victor = result.player2;
      result.player1.lossCondition.unsupportedAction = true;
      break;
    }
    if (player1.owner === playerName2) {
      result.victor = result.player2;
      result.player1.lossCondition.forbiddenAction = true;
      break;
    }
    player1.owner = playerName1;

    direction = playerFunc2(
      playerName2,
      readonlyNode(player2),
      readonlyNode(player1),
    );
    player2 = player2[direction];

    if (!player2 || typeof player2.x !== "number") {
      result.victor = result.player1;
      result.player2.lossCondition.unsupportedAction = true;
      break;
    }
    if (player2.owner === playerName1) {
      result.victor = result.player1;
      result.player2.lossCondition.forbiddenAction = true;
      break;
    }
    player2.owner = playerName2;

    result.roundsPlayed = i + 1;
  }

  for (const node of Object.values(allNodes)) {
    if (node.owner === playerName1) {
      result.player1.points++;
    } else if (node.owner === playerName2) {
      result.player2.points++;
    }
  }

  if (result.player1.points > result.player2.points) {
    result.player2.lossCondition.points = true;
    result.victor = result.player1;
  } else if (result.player1.points < result.player2.points) {
    result.player1.lossCondition.points = true;
    result.victor = result.player2;
  }

  return result;
};
