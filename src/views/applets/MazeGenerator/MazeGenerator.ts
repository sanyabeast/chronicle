
import { filter, map } from 'lodash';
import Alea from 'alea'

export enum ECellCategory {
    Empty,
    Default,
    Shortcut,
    Loop,
    Start,
    End,
}

export enum ECellAccessibilityLevel {
    Crossroad,
    Fork,
    Transitive,
    DeadEnd,
    Isolated,
}

export enum EGenerationOrder {
    Pop,
    Shift
}

export class MazeCell {
    constructor(maze_generator: MazeGenerator, x: number, y: number, category: ECellCategory = ECellCategory.Empty) {
        this.maze_generator = maze_generator;
        this.walls = { north: true, east: true, south: true, west: true }
        this.x = x;
        this.y = y;
        this.visited = false;
        this.category = category;
    }

    // PROPS

    public index: number
    public distance?: number;
    public x: number;
    public y: number;
    public walls: { north: boolean, east: boolean, south: boolean, west: boolean } = null;
    public category: ECellCategory;
    public visited: boolean;

    protected maze_generator?: MazeGenerator;
    protected neighbours_offsets = [
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
    ]

    public get walls_count(): number {
        let result = 0;
        if (this.walls.north) result++;
        if (this.walls.east) result++;
        if (this.walls.south) result++;
        if (this.walls.west) result++;
        return result;
    }

    // METHODS
    public get_closed_neighbours(): MazeCell[] {
        return filter(this.get_all_neighbours(), (cell: MazeCell) => {
            return this.get_wall_between(cell) && cell.walls_count !== ECellAccessibilityLevel.Isolated
        })
    }
    public get_open_neighbours(): MazeCell[] {
        return filter(this.get_all_neighbours(), (cell) => {
            return !this.get_wall_between(cell)
        })
    }
    public get_all_neighbours(): MazeCell[] {
        let cells = this.maze_generator.cells;
        return filter(
            map(this.neighbours_offsets, (offset, index) => { return this.get_neighbour_cell(index) }),
            (cell) => { return cell !== null }
        )
    }
    public remove_wall_between(cell2: MazeCell): void {
        this.set_wall_between(cell2, false);
    }
    public add_wall_between(cell2: MazeCell): void {
        this.set_wall_between(cell2, true);
    }
    public set_wall_between(cell2: MazeCell, value: boolean): void {
        let cell1 = this
        let x = cell1.x - cell2.x;
        let y = cell1.y - cell2.y;

        if (x === 1) {
            cell1.walls.west = value;
            cell2.walls.east = value;
        } else if (x === -1) {
            cell1.walls.east = value;
            cell2.walls.west = value;
        }

        if (y === 1) {
            cell1.walls.north = value;
            cell2.walls.south = value;
        } else if (y === -1) {
            cell1.walls.south = value;
            cell2.walls.north = value;
        }
    }
    public get_wall_between(cell2: MazeCell): boolean {
        let x = this.x - cell2.x;
        let y = this.y - cell2.y;

        if (x === 1) {
            return this.walls.west;
        } else if (x === -1) {
            return this.walls.east;
        }

        if (y === 1) {
            return this.walls.north;
        } else if (y === -1) {
            return this.walls.south;
        }
    }
    protected get_neighbour_cell(offset: number) {
        if (offset < 0 || offset > 3) {
            throw new Error("offset must be between 0 and 3");
        }
        let x = this.x + this.neighbours_offsets[offset].x
        let y = this.y + this.neighbours_offsets[offset].y

        if (x < 0 || x >= this.maze_generator.grid_size || y < 0 || y >= this.maze_generator.grid_size) {
            return null
        }

        return this.maze_generator.cells[x][y]
    }
}

export class MazeGenerator {
    constructor() {
        this.cells = []
    }

    //  PROPS
    public cells: MazeCell[][]
    public start_cell: MazeCell
    public end_cell: MazeCell

    public seed: number = 0
    public grid_size: number = 4
    public sparseness: number = 0.5
    public dead_ends_ratio: number = 0.75
    public shortcuts_ratio: number = 0.2
    public generation_order: EGenerationOrder = EGenerationOrder.Shift

