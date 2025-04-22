// (random) BEST direction

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

export class Neuron {
  constructor(bias) {
    this.value = 0;
    this.bias = bias;
  }
}

export class Connection {
  constructor(input, output, weight) {
    this.input = input;
    this.output = output;
    this.weight = weight;
  }
}

export class Network {
  constructor(inputs, outputs, neurons, conns) {
    this.inputs = new Array(inputs)
      .fill(0)
      .map((_) => new Neuron(Math.random() * 2 - 1));
    this.outputs = new Array(outputs)
      .fill(0)
      .map((_) => new Neuron(Math.random() * 2 - 1));
    this.neurons = new Array(neurons)
      .fill(0)
      .map((_) => new Neuron(Math.random() * 2 - 1));
    this.conns = new Array(conns)
      .fill(0)
      .map(
        (_) =>
          new Connection(
            this.neurons.random(),
            this.neurons.random(),
            Math.random() * 2 - 1
          )
      );
  }

  step() {
    let old = new Map();

    for (const input of this.inputs) old.set(input, input.value);
    for (const output of this.outputs) old.set(output, output.value);
    for (const neuron of this.neurons) old.set(neuron, Math.tanh(neuron.value));

    for (const conn of this.conns) {
      conn.output.value += old.get(conn.input) * conn.weight;
    }

    const values = this.outputs.map((o) => Math.tanh(o.value));
    return values.indexOf(Math.max(...values));
  }
}

let network = new Network(16, 6, 128, 256);

console.log(network);
console.log(
  ["left", "right", "up", "down", "forward", "backward"][network.step()]
);

export const Elysium = function (myName, myNode, enemyNode) {
  const possibleDirections = [];
  if (myNode.left) {
    possibleDirections.push("left");
  }
  if (myNode.right) {
    possibleDirections.push("right");
  }
  if (myNode.up) {
    possibleDirections.push("up");
  }
  if (myNode.down) {
    possibleDirections.push("down");
  }
  if (myNode.forward) {
    possibleDirections.push("forward");
  }
  if (myNode.backward) {
    possibleDirections.push("backward");
  }

  const i = Math.floor(Math.random() * possibleDirections.length);
  if (i >= possibleDirections.length) {
    console.log(myNode);
  }
  return possibleDirections[i];
};
