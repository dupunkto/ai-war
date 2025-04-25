// (random) BEST direction
import { play } from "../maze.js";
import { Astraeus } from "./Astraeus.js";

import { dlopen, FFIType, JSCallback, suffix } from "bun:ffi";
const { u32, f32, bool, cstring, callback } = FFIType;
const {
    symbols: { init, deinit, step, train },
} = dlopen(`libColonia.${suffix}`, {
    init: {
        args: [],
        returns: "void",
    },
    deinit: {
        args: [],
        returns: "void",
    },
    step: {
        args: [u32, f32, f32, f32, bool, bool, bool, bool, bool, bool, f32, f32, f32, bool, bool, bool, bool, bool, bool],
        returns: cstring
    },
    train: {
        args: [u32, callback],
        returns: "void",
    },
});

const better = new JSCallback(
    (lhs, rhs) => {
        const res = play("lhs", makeStep(lhs+1), "rhs", makeStep(rhs+1));
        const loss1 = res.player1.lossCondition.unsupportedAction || res.player1.lossCondition.forbiddenAction;
        const loss2 = res.player2.lossCondition.unsupportedAction || res.player2.lossCondition.forbiddenAction;

        if (!loss1 && loss2) return true;
        if (loss1 && !loss2) return false;
        return res.player1.points >= res.player2.points;
    },
    {
        args: [u32, u32],
        returns: bool,
    },
);

const makeStep = function(index) {
    return function (myName, myNode, enemyNode) {
        step(
            index,
            myNode.x,
            myNode.y,
            myNode.z,
            myNode.left,
            myNode.right,
            myNode.up,
            myNode.down,
            myNode.forward,
            myNode.backward,
            enemyNode.x,
            enemyNode.y,
            enemyNode.z,
            enemyNode.left,
            enemyNode.right,
            enemyNode.up,
            enemyNode.down,
            enemyNode.forward,
            enemyNode.backward,
        );
    }
};

init();
//train(100, better); // Disabled for debug purposes

export const Colonia = makeStep(0);
