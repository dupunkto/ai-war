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

fn main(allocator: Allocator) ![:0]const u8 {
    const net = try Network.init(
        allocator,
        &.{18, 10, 10, 6},
        &.{relu, relu, softmax}
    );

    const result = try net.step(allocator, &.{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0});
    _ = result;
    return "Hello World xD";
    //return std.fmt.allocPrintZ(allocator, "list: {any}\n", .{result});
}

export fn hello() [*:0]const u8 {
    const allocator = std.heap.page_allocator;

    return main(allocator) catch |err| std.debug.panic("Found error: {}", .{err});
}
