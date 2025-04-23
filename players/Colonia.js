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

export const Colonia = function (myName, myNode, enemyNode) {
    step();
};
