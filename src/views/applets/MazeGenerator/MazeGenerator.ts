
import rand_gen from 'random-seed'

export enum ECellType {
    Empty,
    Default,
    Shortcut,
    Start,
    End,
}

export interface ICellData {
    maze_generator?: MazeGenerator;
    x: number;
    y: number;
    walls: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    },
    hovered: boolean;
    visited: boolean;
    type: ECellType;
    index?: number;
    next_cell?: ICellData;
    siblings?: ICellData[];
    get_walled_neighbours(): ICellData[];
    is_isolated(): boolean;
    is_transitive(): boolean;
    is_fork(): boolean;
    is_crossroad(): boolean;
    is_dead_end(): boolean;
    get_neighbours(cells): ICellData[];
    distance_to(cell: ICellData): number;
    remove_wall(cell2: ICellData): void;
    get walls_count(): number;
}

export enum EGenerationOrder {
    Pop,
    Shift
}

export class QuadCell implements ICellData {
    maze_generator?: MazeGenerator;
    constructor(maze_generator: MazeGenerator, x: number, y: number, type: ECellType = ECellType.Empty) {
        this.maze_generator = maze_generator;
        this.siblings = [];
        this.walls = { top: true, right: true, bottom: true, left: true }
        this.x = x;
        this.y = y;
        this.hovered = false;
        this.visited = false;
        this.type = type;
    }
    get_walled_neighbours(): ICellData[] {
        let cells = this.maze_generator.cells
        let result = []
        if (this.x > 0 && this.is_walled_cell(cells[this.x - 1][this.y])) {
            result.push(cells[this.x - 1][this.y]);
        }
        if (this.y > 0 && this.is_walled_cell(cells[this.x][this.y - 1])) {
            result.push(cells[this.x][this.y - 1]);
        }
        if (this.x < cells.length - 1 && this.is_walled_cell(cells[this.x + 1][this.y])) {
            result.push(cells[this.x + 1][this.y]);
        }
        if (this.y < cells.length - 1 && this.is_walled_cell(cells[this.x][this.y + 1])) {
            result.push(cells[this.x][this.y + 1]);
        }
        return result;
    }
    siblings?: ICellData[];
    index?: number;
    next_cell?: ICellData;
    get walls_count(): number {
        let result = 0;
        if (this.walls.top) {
            result++;
        }
        if (this.walls.right) {
            result++;
        }
        if (this.walls.bottom) {
            result++;
        }
        if (this.walls.left) {
            result++;
        }
        return result;
    }
    is_walled_cell(cell2: ICellData): boolean {
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
    remove_wall(cell2: ICellData): void {
        let cell1 = this
        let x = cell1.x - cell2.x;
        let y = cell1.y - cell2.y;

        this.siblings.push(cell2);

        if (x === 1) {
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (x === -1) {
            cell1.walls.right = false;
            cell2.walls.left = false;
        }

        if (y === 1) {
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        } else if (y === -1) {
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        }
    }
    get_neighbours(cells: ICellData[][]): ICellData[] {
        let result = []
        if (this.x > 0) {
            result.push(cells[this.x - 1][this.y]);
        }
        if (this.y > 0) {
            result.push(cells[this.x][this.y - 1]);
        }
        if (this.x < cells.length - 1) {
            result.push(cells[this.x + 1][this.y]);
        }
        if (this.y < cells.length - 1) {
            result.push(cells[this.x][this.y + 1]);
        }
        return result;
    }
    distance_to(cell: ICellData): number {
        return Math.abs(this.x - cell.x) + Math.abs(this.y - cell.y);
    }
    is_isolated(): boolean {
        return this.walls_count === 4;
    }
    is_transitive(): boolean {
        return this.walls_count === 2;
    }
    is_dead_end(): boolean {
        return this.walls_count === 3;
    }
    is_fork(): boolean {
        return this.walls_count === 1;
    }
    is_crossroad(): boolean {
        return this.walls_count === 0;
    }
    x: number;
    y: number;
    walls = null;
    hovered: boolean;
    visited: boolean;
    type: ECellType;

}

export class MazeGenerator {
    constructor() {
        this.cells = []
        this.path = []
    }

    cells: ICellData[][]
    start_cell: ICellData
    end_cell: ICellData
    rand
    seed: number = 4680
    grid_size: number = 4
    sparseness: number = 0.5
    dead_ends_ratio: number = 0.5
    longest_path: number = 0
    path: []
    generation_order: EGenerationOrder = EGenerationOrder.Shift

    get max_cells_count() {
        return this.grid_size * this.grid_size;
    }

    protected update_generator() {
        this.rand = rand_gen.create(this.seed)
    }
    protected get_random_cell(): ICellData {
        return this.cells[Math.floor(this.rand.random() * this.grid_size)][Math.floor(this.rand.random() * this.grid_size)];
    }
    protected get_path_coordinates(start_cell: ICellData) {
        let path = [];
        let current_cell = start_cell;
        path.push(current_cell);
        while (current_cell.next_cell) {
            current_cell = current_cell.next_cell;
            path.push(current_cell);
        }
        return path;
    }
    protected initialize() {
        this.update_generator();
        this.cells = [];

        for (let i = 0; i < this.grid_size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.grid_size; j++) {
                this.cells[i][j] = new QuadCell(this, i, j, ECellType.Empty)
            }
        }
    }
    public generate() {
        this.initialize();

        let stack = [];
        let current_cell = this.start_cell = this.get_random_cell();
        current_cell.index = 0;
        current_cell.visited = true;
        current_cell.type = ECellType.Start;
        stack.push(current_cell);

        while (stack.length > 0) {
            if (current_cell.index >= Math.max(1, (1 - this.sparseness) * this.max_cells_count)) {
                console.log(`sparseness reached: ${current_cell.index} / ${this.sparseness * this.max_cells_count}, max_cells_count: ${this.max_cells_count}`)
                break;
            }

            let neighbours = current_cell.get_neighbours(this.cells);
            let unvisited_neighbours = neighbours.filter(cell => cell.visited === false);

            if (unvisited_neighbours.length > 0) {
                let random_neighbour = unvisited_neighbours[Math.floor(this.rand.random() * unvisited_neighbours.length)];
                current_cell.remove_wall(random_neighbour);
                random_neighbour.visited = true;
                random_neighbour.index = current_cell.index + 1;
                stack.push(random_neighbour);
                current_cell = random_neighbour;
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

        let end_cell = this.end_cell = this.get_max_index_cell();
        this.longest_path = this.end_cell.index;
        end_cell.type = ECellType.End;

        let dead_ends = this.get_dead_ends();
        dead_ends.forEach(cell => {
            if (this.rand.random() > (this.dead_ends_ratio)) {
                if (cell.type === ECellType.Start || cell.type === ECellType.End) {
                    return
                }

                let walled_neighbours = cell.get_walled_neighbours(this.cells);
                console.log(walled_neighbours)
                let random_neighbour = walled_neighbours[Math.floor(this.rand.random() * walled_neighbours.length)];

                // if (random_neighbour.type === ECellType.Start || random_neighbour.type === ECellType.End) {
                //     return
                // }

                cell.remove_wall(random_neighbour);
                cell.type = ECellType.Shortcut;
            }

        })

        this.reset_visited()
    }
    protected get_max_index_cell(): ICellData {
        let current_cell = this.start_cell;
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                if (cell.index > current_cell.index) {
                    current_cell = cell;
                }
            })
        })
        return current_cell;
    }
    public get_dead_ends() {
        let result = [];
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                if (cell.is_dead_end()) {
                    result.push(cell);
                }
            })
        })
        return result;
    }
    public reset_visited() {
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                cell.visited = false;
            })
        })
    }
}