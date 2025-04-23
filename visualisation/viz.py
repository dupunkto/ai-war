import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.animation as animation
import json

with open("coordinates_player1.json") as jf1:
    coords1 = json.load(jf1)

with open("coordinates_player2.json") as jf2:
    coords2 = json.load(jf2)

coordinates1 = [tuple(map(int, item.split(','))) for item in coords1]
coordinates2 = [tuple(map(int, item.split(','))) for item in coords2]

all_coords = coordinates1 + coordinates2
all_x = [pt[0] for pt in all_coords]
all_y = [pt[1] for pt in all_coords]
all_z = [pt[2] for pt in all_coords]

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')

ax.set_xlim(min(all_x), max(all_x))
ax.set_ylim(min(all_y), max(all_y))
ax.set_zlim(min(all_z), max(all_z))

# Player 1
x1_vals, y1_vals, z1_vals = [], [], []
line1, = ax.plot([], [], [], lw=2, color='blue', marker='o', label='Player 1')

# Player 2
x2_vals, y2_vals, z2_vals = [], [], []
line2, = ax.plot([], [], [], lw=2, color='red', marker='^', label='Player 2')

ax.legend()

def init():
    line1.set_data([], [])
    line1.set_3d_properties([])
    line2.set_data([], [])
    line2.set_3d_properties([])
    return line1, line2

def update(num):
    if num < len(coordinates1):
        x1_vals.append(coordinates1[num][0])
        y1_vals.append(coordinates1[num][1])
        z1_vals.append(coordinates1[num][2])
        line1.set_data(x1_vals, y1_vals)
        line1.set_3d_properties(z1_vals)
    
    if num < len(coordinates2):
        x2_vals.append(coordinates2[num][0])
        y2_vals.append(coordinates2[num][1])
        z2_vals.append(coordinates2[num][2])
        line2.set_data(x2_vals, y2_vals)
        line2.set_3d_properties(z2_vals)

    return line1, line2

# The lens should be the same, but just in case
max_frames = max(len(coordinates1), len(coordinates2))

ani = animation.FuncAnimation(fig, update, frames=max_frames, init_func=init, blit=True, interval=50)

ani.save('ani.mp4', writer='ffmpeg', fps=20)

print("Completed")

plt.show()
