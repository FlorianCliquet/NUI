import numpy as np
import matplotlib.pyplot as plt

# Parameters
nb_node = 2
center = (0.5, 0.5)  # Central node
radius = 0.5         # Radius of the surrounding nodes
if nb_node == 1:
    print("only the central node")
else:
    angle = 360 / (nb_node - 1)

# Initialize the list with the center node
nodes = [center]

# Calculate positions of the surrounding nodes
for i in range(nb_node - 1):
    theta = np.radians(angle * i)
    x = center[0] + radius * np.cos(theta)
    y = center[1] + radius * np.sin(theta)
    nodes.append((x, y))

# Print the node positions
for node in nodes:
    print(node)
# Plotting the nodes
nodes = np.array(nodes)
plt.figure(figsize=(6, 6))
plt.plot(nodes[:, 0], nodes[:, 1], 'o')  # Plot nodes as points

# Highlight the central node
plt.plot(center[0], center[1], 'ro')  # Central node in red

# Draw lines connecting the center node to the surrounding nodes
for node in nodes[1:]:
    plt.plot([center[0], node[0]], [center[1], node[1]], 'k-')

# Set plot limits and show the plot
plt.xlim(0, 1)
plt.ylim(0, 1)
plt.gca().set_aspect('equal', adjustable='box')
plt.title('Central Node with Surrounding Nodes in a Circle')
plt.show()
