import matplotlib.pyplot as plt
import networkx as nx
from maze_generator import MazeGenerator  # Assuming your script is saved as mazegen.py

# Define a color map for your categories
category_color_map = {
    'Default': 'gray',
    'Empty': 'white',
    'Shortcut': 'blue',
    'Loop': 'green',
    'Start': 'yellow',
    'End': 'red',
    # Add other category colors as needed
}

def draw_maze(maze):
    G = nx.Graph()

    # ... [rest of your existing code for adding nodes and edges]

    # Here, replace the category names with actual colors using the map
    colors = [category_color_map[cell[1]['category']] for cell in G.nodes(data=True)]

    # ... [rest of your existing code for drawing the graph]

    plt.show()

def main():
    generator = MazeGenerator()
    generator.generate()
    draw_maze(generator)

if __name__ == "__main__":
    main()