# Maze Generation

This module implements a maze generation algorithm in TypeScript. It consists of several classes and enums which work together to create and manage a maze.

![User navigation](assets/docs/image/mazegen/mazegen.gif "User navigation")


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

## Usage Example

To use this module, you would typically create an instance of MazeGenerator, configure the desired properties, and call the generate() method to create a maze. You can then interact with the maze through the MazeCell objects, examining their properties and relationships to navigate or modify the maze.


![User navigation](assets/question_mark_01.png "User navigation") 

Got a Question? [@sanyabeast](mailto:a.gvrnsk@gmail.com?subject=chronicle)