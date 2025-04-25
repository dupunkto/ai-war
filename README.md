# AI war

We are batteling against our amazing CS teacher to build an the best algorithm/AI to conquer an 3D maze.

We built 2 algorithms: **Astreaus** (a very logical algorithm) and **Colonia** (a neural network).

To run Colonia, you'll have to build the Zig libary. Make sure that [you have Zig installed](https://ziglang.org/learn/getting-started/). Then run `zig build-lib players/Colonia.zig -dynamic -OReleaseFast -lc -femit-bin="libColonia.so"` (for Linux and macOS) or `zig build-lib players/Colonia.zig -dynamic -OReleaseFast -lc -femit-bin="libColonia.dll"` (for normal people (Windows)).

## The original challenge

> You are battling for dominance inside an imperfect 3d maze.  
> You can not enter where your enemy has gone before.  
> Both you and your enemy have been assigned a random starting location.  
>
> You can only specify one of six directions that you want to explore.  
> After you got to pick one direction it is up to your enemy to make the same choice.  
> Collect as much territory as possible to destroy your rival AI!  
>
> Run game.js to get started. Replace one of the two existing AIs to train your own AI for dominance.  
