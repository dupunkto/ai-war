const randomDirection = function (myNode, enemyNode) {
    console.log(myNode);
    const possibleDirections = [];
    if (myNode.left) {
        possibleDirections.push('left');
    }
    if (myNode.right) {
        possibleDirections.push('right');
    }
    if (myNode.up) {
        possibleDirections.push('up');
    }
    if (myNode.down) {
        possibleDirections.push('down');
    }
    if (myNode.forward) {
        possibleDirections.push('forward');
    }
    if (myNode.backward) {
        possibleDirections.push('backward');
    }
    return possibleDirections[ Math.floor(Math.random() * possibleDirections.length)];
}

export const RandomDirection = {
    name: 'RandomDirection',
    algorithm: () => randomDirection,
}