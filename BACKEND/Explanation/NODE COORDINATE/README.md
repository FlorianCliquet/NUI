# NODE COORDINATE

## Mathematical Logic Explanation

The "NODE COORDINATE" script calculates the coordinates for a central node (router) surrounded by a specified number of surrounding nodes arranged in a circular layout. Here's how it works:

### Parameters Initialization
- `nb_node`: Represents the total number of nodes, including the central node.
- `center`: Denotes the coordinates of the central node.
- `radius`: Defines the radius of the circular layout.

### Angle Calculation
- If there's only one node, the script sets the angle to 0 to avoid division by zero.
- If there are multiple nodes, it calculates the angle between nodes in degrees using the formula: `angle = 360 / (nb_node - 1)`.

### Node Position Calculation
- For each surrounding node, the script iterates through a loop to calculate its position.
- It uses polar coordinates to determine the position of each node relative to the center.
- The angle between nodes determines the direction of placement, while the radius determines the distance from the center.
- The formula used for conversion to Cartesian coordinates is:
  - `x = center[0] + radius * np.cos(theta)`
  - `y = center[1] + radius * np.sin(theta)`

### Plotting
- After calculating the node positions, the script plots them using matplotlib.
- It represents the central node and surrounding nodes as points on a 2D plane.
- Lines are drawn to connect the central node to each surrounding node, forming a network layout.

This mathematical logic ensures that the nodes are evenly spaced around the central node in a circular arrangement, facilitating network visualization and analysis.
