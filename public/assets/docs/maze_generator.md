# Maze Generation

This module implements a maze generation algorithm in TypeScript. It consists of several classes and enums which work together to create and manage a maze.


![User navigation](assets/docs/image/mazegen/mazegen2.gif "User navigation")

# Maze Generator User Manual

Welcome to the Maze Generator! This tool allows you to create custom mazes that you can use for games, puzzles, or any other project. Below is a guide to help you navigate through the features and settings.

## Getting Started

To begin generating your maze, adjust the following parameters according to your needs:

### Parameters Panel

- **Walls Padding**: Controls the space between the walls of the maze.
- **Walls Width**: Sets the thickness of the walls.
- **Path Width**: Adjusts the width of the paths within the maze.
- **Grid Size**: Determines the complexity of the maze by setting the number of cells.
- **Sparseness**: Controls how sparse the maze is; a higher value means fewer walls.
- **Dead-Ends Ratio**: Sets the frequency of dead-ends in the maze.
- **Shortcuts Ratio**: Adjusts the likelihood of shortcuts appearing in the maze.

![Parameter Panel](assets/docs/image/mazegen/mazegen_gui_1.jpg "Parameter Panel")

### Generation Options

- **Generation Order**: Choose the algorithm for maze generation from the dropdown (e.g., `Shift`, `Pop`).
- **Generation Seed**: Enter a number to use as a seed for the maze generation. This allows for reproducible results.

## Using the Applet

After setting your desired parameters:

1. Click on `Generate maze` to create a new maze.
2. The maze will be rendered in the main viewport.

### Understanding the Maze

The maze is comprised of different elements:

- **Start**: Marked with a `START` label, this is the entry point of the maze.
- **Finish**: Marked with a `FINISH` label, this is the goal or exit point of the maze.
- **Walls**: Indicated by colored lines, these are the barriers that form the paths of the maze.
- **Paths**: The open spaces between walls where movement is possible.
- **Dead-Ends**: Paths that lead to a closed end.
- **Forks**: Points where the path splits into two or more directions.
- **Shortcuts**: Direct paths that provide a quicker route through the maze.
- **Crossroads**: Points where multiple paths intersect.

![Viewport](assets/docs/image/mazegen/mazegen_main_1.jpg "Viewport")

## Tips and Tricks

- Experiment with different `Generation Seed` values to create unique mazes.
- Use the `Shortcuts Ratio` sparingly to maintain the challenge of the maze.
- Adjust the `Walls Width` and `Path Width` for a more intricate or more navigable maze, depending on your preference.

---

Enjoy creating your mazes with the Maze Generator!

# API Reference

## Enums

### ECellCategory

Defines categories for maze cells:

- `Empty`
- `Default`
- `Shortcut`
- `Loop`
- `Start`
- `End`

### ECellAccessibilityLevel

Describes the accessibility level of a cell within the maze:

- `Crossroad`
- `Fork`
- `Transitive`
- `DeadEnd`
- `Isolated`

### EGenerationOrder

Specifies the order in which cells are processed during generation:

- `Pop`
- `Shift`
  
## Classes

### MazeCell

Represents a single cell within the maze.

#### Properties

- `index`: Optional index of the cell.
- `x, y`: Coordinates of the cell in the maze.
- `walls`: Object defining the presence of walls around the cell.
- `hovered`: Boolean indicating if the cell is currently hovered over.
- `category`: Category of the cell from ECellCategory.
- `visited`: Boolean indicating if the cell has been visited during generation or traversal.

#### Methods

- `get_closed_neighbours()`: Returns a list of adjacent cells that are separated by walls.
- `get_open_neighbours()`: Returns a list of adjacent cells that are not separated by walls.
- `get_all_neighbours()`: Returns all adjacent cells regardless of walls.
- `remove_wall_between()`, `add_wall_between()`, `set_wall_between()`: Manage walls between cells.
- `get_wall_between()`: Determines if there is a wall between the current cell and another cell.

### MazeGenerator

Responsible for generating and managing the maze structure.

#### Properties

- `cells`: Two-dimensional array of MazeCell.
- `start_cell`, `end_cell`: MazeCell instances marking the start and end of the maze.
  
Configuration parameters like seed, `grid_size`, `sparseness`, `dead_ends_ratio`, `shortcuts_ratio`, and `generation_order`.

#### Methods

- `generate()`: Initializes and generates the maze.
- `find_cells_with_accessibility()`: Finds cells with a specific accessibility level.
- `reset_visited()`: Resets the visited property of all cells.
- `for_each_cell()`: Executes a callback function on each cell in the maze.

## Functionality Overview

The MazeGenerator class initializes a grid of MazeCell objects based on the specified grid size.
Maze generation is based on random selection of cells and walls, controlled by the seed property for reproducible results.

The algorithm creates paths by removing walls between cells and marks special cells as start, end, loops, shortcuts, etc., based on the generation logic.
The module allows for customization of the maze's complexity and structure through various parameters like sparseness and dead ends ratio.

![User navigation](assets/docs/image/mazegen/mazegen.gif "User navigation")


## Usage Example

To use this module, you would typically create an instance of MazeGenerator, configure the desired properties, and call the generate() method to create a maze. You can then interact with the maze through the MazeCell objects, examining their properties and relationships to navigate or modify the maze.


![User navigation](assets/question_mark_01.png "User navigation") 

Got a Question? [@sanyabeast](mailto:a.gvrnsk@gmail.com?subject=chronicle)