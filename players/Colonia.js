// (random) BEST direction
import { dlopen, FFIType, suffix } from "bun:ffi";
const { f32, bool, cstring } = FFIType;
const lib = dlopen(`libColonia.${suffix}`, {
    init: {
        args: [],
        returns: FFIType.void,
    },
    step: {
        args: [f32, f32, f32, bool, bool, bool, bool, bool, bool, f32, f32, f32, bool, bool, bool, bool, bool, bool],
        returns: cstring
    },
});

const { init, step } = lib.symbols;

init();

export const ColoniaTrain = function() {
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

export const Colonia = function (myName, myNode, enemyNode) {
  network.inputs[0].value = +!!myNode.x;
  network.inputs[1].value = +!!myNode.y;
  network.inputs[2].value = +myNode.left;
  network.inputs[3].value = +myNode.right;
  network.inputs[4].value = +myNode.up;
  network.inputs[5].value = +myNode.down;
  network.inputs[6].value = +myNode.forward;
  network.inputs[7].value = +myNode.backward;

  network.inputs[8].value = +!!enemyNode.x;
  network.inputs[9].value = +!!enemyNode.y;
  network.inputs[10].value = +enemyNode.left;
  network.inputs[11].value = +enemyNode.right;
  network.inputs[12].value = +enemyNode.up;
  network.inputs[13].value = +enemyNode.down;
  network.inputs[14].value = +enemyNode.forward;
  network.inputs[15].value = +enemyNode.backward;

  return ["left", "right", "up", "down", "forward", "backward"][network.step()];
};
