import json
import random
from enum import Enum
from typing import Optional, List, Dict, Tuple

class ECellCategory(Enum):
    Empty = 0
    Default = 1
    Shortcut = 2
    Loop = 3
    Start = 4
    End = 5

class ECellAccessibilityLevel(Enum):
    Crossroad = 0
    Fork = 1
    Transitive = 2
    DeadEnd = 3
    Isolated = 4

class EGenerationOrder(Enum):
    Pop = 0
    Shift = 1

class MazeCell:
    def __init__(self, maze_generator, x: int, y: int, category: ECellCategory = ECellCategory.Default):
        self.maze_generator = maze_generator
        self.x = x
        self.y = y
        self.walls = {'north': True, 'east': True, 'south': True, 'west': True}
        self.visited = False
        self.category = category
        self.route = None
        self.distance = None
        self.neighbours_offsets = [(-1, 0), (0, -1), (1, 0), (0, 1)]

    @property
    def walls_count(self):
        return sum(self.walls.values())

    def get_closed_neighbours(self):
        return [cell for cell in self.get_all_neighbours() if self.get_wall_between(cell) and cell.walls_count != ECellAccessibilityLevel.Isolated]

    def get_open_neighbours(self):
        return [cell for cell in self.get_all_neighbours() if not self.get_wall_between(cell)]

    def get_all_neighbours(self):
        cells = self.maze_generator.cells
        return [self.get_neighbour_cell(i) for i, _ in enumerate(self.neighbours_offsets) if self.get_neighbour_cell(i) is not None]

    def remove_wall_between(self, cell2):
        self.set_wall_between(cell2, False)

    def add_wall_between(self, cell2):
        self.set_wall_between(cell2, True)

    def set_wall_between(self, cell2, value: bool):
        x = self.x - cell2.x
        y = self.y - cell2.y

        if x == 1:
            self.walls['west'] = value
            cell2.walls['east'] = value
        elif x == -1:
            self.walls['east'] = value
            cell2.walls['west'] = value

        if y == 1:
            self.walls['north'] = value
            cell2.walls['south'] = value
        elif y == -1:
            self.walls['south'] = value
            cell2.walls['north'] = value

    def get_wall_between(self, cell2):
        x = self.x - cell2.x
        y = self.y - cell2.y

        if x == 1:
            return self.walls['west']
        elif x == -1:
            return self.walls['east']

        if y == 1:
            return self.walls['north']
        elif y == -1:
            return self.walls['south']

    def get_neighbour_cell(self, offset_index):
        if offset_index < 0 or offset_index > 3:
            raise ValueError("offset must be between 0 and 3")
        offset = self.neighbours_offsets[offset_index]
        x = self.x + offset[0]
        y = self.y + offset[1]

        if x < 0 or x >= self.maze_generator.grid_size or y < 0 or y >= self.maze_generator.grid_size:
            return None

        return self.maze_generator.cells[x][y]
    
    def to_json(self):
        return {
            'x': self.x,
            'y': self.y,
            'walls': self.walls,
            'visited': self.visited,
            'category': self.category.value,
            'route': self.route,
            'distance': self.distance,
            'index': self.index if hasattr(self, 'index') else None,
        }

class MazeGenerator:
    def __init__(self):
        self.cells = []
        self.start_cell = None
        self.end_cell = None
        self.seed = 0
        self.grid_size = 4
        self.sparseness = 0.5
        self.dead_ends_ratio = 0.75
        self.shortcuts_ratio = 0.2
        self.generation_order = EGenerationOrder.Shift
        self.current_cell_index = 0
        self.seeded_random = random.Random(self.seed)
        self.routes = []

    @property
    def max_cells_count(self):
        return self.grid_size ** 2

    def update_generator(self):
        self.seeded_random.seed(self.seed)

    def get_random_cell(self):
        return self.cells[random.randint(0, self.grid_size - 1)][random.randint(0, self.grid_size - 1)]

    def initialize(self):
        self.update_generator()
        self.current_cell_index = 0
        self.cells = [[MazeCell(self, x, y) for y in range(self.grid_size)] for x in range(self.grid_size)]
        self.routes = []

    def generate(self):
        self.initialize()
        stack = []
        current_cell = self.start_cell = self.get_random_cell()
        end_cell = current_cell
        current_cell.distance = 0
        current_cell.index = self.current_cell_index
        current_cell.visited = True
        current_cell.category = ECellCategory.Start
        stack.append(current_cell)
        route = []

        while stack:
            route.append(current_cell)

            if current_cell.index >= max(1, (1 - self.sparseness) * self.max_cells_count):
                if len(route) > 1:
                    self.routes.append(route)
                route = []
                break

            neighbours = current_cell.get_all_neighbours()
            unvisited_neighbours = [cell for cell in neighbours if not cell.visited]

            if unvisited_neighbours:
                random_neighbour = unvisited_neighbours[random.randint(0, len(unvisited_neighbours) - 1)]
                current_cell.remove_wall_between(random_neighbour)
                random_neighbour.visited = True
                random_neighbour.distance = current_cell.distance + 1
                random_neighbour.index = self.current_cell_index + 1
                self.current_cell_index += 1
                stack.append(random_neighbour)
                current_cell = random_neighbour
                end_cell = current_cell if current_cell.distance > end_cell.distance else end_cell
            else:
                if self.generation_order == EGenerationOrder.Pop:
                    current_cell = stack.pop()
                elif self.generation_order == EGenerationOrder.Shift:
                    current_cell = stack.pop(0)

                if len(route) > 1:
                    self.routes.append(route)
                route = []

        end_cell.category = ECellCategory.End
        self.end_cell = end_cell

        # Additional logic for dead ends and shortcuts would be added here, similar to the original TypeScript code

        self.reset_visited()

    def reset_visited(self):
        for row in self.cells:
            for cell in row:
                cell.visited = False

    def to_json(self):
        return {
            'grid_size': self.grid_size,
            'seed': self.seed,
            'sparseness': self.sparseness,
            'dead_ends_ratio': self.dead_ends_ratio,
            'shortcuts_ratio': self.shortcuts_ratio,
            'generation_order': self.generation_order.value,
            'cells': list(map(lambda row: list(map(lambda cell: cell.to_json(), row)), self.cells)),
        }

    # Additional methods like 'to_json' and 'for_each_cell' would be implemented here, similar to the original TypeScript code

def print_pretty_json(data):
    print(json.dumps(data, indent=4))

def print_console_maze(maze_generator: MazeGenerator):
    for y in range(maze_generator.grid_size):
        for x in range(maze_generator.grid_size):
            cell = maze_generator.cells[x][y]
            print(' ', end='')
            print(' ', end='') if cell.walls['north'] else print('_', end='')
        print()

        for x in range(maze_generator.grid_size):
            cell = maze_generator.cells[x][y]
            print('|', end='') if cell.walls['west'] else print(' ', end='')
            print(' ', end='') if cell.category == ECellCategory.Start else print(' ', end='') if cell.category == ECellCategory.End else print(' ', end='')
            print('|', end='') if cell.walls['east'] else print(' ', end='')
        print()

    for x in range(maze_generator.grid_size):
        cell = maze_generator.cells[x][maze_generator.grid_size - 1]
        print(' ', end='')
        print(' ', end='') if cell.walls['south'] else print('_', end='')
    print()


def main():
    generator = MazeGenerator()
    generator.generate()
    print(generator.routes)
    print_console_maze(generator)
    print_pretty_json(generator.to_json())

    # Print or process the generated maze as needed

if __name__ == "__main__":
    main()