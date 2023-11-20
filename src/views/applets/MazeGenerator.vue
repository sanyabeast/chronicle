<template>
    <div class="maze-generator" @mousemove="handle_mousemove" @contextmenu.prevent="">
        <canvas ref="canvas"></canvas>
        <Tweakpane ref="tweakpane"></Tweakpane>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import emoji_data from '@/assets/emoji.json'
import { orderBy, sortBy } from 'lodash';
import Tweakpane from '@/components/Tweakpane.vue';
import rand_gen from 'random-seed'

export enum ECellType {
    Empty,
    Default,
    Shortcut,
    Start,
    End,
}

export interface ICellData {
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
    is_shortcut: boolean;
    type: ECellType;
    index?: number;
    next_cell?: ICellData;
    siblings?: ICellData[];
    get_walled_neighbours(cells: ICellData[][]): ICellData[];
    is_isolated(cells: ICellData[][]): boolean;
    is_transitive(cells: ICellData[][]): boolean;
    is_fork(cells: ICellData[][]): boolean;
    is_dead_end(cells: ICellData[][]): boolean;
    get_neighbours(cells): ICellData[];
    distance_to(cell: ICellData): number;
    remove_wall(cell2: ICellData): void;
    get walls_count(): number;
}

export class QuadCell implements ICellData {
    constructor(x: number, y: number, type: ECellType = ECellType.Empty) {
        this.siblings = [];
        this.walls = { top: true, right: true, bottom: true, left: true }
        this.x = x;
        this.y = y;
        this.hovered = false;
        this.visited = false;
        this.type = type;
    }
    is_shortcut: boolean;
    get_walled_neighbours(cells: ICellData[][]): ICellData[] {
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
    is_isolated(cells: ICellData[][]): boolean {
        return this.walls_count === 4;
    }
    is_transitive(cells: ICellData[][]): boolean {
        return this.walls_count === 2;
    }
    is_dead_end(cells: ICellData[][]): boolean {
        return this.walls_count === 3;
    }
    is_fork(cells: ICellData[][]): boolean {
        return this.walls_count === 1;
    }
    x: number;
    y: number;
    walls = null;
    hovered: boolean;
    visited: boolean;
    type: ECellType;

}
const wall_color = '#ffffff';

export default Vue.extend({
    name: "MazeGenerator",
    computed: {
        max_cells_count() {
            return this.grid_size * this.grid_size;
        },
    },
    props: {
        category: String
    },
    components: { Tweakpane },
    data() {
        return {
            cells: [],
            bg_color: '#000000', // '#000000
            path: [],
            adapt: {
                size: 0,
                padding: 64,
                translate: {
                    x: 0,
                    y: 0
                }
            },
            wall_width: 3,
            current_width: 0,
            current_height: 0,
            grid_size: 4,
            context2d: null,
            sparseness: 0.5,
            wall_padding: 0.03,
            dead_ends_ratio: 0.5,
            seed: 4680,
            start_cell: null,
            end_cell: null,
            longest_path: 0,
        }
    },
    mounted() {
        this.render = this.render.bind(this);
        this.context2d = this.$refs.canvas.getContext('2d');
        this.resize_canvas();
        window.addEventListener('resize', this.resize_canvas.bind(this));
        // this.fill_with_random_cells();

        this.initialize();
        this.generate_maze();

        let pane = this.$refs.tweakpane.pane;

        pane.addBlade({
            view: 'separator',
        });


        pane.addBinding(this, 'wall_padding', {
            label: 'Walls Padding',
            min: 0,
            max: 0.2,
            step: 0.01,
        })

        pane.addBinding(this, 'wall_width', {
            label: 'Walls width',
            min: 0.5,
            max: 5,
            step: 0.01,
        })



        pane.addBlade({
            view: 'separator',
        });

        pane.addBinding(this, 'grid_size', {
            label: 'Grid Size',
            min: 2,
            max: 20,
            step: 1,
        }).on('change', () => {
            this.initialize();
            this.generate_maze();
        });


        pane.addBinding(this, 'sparseness', {
            label: 'Sparseness',
            min: 0,
            max: 1,
            step: 0.001,
        }).on('change', () => {
            this.initialize();
            this.generate_maze();
        });


        pane.addBinding(this, 'dead_ends_ratio', {
            label: 'Dead-Ends Ratio',
            min: 0,
            max: 1,
            step: 0.001,
        }).on('change', () => {
            this.initialize();
            this.generate_maze();
        });

        pane.addBinding(this, 'longest_path', {
            label: 'Longest Path',
            readonly: true
        })


        pane.addBlade({
            view: 'separator',
        });

        pane.addBinding(this, 'seed', {
            label: 'Seed',
            min: 0,
            max: 10000,
            step: 1,
        }).on('change', () => {
            this.initialize();
            this.generate_maze();
        });



        pane.addButton({
            title: 'Generate maze',
        }).on('click', () => {
            this.seed = Math.floor(Math.random() * 10000);
            this.$refs.tweakpane.pane.refresh();
            this.initialize();
            this.generate_maze();
        });

        requestAnimationFrame(this.render);
    },
    methods: {
        update_generator() {
            this.rand = rand_gen.create(this.seed)
        },
        render() {
            requestAnimationFrame(this.render);

            this.context2d.fillStyle = this.bg_color;
            this.context2d.fillRect(0, 0, this.current_width, this.current_height);


            this.cells.forEach(cells => {
                cells.forEach(cell => {
                    this.draw_cell(cell);
                })
            })

            this.draw_cells()
            this.draw_path();
            this.draw_lables();
        },
        draw_cells() {
            this.cells.forEach(cells => {
                cells.forEach(cell => {
                    this.draw_cell(cell);
                })
            })
        },
        draw_lables() {
            const cell_size = this.adapt.size / this.grid_size;
            this.cells.forEach(cells => {
                cells.forEach(cell_data => {
                    const x = cell_data.x * cell_size + this.adapt.translate.x;
                    const y = cell_data.y * cell_size + this.adapt.translate.y;

                    // shortcut marker
                    if (cell_data.type === ECellType.Start) {
                        this.draw_cell_label(cell_data, "START", "#8bc34a")
                    }

                    if (cell_data.type === ECellType.End) {
                        this.draw_cell_label(cell_data, "FINISH", "#ff5722")
                    }

                    if (cell_data.type === ECellType.Shortcut) {
                        this.draw_cell_label(cell_data, "SHRTCUT", "#4caf50")
                    }

                    if (cell_data.is_dead_end(this.cells) && cell_data.type !== ECellType.Start && cell_data.type !== ECellType.End) {
                        this.draw_cell_label(cell_data, "dead", "#454545")
                    }

                    if (cell_data.is_fork(this.cells)) {
                        this.draw_cell_label(cell_data, "fork", "#454545")
                    }
                })
            })

        },
        draw_cell_label(cell_data: ICellData, label: string, color: string) {
            const cell_size = this.adapt.size / this.grid_size;
            const x = cell_data.x * cell_size + this.adapt.translate.x;
            const y = cell_data.y * cell_size + this.adapt.translate.y;



            this.context2d.textAlign = "center";
            this.context2d.font = `${cell_size / 8}px monospace`;
            let text_measurement = this.context2d.measureText(label);
            this.context2d.fillStyle = '#000000'
            this.context2d.fillRect(x + cell_size / 2 - (text_measurement.width * 1.1) / 2, y + cell_size / 2 - 8, text_measurement.width * 1.1, (cell_size / 8));
            this.context2d.fillStyle = color;
            this.context2d.fillText(label, x + cell_size / 2, y + cell_size / 2);
        },
        draw_cell(cell_data: ICellData) {

            const cell_size = this.adapt.size / this.grid_size;
            const x = cell_data.x * cell_size + this.adapt.translate.x;
            const y = cell_data.y * cell_size + this.adapt.translate.y;


            let dx = this.wall_padding * (this.adapt.size / this.grid_size)



            this.context2d.fillStyle = wall_color;

            if (cell_data.is_isolated(this.cells)) {
                this.context2d.fillStyle = "#050505";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
                return;
            }

            // debug floors
            if (cell_data.is_dead_end(this.cells)) {
                this.context2d.fillStyle = "#221818";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
            }

            if (cell_data.is_transitive(this.cells)) {
                this.context2d.fillStyle = "#181822";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
            }

            if (cell_data.is_fork(this.cells)) {
                this.context2d.fillStyle = "#182218";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
            }
            // debug walls
            if (cell_data.walls.top) {
                this.context2d.fillStyle = "#ff0000";
                this.context2d.fillRect(x, y + dx, cell_size, this.wall_width);
            }

            if (cell_data.walls.right) {
                this.context2d.fillStyle = "#ffff00";
                this.context2d.fillRect(x + cell_size - dx, y, this.wall_width, cell_size);
            }

            if (cell_data.walls.bottom) {
                this.context2d.fillStyle = "#ff0055";
                this.context2d.fillRect(x, y + cell_size - dx, cell_size, this.wall_width);
            }

            if (cell_data.walls.left) {
                this.context2d.fillStyle = "#ffaa00";
                this.context2d.fillRect(x + dx, y, this.wall_width, cell_size);
            }



        },
        /*drawing route path using canvas2d line and .siblings property of each cell*/
        draw_path(start_cell: ICellData = this.start_cell) {
            this.draw_path_fragment(start_cell);
            this.reset_visited_cells()
        },
        get_random_cell(): ICellData {
            return this.cells[Math.floor(this.rand.random() * this.grid_size)][Math.floor(this.rand.random() * this.grid_size)];
        },
        draw_path_fragment(cell: ICellData) {
            if (cell.visited) {
                return
            }
            cell.siblings.forEach((cell2) => {
                this.context2d.strokeStyle = `hsl(0, 0%, ${(1 - (cell.index / this.max_cells_count)) * 100}%)`;
                this.context2d.lineWidth = (1 - (cell.index / this.max_cells_count)) * 4;
                this.context2d.beginPath();
                this.context2d.moveTo(cell.x * this.adapt.size / this.grid_size + this.adapt.translate.x + this.adapt.size / this.grid_size / 2, cell.y * this.adapt.size / this.grid_size + this.adapt.translate.y + this.adapt.size / this.grid_size / 2);
                this.context2d.lineTo(cell2.x * this.adapt.size / this.grid_size + this.adapt.translate.x + this.adapt.size / this.grid_size / 2, cell2.y * this.adapt.size / this.grid_size + this.adapt.translate.y + this.adapt.size / this.grid_size / 2);
                this.context2d.stroke();
                cell.visited = true;
                this.draw_path_fragment(cell2);
            })
        },
        get_path_coordinates(start_cell: ICellData) {
            let path = [];
            let current_cell = start_cell;
            path.push(current_cell);
            while (current_cell.next_cell) {
                current_cell = current_cell.next_cell;
                path.push(current_cell);
            }
            return path;
        },
        resize_canvas() {
            if (this.$refs.canvas) {
                this.$refs.canvas.width = this.$refs.canvas.clientWidth;
                this.$refs.canvas.height = this.$refs.canvas.clientHeight;

                this.current_height = this.$refs.canvas.clientHeight;
                this.current_width = this.$refs.canvas.clientWidth;

                this.adapt.size = Math.min(this.current_width, this.current_height) - this.adapt.padding * 2;
                this.adapt.translate.x = (this.current_width - this.adapt.size) / 2;
                this.adapt.translate.y = (this.current_height - this.adapt.size) / 2;
            }
        },
        handle_mousemove(event: MouseEvent) {
            const cell_size = this.adapt.size / this.grid_size;
            const x = event.offsetX - this.adapt.translate.x;
            const y = event.offsetY - this.adapt.translate.y;

            const cell_x = Math.floor(x / cell_size);
            const cell_y = Math.floor(y / cell_size);

            this.cells.forEach(cell => {
                cell.hovered = cell.x === cell_x && cell.y === cell_y;
            })
        },
        initialize() {
            this.update_generator();
            this.cells = [];
            for (let i = 0; i < this.grid_size; i++) {
                this.cells[i] = [];
                for (let j = 0; j < this.grid_size; j++) {
                    this.cells[i][j] = new QuadCell(i, j, ECellType.Empty)
                }
            }
        },
        generate_maze() {
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
                    current_cell = stack.pop();
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

                    if (random_neighbour.type === ECellType.Start || random_neighbour.type === ECellType.End) {
                        return
                    }

                    cell.remove_wall(random_neighbour);
                    cell.type = ECellType.Shortcut;
                }

            })

            this.reset_visited_cells()

            console.log(this.cells)
        },
        get_max_index_cell(): ICellData {
            let current_cell = this.start_cell;
            this.cells.forEach(cells => {
                cells.forEach(cell => {
                    if (cell.index > current_cell.index) {
                        current_cell = cell;
                    }
                })
            })
            return current_cell;
        },
        get_dead_ends() {
            let result = [];
            this.cells.forEach(cells => {
                cells.forEach(cell => {
                    if (cell.is_dead_end(this.cells)) {
                        result.push(cell);
                    }
                })
            })
            return result;
        },
        reset_visited_cells() {
            this.cells.forEach(cells => {
                cells.forEach(cell => {
                    cell.visited = false;
                })
            })
        },
    },

})
</script>
<style lang="less">
@import url('@/assets/index.less');

.maze-generator {
    color: @color-accent;

    canvas {
        width: 100%;
        height: 100%;
    }

    .tweakpane {
        position: absolute;
        top: 32px;
        left: 16px;
    }
}
</style>