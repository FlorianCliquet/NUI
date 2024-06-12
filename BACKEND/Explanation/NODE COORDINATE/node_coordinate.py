#--------------------------------->[IMPORT]<------------------------------------------#
import numpy as np
import matplotlib.pyplot as plt
#-------------------------------------------------------------------------------------#



#--------------------------------->[PARAMETERS]<--------------------------------------#
# Initialize the number of nodes found by nmap , the central node is part of the nb_node
nb_node = 200

# We define the center of the circle as the router node
center = (0.5, 0.5)  # Central node (router) position
radius = 0.5         # Radius of the surrounding nodes

# If there is only one node, we only have the router node and to avoid division by zero
# we set the angle to 0
if nb_node == 1:
    print("only the central node")
    angle = 0

# If there are more than one node, we calculate the angle between the nodes in degrees
else:
    angle = 360 / (nb_node - 1)

# Initialize the list with the center node
nodes = [center]

#-------------------------------------------------------------------------------------#

#--------------------------------->[CALCULATIONS]<------------------------------------#

# Calculate positions of the surrounding nodes by evenly spacing them around the center node
for i in range(nb_node - 1):
    theta = np.radians(angle * i)
    x = center[0] + radius * np.cos(theta)
    y = center[1] + radius * np.sin(theta)
    nodes.append((x, y))

# Print the node positions 
for node in nodes:
    print(node)
#-------------------------------------------------------------------------------------#

#--------------------------------->[PLOTTING]<----------------------------------------#
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

#-------------------------------------------------------------------------------------#