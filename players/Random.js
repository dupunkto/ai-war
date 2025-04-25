const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

function factory() {
  return function (node, enemyNode) {
    const possibleDirections = [];

    if (node.left) possibleDirections.push("left");
    if (node.right) possibleDirections.push("right");
    if (node.up) possibleDirections.push("up");
    if (node.down) possibleDirections.push("down");
    if (node.forward) possibleDirections.push("forward");
    if (node.backward) possibleDirections.push("backward");

    return random(possibleDirections);
  }
}

export const Random = {
  name: 'Random',
  algorithm: factory,
}