    protected current_cell_index: number = 0
    protected seeded_random

    public get max_cells_count() {
        return this.grid_size * this.grid_size;
    }
    // METHODS

    protected update_generator() {
        this.seeded_random = Alea(this.seed.toString())
    }
    protected get_random_cell(): MazeCell {
        return this.cells[Math.floor(this.seeded_random() * this.grid_size)][Math.floor(this.seeded_random() * this.grid_size)];
    }
    protected initialize() {
        this.update_generator();
        this.current_cell_index = 0;
        this.cells = [];

        for (let i = 0; i < this.grid_size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.grid_size; j++) {
                this.cells[i][j] = new MazeCell(this, i, j, ECellCategory.Empty)
            }
        }
    }
    public generate() {
        this.initialize();

        let stack = [];
        let current_cell = this.start_cell = this.get_random_cell();
        let end_cell: MazeCell = current_cell;
        current_cell.distance = 0;
        current_cell.index = this.current_cell_index;
        current_cell.visited = true;
        current_cell.category = ECellCategory.Start;
        stack.push(current_cell);

        while (stack.length > 0) {
            if (current_cell.index >= Math.max(1, (1 - this.sparseness) * this.max_cells_count)) {
                break;
            }

            let neighbours = current_cell.get_all_neighbours();
            let unvisited_neighbours = neighbours.filter(cell => cell.visited === false);

            if (unvisited_neighbours.length > 0) {
                let random_neighbour = unvisited_neighbours[Math.floor(this.seeded_random() * unvisited_neighbours.length)];
                current_cell.remove_wall_between(random_neighbour);
                random_neighbour.visited = true;
                random_neighbour.distance = current_cell.distance + 1;
                random_neighbour.index = this.current_cell_index++;
                stack.push(random_neighbour);
                current_cell = random_neighbour;
                end_cell = current_cell.distance > end_cell.distance ? current_cell : end_cell;
            } else {
                switch (this.generation_order) {
                    case EGenerationOrder.Pop: {
                        current_cell = stack.pop();
                        break;
                    }
                    case EGenerationOrder.Shift: {
                        current_cell = stack.shift();
                        break;
                    }
                }

            }
        }

        end_cell.category = ECellCategory.End;
        this.end_cell = end_cell;

        // DEAD ENDS
        let dead_ends = this.find_cells_with_accessibility(ECellAccessibilityLevel.DeadEnd);
        dead_ends.forEach(cell => {
            if (this.seeded_random() > (this.dead_ends_ratio)) {
                if (cell.category === ECellCategory.Start || cell.category === ECellCategory.End) {
                    return
                }

                let closed_neighbours = cell.get_closed_neighbours(this.cells);

                if (closed_neighbours.length > 0) {
                    let random_neighbour = closed_neighbours[Math.floor(this.seeded_random() * closed_neighbours.length)];

                    cell.remove_wall_between(random_neighbour);
                    cell.category = ECellCategory.Loop;
                }
            }
        })

        // SHORTCUTS
        let transitive_cells = this.find_cells_with_accessibility(ECellAccessibilityLevel.Transitive);
        transitive_cells.forEach(cell => {
            let closed_neighbours = cell.get_closed_neighbours();

            if (closed_neighbours.length > 1) {
                let random_neighbour = closed_neighbours[Math.floor(this.seeded_random() * closed_neighbours.length)];
                if (this.seeded_random() < this.shortcuts_ratio) {
                    cell.remove_wall_between(random_neighbour);
                    cell.category = ECellCategory.Shortcut;
                }
            }
        })

        this.for_each_cell((cell) => {
            if (cell.walls_count === ECellAccessibilityLevel.Isolated) {
                cell.category = ECellCategory.Empty;
            }
        })

        this.reset_visited()
    }
    find_cells_with_accessibility(level: ECellAccessibilityLevel) {
        let result = [];
        this.for_each_cell((cell) => {
            if (cell.walls_count === level) {
                result.push(cell);
            }
        })

        return result;
    }

    public reset_visited() {
        this.for_each_cell((cell) => {
            cell.visited = false;
        })
    }

    protected for_each_cell(callback: (cell: MazeCell) => void) {
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                callback(cell);
            })
        })
    }
}