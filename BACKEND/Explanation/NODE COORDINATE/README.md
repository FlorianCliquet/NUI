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

### Exemple case
Here's an example of the output of the script by different number of node :

#### nb_node = 1

```python3
only the central node
(0.5,0.5)
```
![graph for 1 node](../asset/NODE%20COORDINATE/1node.png)


#### nb_node = 5

```python3
(0.5, 0.5)
(1.0, 0.5)
(0.5, 1.0)
(0.0, 0.5000000000000001)
(0.4999999999999999, 0.0)
```
![graph for 5 node](../asset/NODE%20COORDINATE/5node.png)

#### nb_node = 50

```python3
(0.5, 0.5)
(1.0, 0.5)
(0.995895006911623, 0.563938580842253)
(0.9836474315195147, 0.6268272919547537)
[...]
(0.963458378673011, 0.3123664975603131)
(0.9836474315195147, 0.37317270804524627)
(0.995895006911623, 0.4360614191577471)
```
![graph for 50 node](../asset/NODE%20COORDINATE/50node.png)

#### nb_node = 200

```python3
(0.5, 0.5)
(1.0, 0.5)
(0.995895006911623, 0.563938580842253)
(0.9836474315195147, 0.6268272919547537)
(0.9634583786730109, 0.6876335024396871)
[...]
(0.9996433111605052, 0.4811171608976144)
(0.999841461153768, 0.48740977713993117)
(0.999960363717407, 0.49370438950077183)
```
![graph for 200 node](../asset/NODE%20COORDINATE/200node.png)
### Conclusion
We can see the for a large number of node the circle is not readable but as it's made to scan small / mid networks it's rarelry common to go up to more than 20 node per single router.