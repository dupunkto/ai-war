const std = @import("std");
const assert = std.debug.assert;
const Allocator = std.mem.Allocator;

fn matadd(a: []const f32, b: []const f32, c: []f32) void {
    for (a, b, c) |l, r, *d|
        d.* = l + r;
}

fn matmul(a: []const f32, b: []const f32, c: []f32, n: usize, m: usize, p: usize) void {
    assert(a.len == n * m);
    assert(b.len == m * p);
    assert(c.len == n * p);

    for (0..n) |i|
    for (0..p) |j| {
        var sum: f32 = 0.0;
        for (0..m) |k|
            sum += a[m*i+k] * b[p*k+j];
        c[p*i+j] = sum;
    };
}

fn relu(outputs: []f32) void {
    for (outputs) |*output|
        output.* = @max(0, output.*);
}

fn softmax(outputs: []f32) void {
    const max = std.mem.max(f32, outputs);
    var sum: f32 = 0.0;
    for (outputs) |output|
        sum += std.math.exp(output - max);
    for (outputs) |*output|
        output.* = std.math.exp(output.* - max) / sum;
}

const Layer = struct {
    activation: *const fn ([]f32) void,
    weights: []f32,
    biases: []f32,

    fn init(allocator: Allocator, inputs: usize, neurons: usize, activation: *const fn ([]f32) void) !Layer {
        return .{
            .activation = activation,
            .weights = try allocator.alloc(f32, inputs*neurons),
            .biases = try allocator.alloc(f32, neurons),
        };
    }

    fn forward(self: Layer, allocator: Allocator, inputs: []const f32) ![]f32 {
        const p = self.biases.len;
        const m = self.weights.len / p;
        const n = inputs.len / m;

        const out = try allocator.alloc(f32, n*p);
        matmul(inputs, self.weights, out, n, m, p);
        matadd(out, self.biases, out);
        self.activation(out);
        return out;
    }
};

const Network = struct {
    layers: []Layer,

    fn init(allocator: Allocator, design: []const usize, activations: []const *const fn ([]f32) void) !Network {
        const net = Network{ .layers = try allocator.alloc(Layer, design.len-1) };
        for (net.layers, activations, 0..) |*layer, activation, i|
            layer.* = try Layer.init(allocator, design[i], design[i+1], activation);
        return net;
    }

    fn step(self: Network, allocator: Allocator, initial: *const [18]f32) ![]const f32 {
        var inputs: []const f32 = initial;
        for (self.layers) |layer|
            inputs = try layer.forward(allocator, inputs);
        return inputs;
    }
};

var network: ?Network = null;

export fn step(
    x0: f32,
    y0: f32,
    z0: f32,
    c00: bool,
    c01: bool,
    c02: bool,
    c03: bool,
    c04: bool,
    c05: bool,
    x1: f32,
    y1: f32,
    z1: f32,
    c10: bool,
    c11: bool,
    c12: bool,
    c13: bool,
    c14: bool,
    c15: bool,
) [*:0]const u8 {
    const allocator = std.heap.page_allocator;
    const net = network.?;

    const result = net.step(allocator, &.{
        x0,
        y0,
        z0,
        @floatFromInt(@intFromBool(c00)),
        @floatFromInt(@intFromBool(c01)),
        @floatFromInt(@intFromBool(c02)),
        @floatFromInt(@intFromBool(c03)),
        @floatFromInt(@intFromBool(c04)),
        @floatFromInt(@intFromBool(c05)),
        x1,
        y1,
        z1,
        @floatFromInt(@intFromBool(c10)),
        @floatFromInt(@intFromBool(c11)),
        @floatFromInt(@intFromBool(c12)),
        @floatFromInt(@intFromBool(c13)),
        @floatFromInt(@intFromBool(c14)),
        @floatFromInt(@intFromBool(c15)),
    }) catch @panic("ong i couldnt be bothered to write a good msg here");

    const dirs: []const [*:0]const u8 = &.{"left", "right", "up", "down", "forward", "backward"};
    return dirs[std.mem.indexOfMax(f32, result)];
}

export fn init() void {
    const allocator = std.heap.page_allocator;

    network = Network.init(
        allocator,
        &.{18, 10, 10, 6},
        &.{relu, relu, softmax}
    ) catch @panic("Error creating global network");
}
