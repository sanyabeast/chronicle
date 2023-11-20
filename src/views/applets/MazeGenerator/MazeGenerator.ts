
import { filter, map } from 'lodash';
import rand_gen from 'random-seed'

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
        this.walls = { top: true, right: true, bottom: true, left: true }
        this.x = x;
        this.y = y;
        this.hovered = false;
        this.visited = false;
        this.category = category;
    }

    // PROPS

    public index?: number;
    public x: number;
    public y: number;
    public walls = null;
    public hovered: boolean;
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
        if (this.walls.top) result++;
        if (this.walls.right) result++;
        if (this.walls.bottom) result++;
        if (this.walls.left) result++;
        return result;
    }

    // METHODS
    public get_closed_neighbours(): MazeCell[] {
        return filter(this.get_all_neighbours(), (cell) => {
            return this.get_wall_between(cell)
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
            cell1.walls.left = value;
            cell2.walls.right = value;
        } else if (x === -1) {
            cell1.walls.right = value;
            cell2.walls.left = value;
        }

        if (y === 1) {
            cell1.walls.top = value;
            cell2.walls.bottom = value;
        } else if (y === -1) {
            cell1.walls.bottom = value;
            cell2.walls.top = value;
        }
    }
    public get_wall_between(cell2: MazeCell): boolean {
        let x = this.x - cell2.x;
        let y = this.y - cell2.y;

        if (x === 1) {
            return this.walls.left;
        } else if (x === -1) {
            return this.walls.right;
        }

        if (y === 1) {
            return this.walls.top;
        } else if (y === -1) {
            return this.walls.bottom;
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

    public seed: number = 4680
    public grid_size: number = 4
    public sparseness: number = 0.5
    public dead_ends_ratio: number = 0.75
    public shortcuts_ratio: number = 0.2
    public generation_order: EGenerationOrder = EGenerationOrder.Shift

    protected rand

    public get max_cells_count() {
        return this.grid_size * this.grid_size;
    }
    // METHODS

    protected update_generator() {
        this.rand = rand_gen.create(this.seed)
    }
    protected get_random_cell(): MazeCell {
        return this.cells[Math.floor(this.rand.random() * this.grid_size)][Math.floor(this.rand.random() * this.grid_size)];
    }
    protected initialize() {
        this.update_generator();
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
        let end_cell = current_cell;
        current_cell.index = 0;
        current_cell.visited = true;
        current_cell.category = ECellCategory.Start;
        stack.push(current_cell);

        while (stack.length > 0) {
            if (current_cell.index >= Math.max(1, (1 - this.sparseness) * this.max_cells_count)) {
                console.log(`sparseness reached: ${current_cell.index} / ${this.sparseness * this.max_cells_count}, max_cells_count: ${this.max_cells_count}`)
                break;
            }

            let neighbours = current_cell.get_all_neighbours();
            let unvisited_neighbours = neighbours.filter(cell => cell.visited === false);

            if (unvisited_neighbours.length > 0) {
                let random_neighbour = unvisited_neighbours[Math.floor(this.rand.random() * unvisited_neighbours.length)];
                current_cell.remove_wall_between(random_neighbour);
                random_neighbour.visited = true;
                random_neighbour.index = current_cell.index + 1;
                stack.push(random_neighbour);
                current_cell = random_neighbour;
                end_cell = current_cell;
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
            if (this.rand.random() > (this.dead_ends_ratio)) {
                if (cell.category === ECellCategory.Start || cell.category === ECellCategory.End) {
                    return
                }

                let walled_neighbours = cell.get_closed_neighbours(this.cells);
                console.log(walled_neighbours)
                let random_neighbour = walled_neighbours[Math.floor(this.rand.random() * walled_neighbours.length)];

                cell.remove_wall_between(random_neighbour);
                cell.category = ECellCategory.Loop;
            }
        })

        // SHORTCUTS
        let transitive_cells = this.find_cells_with_accessibility(ECellAccessibilityLevel.Transitive);
        transitive_cells.forEach(cell => {
            let closed_neighbours = cell.get_closed_neighbours();
            if (closed_neighbours.length > 1) {
                let random_neighbour = closed_neighbours[Math.floor(this.rand.random() * closed_neighbours.length)];
                if (Math.random() < this.shortcuts_ratio) {
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