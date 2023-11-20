<template>
    <div class="maze-generator" @mousemove="handle_mousemove" @contextmenu.prevent="">
        <Tweakpane ref="tweakpane"></Tweakpane>
        <div class="canvas-wrapper">
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import emoji_data from '@/assets/emoji.json'
import { orderBy, sortBy } from 'lodash';
import Tweakpane from '@/components/Tweakpane.vue';
import { MazeGenerator, ECellType, ICellData } from './MazeGenerator/MazeGenerator'


const wall_color = '#ffffff';

export default Vue.extend({
    name: "MazeGenerator",
    computed: {

    },
    props: {
        category: String
    },
    components: { Tweakpane },
    data() {
        return {
            bg_color: '#050505', // '#000000
            adapt: {
                size: 0,
                padding: 16,
                translate: {
                    x: 0,
                    y: 0
                }
            },
            wall_width: 3,
            current_width: 0,
            current_height: 0,
            path_width: 1,
            context2d: null,
            wall_padding: 0.03
        }
    },
    mounted() {
        (window as any).maze_generator = this;

        this.render = this.render.bind(this);
        this.context2d = this.$refs.canvas.getContext('2d');
        this.resize_canvas();
        window.addEventListener('resize', this.resize_canvas.bind(this));
        this.maze_generator = new MazeGenerator();
        // this.fill_with_random_cells();

        this.maze_generator.generate()

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
            label: 'Walls Width',
            min: 0.1,
            max: 5,
            step: 0.01,
        })

        pane.addBinding(this, 'path_width', {
            label: 'Path Width',
            min: 0.1,
            max: 5,
            step: 0.01,
        })

        pane.addBlade({
            view: 'separator',
        });

        pane.addBinding(this.maze_generator, 'grid_size', {
            label: 'Grid Size',
            min: 2,
            max: 20,
            step: 1,
        }).on('change', () => {
            this.maze_generator.generate();
        });


        pane.addBinding(this.maze_generator, 'sparseness', {
            label: 'Sparseness',
            min: 0,
            max: 1,
            step: 0.001,
        }).on('change', () => {
            this.maze_generator.generate();
        });

        pane.addBinding(this.maze_generator, 'dead_ends_ratio', {
            label: 'Dead-Ends Ratio',
            min: 0,
            max: 1,
            step: 0.001,
        }).on('change', () => {
            this.maze_generator.generate();
        });

        pane.addBlade({
            view: 'list',
            label: 'Generation Order',
            options: [
                { text: 'Pop', value: 0 },
                { text: 'Shift', value: 1 }
            ],
            value: 1,
        }).on('change', (ev) => {
            console.log(ev.value)
            this.maze_generator.generation_order = ev.value;
            this.maze_generator.generate();
        });


        pane.addBinding(this.maze_generator, 'longest_path', {
            label: 'Longest Path',
            readonly: true
        })


        pane.addBlade({
            view: 'separator',
        });

        pane.addBinding(this.maze_generator, 'seed', {
            label: 'Seed',
            min: 0,
            max: 10000,
            step: 1,
        }).on('change', () => {
            this.maze_generator.generate();
        });

        pane.addButton({
            title: 'Generate maze',
        }).on('click', () => {
            this.maze_generator.seed = Math.floor(Math.random() * 10000);
            this.maze_generator.generate();
            this.$refs.tweakpane.pane.refresh();
        });


        requestAnimationFrame(this.render);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize_canvas.bind(this));
        (window as any).maze_generator = null;
    },
    methods: {
        render() {
            requestAnimationFrame(this.render);

            this.context2d.fillStyle = this.bg_color;
            this.context2d.fillRect(0, 0, this.current_width, this.current_height);

            this.draw_cells()
            this.draw_path();
            this.draw_lables();
        },
        draw_cells() {
            this.maze_generator.cells.forEach(cells => {
                cells.forEach(cell => {
                    this.draw_cell(cell);
                })
            })
        },
        draw_lables() {
            const cell_size = this.adapt.size / this.maze_generator.grid_size;
            this.maze_generator.cells.forEach(cells => {
                cells.forEach(cell_data => {
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

                    if (cell_data.is_dead_end() && cell_data.type !== ECellType.Start && cell_data.type !== ECellType.End) {
                        this.draw_cell_label(cell_data, "dead", "#454545")
                    }

                    if (cell_data.is_fork()) {
                        this.draw_cell_label(cell_data, "fork", "#454545")
                    }

                    if (cell_data.is_crossroad()) {
                        this.draw_cell_label(cell_data, "cross", "#454545")
                    }
                })
            })

        },
        draw_cell_label(cell_data: ICellData, label: string, color: string) {
            const cell_size = this.adapt.size / this.maze_generator.grid_size;
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

            const cell_size = this.adapt.size / this.maze_generator.grid_size;
            const x = cell_data.x * cell_size + this.adapt.translate.x;
            const y = cell_data.y * cell_size + this.adapt.translate.y;


            let dx = this.wall_padding * (this.adapt.size / this.maze_generator.grid_size)


            this.context2d.fillStyle = wall_color;

            if (cell_data.type === ECellType.Start || cell_data.type === ECellType.End) {
                this.context2d.fillStyle = "#142f1e";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
            } else {
                if (cell_data.is_isolated()) {
                    this.context2d.fillStyle = "#050505";
                    this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
                    return;
                }
                // debug floors
                if (cell_data.is_dead_end()) {
                    this.context2d.fillStyle = "#2f1414";
                    this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
                }

                if (cell_data.is_transitive()) {
                    this.context2d.fillStyle = "#191919";
                    this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
                }
            }

            if (cell_data.is_fork()) {
                this.context2d.fillStyle = "#26142f";
                this.context2d.fillRect(x + dx, y, cell_size - dx, cell_size - dx);
            }

            if (cell_data.is_crossroad()) {
                this.context2d.fillStyle = "#2f142f";
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
        draw_path(start_cell: ICellData = this.maze_generator.start_cell) {
            this.draw_path_fragment(start_cell);
            this.maze_generator.reset_visited()
        },
        draw_path_fragment(cell: ICellData) {
            if (cell.visited) {
                return
            }
            cell.siblings.forEach((cell2) => {
                this.context2d.strokeStyle = `hsl(0, 0%, ${(1 - (cell.index / this.maze_generator.max_cells_count)) * 100}%)`;
                this.context2d.lineWidth = (1 - Math.pow((cell.index / this.maze_generator.longest_path), 2)) * 4 * this.path_width;
                this.context2d.beginPath();
                this.context2d.moveTo(cell.x * this.adapt.size / this.maze_generator.grid_size + this.adapt.translate.x + this.adapt.size / this.maze_generator.grid_size / 2, cell.y * this.adapt.size / this.maze_generator.grid_size + this.adapt.translate.y + this.adapt.size / this.maze_generator.grid_size / 2);
                this.context2d.lineTo(cell2.x * this.adapt.size / this.maze_generator.grid_size + this.adapt.translate.x + this.adapt.size / this.maze_generator.grid_size / 2, cell2.y * this.adapt.size / this.maze_generator.grid_size + this.adapt.translate.y + this.adapt.size / this.maze_generator.grid_size / 2);
                this.context2d.stroke();
                cell.visited = true;
                this.draw_path_fragment(cell2);
            })
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
            const cell_size = this.adapt.size / this.maze_generator.grid_size;
            const x = event.offsetX - this.adapt.translate.x;
            const y = event.offsetY - this.adapt.translate.y;

            const cell_x = Math.floor(x / cell_size);
            const cell_y = Math.floor(y / cell_size);

            this.maze_generator.cells.forEach(cell => {
                cell.hovered = cell.x === cell_x && cell.y === cell_y;
            })
        },

    },

})
</script>
<style lang="less">
@import url('@/assets/index.less');

.maze-generator {
    color: @color-accent;
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-gap: 16px;
    overflow: hidden;

    .canvas-wrapper {
        display: flex;
        overflow: hidden;
        border: 1px dotted #1d1d1d;

        canvas {
            width: 100%;
            height: 100%;
        }
    }

    .tweakpane {
        // position: absolute;
        // top: 32px;
        // left: 16px;
    }
}

@media screen and (max-width: 1400px) {

    .maze-generator {
        padding: 16px 16px;
    }
}

@media screen and (max-width: 600px) {

    .maze-generator {
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 1fr;

        .canvas-wrapper {
            grid-row: 1;

        }

        .tweakpane {
            grid-row: 2;
            overflow: auto;
        }
    }
}
</style>