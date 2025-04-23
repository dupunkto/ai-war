let weightsByLocation = {};
const dangerous = 99999999;

export const Teacher = function (myName, myNode, enemyNode) {
    if (myName === null) {
        weightsByLocation = {};
        return;
    }

    weightsByLocation[`${enemyNode.x}${enemyNode.y}${enemyNode.z}`] = dangerous;
   
    const directions = {
        left: { x: myNode.x - 1, y: myNode.y, z: myNode.z },
        right: { x: myNode.x + 1, y: myNode.y, z: myNode.z },
        up: { x: myNode.x, y: myNode.y - 1, z: myNode.z },
        down: { x: myNode.x, y: myNode.y + 1, z: myNode.z },
        forward: { x: myNode.x, y: myNode.y, z: myNode.z - 1 },
        backward: { x: myNode.x, y: myNode.y, z: myNode.z + 1 },
    };

    const possibleDirections = []
    for(const [k, v] of Object.entries(directions)) {
        if(!myNode[k]) {
            continue;
        }
        const locationHash = `${v.x}${v.y}${v.z}`;
        const existingWeight = weightsByLocation[locationHash]
        possibleDirections.push({
            name: k,
            weight: existingWeight || 0,
            locationHash
        });
    }
    possibleDirections.sort((a, b) => a.weight - b.weight);
    const direction = possibleDirections[0];
    weightsByLocation[direction.locationHash] = (weightsByLocation[direction.locationHash] || 0) + 1;
    return direction.name;
}