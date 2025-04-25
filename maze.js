const center = {
    x: 0,
    y: 0,
    z: 0,
    nodes: Array.from({ length: 6 }),
};

const right = { x: 1, y: 0, z: 0, id: 0 }
const left = { x: -1, y: 0, z: 0, id: 1 }
const down = { x: 0, y: 1, z: 0, id: 2 }
const up = { x: 0, y: -1, z: 0, id: 3 }
const forward = { x: 0, y: 0, z: 1, id: 4 }
const backward = { x: 0, y: 0, z: -1, id: 5 }

right.inverse = left;
left.inverse = right;
forward.inverse = backward;
backward.inverse = forward;
up.inverse = down;
down.inverse = up;

const directions3D = [
    right,
    left,
    up,
    down,
    forward,
    backward,
];

function createNode(allNodes, x, y, z) {
    const newNode = {
        x: x,
        y: y,
        z: z,
        nodes: Array.from({ length: 6 })
    };
    allNodes[`${x}${y}${z}`] = newNode;

    for (const direction of directions3D) {
        const locationHash = `${x + direction.x}${y + direction.y}${z + direction.z}`
        const otherNode = allNodes[locationHash];
        if (otherNode) {
            newNode.nodes[direction.id] = otherNode;
            otherNode.nodes[direction.inverse.id] = newNode;
        }
    }
    return newNode;
}


function explodeCenter(allNodes, node, explosions) {

    for (const direction of directions3D) {

        const x = node.x + direction.x;
        const y = node.y + direction.y;
        const z = node.z + direction.z;

        if (allNodes[`${x}${y}${z}`]) {
            continue;
        }

        const newNode = createNode(
            allNodes,
            x,
            y,
            z
        );
        node.nodes[direction.id] = newNode;

        if (explosions < 20) {
            explodeCenter(allNodes, newNode, explosions + 1);
        }
    }
}

const allNodes = (function () {
    const nodesByLocation = {
        "000": center
    };
    explodeCenter(nodesByLocation, center, 0);


    let i = 0;
    for (const node of Object.values(nodesByLocation)) {
        const nodes = node.nodes;

        node.id = i;
        node.left = nodes[left.id] || null;
        node.right = nodes[right.id] || null;
        node.up = nodes[up.id] || null;
        node.down = nodes[down.id] || null;
        node.forward = nodes[forward.id] || null;
        node.backward = nodes[backward.id] || null;

        delete node.nodes;
        Object.freeze(node);

        i++;
    }

    return Object.values(nodesByLocation);
})();

const randomNode = () => allNodes[Math.floor(allNodes.length * Math.random())];

export const maze = allNodes;

export const distinctRandomNodes = () => {
    const r1 = randomNode();
    let r2 = randomNode();
    while (r1.x === r2.x && r1.y === r2.y && r1.z === r2.z) {
        r2 = randomNode();
    }
    return [r1, r2];
}