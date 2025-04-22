// first direction
export const Astraeus = function (myName, myNode, enemyNode) {
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
    return possibleDirections[0];
}