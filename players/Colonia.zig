const std = @import("std");
const Random = std.Random;
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
        const layers = try allocator.alloc(Layer, design.len-1);
        for (layers, activations, 0..) |*layer, activation, i|
            layer.* = try Layer.init(allocator, design[i], design[i+1], activation);
        return .{ .layers = layers };
    }

    fn deinit(self: Network, allocator: Allocator) void {
        for (self.layers) |layer| {
            allocator.free(layer.weights);
            allocator.free(layer.biases);
        }
        allocator.free(self.layers);
    }

    fn step(self: Network, allocator: Allocator, initial: *const [18]f32) ![]const f32 {
        var inputs: []const f32 = initial;
        for (self.layers) |layer|
            inputs = try layer.forward(allocator, inputs);
        return inputs;
    }

    fn move(self: Network, rhs: *Network) void {
        for (self.layers, rhs.layers) |src, *dst| {
            dst.activation = src.activation;
            std.mem.copyForwards(f32, src.weights, dst.weights);
            std.mem.copyForwards(f32, src.biases, dst.biases);
        }
    }

    fn mutate(self: Network, strength: f32) void {
        for (self.layers) |layer| {
            for (layer.weights) |*weight|
                weight.* += (random.float(f32) * 2 - 1) * strength;
            for (layer.biases) |*bias|
                bias.* += (random.float(f32) * 2 - 1) * strength;
        }

        std.debug.print(".", .{});
    }
};

var gpa = std.heap.DebugAllocator(.{}).init;
//var gpa = std.heap.GeneralPurposeAllocator(.{}).init;
var arena = std.heap.ArenaAllocator.init(gpa.allocator());

var training: [128]Network = undefined;
var network: Network = undefined;
var random: std.Random = std.crypto.random;

export fn train(
    iters: u32,
    better: *const fn(usize) callconv(.C) u32,
) void {
    const allocator = arena.allocator();

    for (0..iters) |round| {
        std.debug.print("Training round: {d}\n", .{round});
        trainStep(allocator, better) catch |err| std.debug.panic("frfr nocap: {}", .{err});
    }
}

fn trainStep(
    allocator: Allocator,
    better: *const fn(usize) callconv(.C) u32,
) !void {
    var pool: std.Thread.Pool = undefined;
    try pool.init(.{.allocator = allocator});

    var work: std.Thread.WaitGroup = undefined;
    work.reset();

    for (&training) |*net|
        network.move(net);
    for (&training) |net|
        try pool.spawn(Network.mutate, .{net, 0.5});
    pool.waitAndWork(&work);
    pool.deinit();
    std.debug.print("\n", .{});

    // Opponent Training
    //var buf: [training.len]u32 = undefined;
    //for (&buf, 0..) |*score, i| {
    //    std.debug.print("@", .{});
    //    score.* = better(i);
    //}

    //const index = std.mem.indexOfMax(u32, &buf);
    //training[index].move(&network);
    //std.debug.print("@\n", .{});

    // Tournament Training
    var buf = training;
    var len = training.len / 2;
    while (len >= 1) : (len /= 2) for (0..len) |i| {
        const res = better(2*i, 2*i+1);
        std.debug.print("@", .{});
        if (res) buf[2*i].move(&buf[i]) else buf[2*i+1].move(&buf[i]);
    };

    std.debug.print("@\n", .{});
    buf[0].move(&network);
}

export fn step(
    index: u32, // 0 = normal, else = training
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
    const net = switch (index) {
        0 => network,
        else => training[index-1],
    };

    const allocator = arena.allocator();
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
    const allocator = arena.allocator();

    network = Network.init(
        allocator,
        &.{18, 100, 6},
        &.{relu, softmax},
    ) catch @panic("Error creating global network");

    for (&training) |*net|
        net.* = Network.init(
            allocator,
            &.{18, 100, 6},
            &.{relu, softmax},
        ) catch @panic("Error creating global network");
}

export fn deinit() void {
    network.deinit(arena.allocator());
    for (&training) |*net|
        net.deinit(arena.allocator());
    _ = arena.deinit();
    _ = gpa.deinit();
}
