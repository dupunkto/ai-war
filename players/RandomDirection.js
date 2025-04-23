// random direction
export const RandomDirection = function (myName, myNode, enemyNode) {
    if(myName === null) {
        return;
    }

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

    const i = Math.floor(Math.random() * possibleDirections.length);
    return possibleDirections[i];
}