<template>
    <div class="a-star-pathfinder" @mousemove="handle_mousemove" @mouseup="handle_mouseup" @contextmenu.prevent="">
        <div class="control-panel">
            <Tweakpane ref="tweakpane"></Tweakpane>
            <ul class="info">
                <li><i>Left</i> mouse button - set <b color="#">start</b></li>
                <li><i>Right</i> mouse button - set finish</li>
                <li><i>Middle</i> mouse button - toggle cell</li>
            </ul>
        </div>
        <Canvas2D ref="canvas" @update="render" :show_debug="!is_mobile" :allow_user_scale="true"
            :allow_user_translate="true" :allow_context_menu="true">
            <viewport width="10" height="10">
                <rect x="1" y="1" width="2" height="2"></rect>
            </viewport>
        </Canvas2D>
    </div>
</template>
<script lang="ts">

import * as THREE from 'three';
import Vue from 'vue';
import Canvas2D from '@/components/Canvas2D.vue';
import Tweakpane from '@/components/Tweakpane.vue';
import mixins from 'vue-typed-mixins'
import BaseComponent from '@/components/BaseComponent.vue';
import { debounce, fill, map, throttle } from 'lodash';
import Syntax from '@/components/CodePreview.vue';
import { AStarPathfinder } from './AStar/AStar';
import Alea from 'alea'
import { lerp_float } from '@/tools';

const color_scheme = {
    background: "#111111",     // Charcoal for a modern, sleek background
    free_cell: "#c0c0c0",      // Pewter Blue for unoccupied cells, providing a soft contrast
    blocked_cell: "#474747",   // Onyx for blocked cells, blending well but distinguishable
    start_cell: "#03a9f4",     // Jade Green for the start cell, more visible against the background
    finish_cell: "#9c27b0",    // Carmine Red for the finish cell, signaling 'stop' or 'end'
    cell_gap_color: "#2A3439", // Gunmetal for gaps between cells, for a subtle boundary
    hovered_cell: "#87CEEB",   // Sky Blue for hovered cells, standing out but not overpowering
    path_color: "#ffeb3b",     // Amber for the path, bright and attention-grabbing
    visited_color: "#f44336"
};

class Cell {
    x: number;
    y: number;
    blocked: boolean;
    is_same(cell: Cell) {
        return this.x == cell.x && this.y == cell.y
    }
    constructor(x: number, y: number, blocked: boolean) {
        this.x = x;
        this.y = y;
        this.blocked = blocked;
    }
}

export default mixins(BaseComponent).extend({
    name: "AStarDemo",
    components: { Canvas2D, Tweakpane },
    computed: {},
    props: {
        category: String,
        seed: {
            type: String,
            default: 0
        }
    },
    data() {
        return {
            grid_size: 16,
            blockiness: 0.25,
            directional_bias: 0.5,
            cells: [],
            allow_diagonal: true,
            visited_cells: [],
            path_length: 0,
            hovered_cell: {
                x: -1,
                y: -1
            },
            start_cell: {
                x: -1,
                y: -1
            },
            finish_cell: {
                x: -1,
                y: -1
            },
        }
    },
    mounted() {
        this.canvas = this.$refs.canvas;

        // parsing seed
        if (!isNaN(parseInt(this.seed))) {
            console.log(`seed not random: ${this.seed}`)
            this.seed = parseInt(this.seed);
        } else {
            console.log(`seed: random`)
            this.seed = Math.floor(Math.random() * 10000)
        }


        this.pathfinder = new AStarPathfinder<Cell>({
            find_neighbors: this.find_neighbors.bind(this),
            get_distance: (cell1, cell2) => {
                let distance = Math.sqrt(Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y))

                // directional bias
                let global_direction = new THREE.Vector2(this.finish_cell.x - this.start_cell.x, this.finish_cell.y - this.start_cell.y).normalize()

                let local_direction = new THREE.Vector2(cell2.x - cell1.x, cell2.y - cell1.y).normalize()

                let direction_delta = Math.abs(global_direction.x - local_direction.x) + Math.abs(global_direction.y - local_direction.y)
                direction_delta = Math.pow(direction_delta, 2)

                let bias = lerp_float(1, direction_delta, this.directional_bias);
                bias = Math.pow(bias, 4)
                distance *= bias

                return distance;
            },
        })

        this.update_path = debounce(this.update_path, 1000 / 30)

        this.setup_tweakpane()
        this.regenerate()
        this.render()
    },
    beforeMount() { },
    methods: {
        find_neighbors(cell: Cell, neighbors: Set<Cell>) {

            let x = cell.x
            let y = cell.y


            if (this.allow_diagonal) {
                if (x > 0 && y > 0 && !this.cells[y - 1][x - 1].blocked && !this.cells[y][x - 1].blocked && !this.cells[y - 1][x].blocked) {
                    neighbors.add(this.cells[y - 1][x - 1])
                }

                if (x < this.grid_size - 1 && y > 0 && !this.cells[y - 1][x + 1].blocked && !this.cells[y][x + 1].blocked && !this.cells[y - 1][x].blocked) {
                    neighbors.add(this.cells[y - 1][x + 1])
                }

                if (x > 0 && y < this.grid_size - 1 && !this.cells[y + 1][x - 1].blocked && !this.cells[y][x - 1].blocked && !this.cells[y + 1][x].blocked) {
                    neighbors.add(this.cells[y + 1][x - 1])
                }

                if (x < this.grid_size - 1 && y < this.grid_size - 1 && !this.cells[y + 1][x + 1].blocked && !this.cells[y][x + 1].blocked && !this.cells[y + 1][x].blocked) {
                    neighbors.add(this.cells[y + 1][x + 1])
                }
            }

            if (x > 0 && !this.cells[y][x - 1].blocked) {
                neighbors.add(this.cells[y][x - 1])
            }

            if (x < this.grid_size - 1 && !this.cells[y][x + 1].blocked) {
                neighbors.add(this.cells[y][x + 1])
            }

            if (y > 0 && !this.cells[y - 1][x].blocked) {
                neighbors.add(this.cells[y - 1][x])
            }

            if (y < this.grid_size - 1 && !this.cells[y + 1][x].blocked) {
                neighbors.add(this.cells[y + 1][x])
            }


            this.visited_cells = [...this.visited_cells, ...neighbors]
        },
        render() {
            if (this.canvas) {
                this.canvas.clear(color_scheme.background)
                this.render_scene()
                this.canvas.render()
            }
        },
        render_scene() {
            // rendering cells
            this.for_each_cell((cell) => {
                let x = cell.x
                let y = cell.y

                let fill_color = color_scheme.free_cell
                if (this.cells[y][x].blocked) {
                    fill_color = color_scheme.blocked_cell
                }

                this.canvas.draw_rect({ x, y, width: 1, height: 1, fill_color, stroke_color: color_scheme.cell_gap_color })

                if (this.start_cell && this.start_cell.x == x && this.start_cell.y == y) {
                    this.canvas.draw_rect({ x: x + 0.1, y: y + 0.1, width: 0.8, height: 0.8, fill_color: color_scheme.start_cell, alpha: 1, rotation: Math.PI / 4 })
                }

                if (this.finish_cell && this.finish_cell.x == x && this.finish_cell.y == y) {
                    this.canvas.draw_rect({ x: x + 0.1, y: y + 0.1, width: 0.8, height: 0.8, fill_color: color_scheme.finish_cell, alpha: 1 })
                }

                if (!this.cells[y][x].blocked && this.hovered_cell && this.hovered_cell.x == x && this.hovered_cell.y == y) {
                    this.canvas.draw_rect({ x, y, width: 1, height: 1, fill_color: color_scheme.hovered_cell, alpha: 0.3 })
                }
            })

            // rndering visited cells
            this.visited_cells.forEach((cell) => {
                let x = cell.x
                let y = cell.y

                this.canvas.draw_rect({ x, y, width: 1, height: 1, fill_color: color_scheme.visited_color, alpha: 0.075 })
            });


            //  rendering path
            if (this.path) {
                let points = map(this.path, (cell) => {
                    return { x: cell.x + 0.5, y: cell.y + 0.5 }
                })

                this.canvas.draw_line({
                    points: points, stroke_color: color_scheme.path_color, line_width: 0.05, alpha: 1
                })
            }
        },
        update_canvas() {
            this.canvas.viewport.width = this.grid_size;
            this.canvas.viewport.height = this.grid_size;
            this.canvas.user.scale = 1;
            this.canvas.resize_canvas();
        },
        fill_random_cells() {
            for (let y = 0; y < this.grid_size; y++) {
                this.cells[y] = [];
                for (let x = 0; x < this.grid_size; x++) {
                    if (this.seeded_random() < this.blockiness) {
                        this.cells[y][x] = new Cell(x, y, true);
                    } else {
                        this.cells[y][x] = new Cell(x, y, false);
                    }
                }
            }
        },
        set_random_start_finish_cells() {
            this.for_each_cell((cell) => {
                if (!cell.blocked) {
                    if (this.seeded_random() < 0.25) {
                        this.start_cell = cell
                        return true
                    }
                }
                return false
            })

            this.for_each_cell_reverse((cell) => {
                if (!cell.blocked) {
                    if (this.seeded_random() < 0.25) {
                        this.finish_cell = cell
                        return true
                    }
                }
                return false
            })

            this.update_path()
        },
        for_each_cell(callback: (cell: Cell) => boolean) {
            let _break = false
            for (let y = 0; y < this.grid_size; y++) {
                for (let x = 0; x < this.grid_size; x++) {
                    if (callback(this.cells[y][x])) {
                        _break = true
                        break;
                    }
                }
                if (_break) {
                    break;
                }
            }
        },
        for_each_cell_reverse(callback: (cell: Cell) => boolean) {
            let _break = false
            for (let y = this.grid_size - 1; y >= 0; y--) {
                for (let x = this.grid_size - 1; x >= 0; x--) {
                    if (callback(this.cells[y][x])) {
                        _break = true
                        break;
                    }
                }
                if (_break) {
                    break;
                }
            }
        },
        regenerate() {
            this.reset()
            this.update_random_generator()
            this.fill_random_cells()
            this.set_random_start_finish_cells()
            this.canvas.reset_user_transform()
            this.update_canvas()
            this.canvas.centrize()
        },
        update_random_generator() {
            this.seeded_random = Alea(this.seed.toString())
        },
        update_path() {
            this.visited_cells = []

            if (this.start_cell && this.finish_cell) {
                let path = this.pathfinder.find_path(this.start_cell, this.finish_cell)
                this.path = path
            } else {
                this.path = null
            }

            this.path_length = this.path ? this.path.length : 0
            this.render()
        },
        handle_mousemove(e: MouseEvent) {
            if (this.canvas) {
                let coords = this.canvas.screen_to_viewport({ x: e.offsetX, y: e.offsetY })
                let x = Math.floor(coords.x)
                let y = Math.floor(coords.y)


                if (this.cells[y]) {
                    if (this.cells[y][x]) {
                        let cell = this.cells[y][x]

                        if (!cell.blocked) {
                            this.hovered_cell = cell
                        } else {
                            this.hovered_cell = null
                        }

                        this.render()
                    }

                }

            }
        },
        handle_mouseup(e: MouseEvent) {
            let coords = this.canvas.screen_to_viewport({ x: e.offsetX, y: e.offsetY })
            let x = Math.floor(coords.x)
            let y = Math.floor(coords.y)

            if (x < 0 || x >= this.grid_size || y < 0 || y >= this.grid_size) {
                return
            }

            switch (e.button) {
                case 0:
                    if (!this.cells[y][x].blocked) {
                        this.start_cell = this.cells[y][x]
                    }
                    break;
                case 1:
                    this.cells[y][x].blocked = !this.cells[y][x].blocked
                    break;
                case 2:
                    if (!this.cells[y][x].blocked) {
                        this.finish_cell = this.cells[y][x]
                    }
                    break;
            }

            if (this.start_cell && this.start_cell.is_same(this.finish_cell)) {
                this.finish_cell = null
            }

            this.update_path()

        },
        reset() {
            this.start_cell = null
            this.finish_cell = null
            this.path = null
        },
        setup_tweakpane() {
            let pane = this.$refs.tweakpane.pane;

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'grid_size', {
                label: 'Grid Size',
                min: 2,
                max: 32,
                step: 1,
            }).on('change', throttle(() => {
                this.regenerate()
                this.render()
            }, 1000 / 60));

            pane.addBinding(this, 'blockiness', {
                label: 'Blockiness',
                min: 0,
                max: 1,
                step: 0.01,
            }).on('change', throttle(() => {
                this.regenerate()
                this.render()
            }, 1000 / 60));

            pane.addBinding(this, 'directional_bias', {
                label: 'Directional Bias',
                min: 0,
                max: 1,
                step: 0.01,
            }).on('change', throttle(() => {
                // this.regenerate()
                this.update_path()
                this.render()
            }, 1000 / 60));

            // max_complexity prop of pathfinder
            pane.addBinding(this.pathfinder, 'max_complexity', {
                label: 'Max Complexity',
                min: 0,
                max: 512,
                step: 0.01,
            }).on('change', throttle(() => {
                this.update_path()
                this.render()
            }, 1000 / 60));


            pane.addBinding(this, 'allow_diagonal', {
                label: 'Allow Diagonal',
            }).on('change', throttle(() => {
                this.update_path()
                this.render()
            }, 1000 / 60));


            pane.addButton({
                title: 'Set Random Start/Finish',
            }).on('click', () => {
                this.set_random_start_finish_cells()
                this.render()
            });

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'seed', {
                label: 'Seed',
                min: 0,
                max: 10000,
                step: 1,
            }).on('change', throttle(() => {
                this.regenerate()
                this.render()
            }, 1000 / 15));

            pane.addButton({
                title: 'Random Seed',
            }).on('click', () => {
                this.seed = Math.floor(Math.random() * 10000)
                this.regenerate()
                this.canvas.render()
            });

            pane.addBlade({
                view: 'separator',
            });

            pane.addButton({
                title: 'Reset Viewport',
            }).on('click', () => {
                this.canvas.reset_user_transform()
                this.canvas.centrize()
            });

            pane.addBinding(this.pathfinder, 'last_complexity', {
                label: 'Complexity',
                readonly: true,
            });

            pane.addBinding(this, 'path_length', {
                label: 'Path Length',
                readonly: true,
            });
        }
    },
})
</script>
<style lang="less">
@import url('@/assets/index.less');

.a-star-pathfinder {
    color: @color-accent;
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-gap: 16px;
    overflow: hidden;

    .control-panel {
        display: flex;
        flex-direction: column;
        overflow: auto;
        border: 1px dotted #1d1d1d;

        .info {
            color: @color-accent;
            list-style: square;
            display: flex;
            flex-direction: column;

            li {
                margin: 0;
                font-size: 10px;
                font-family: @font-family-monospace;

                i {
                    color: red;
                    font-style: normal;
                }
            }
        }
    }

    .canvas2d {
        display: flex;
        overflow: hidden;
        border: 1px dotted #1d1d1d;

        canvas {
            width: 100%;
            height: 100%;
        }
    }

}

@media screen and (max-width: 1400px) {

    .a-star-pathfinder {
        padding: 16px 16px;
    }
}

@media screen and (max-width: 600px) {

    .a-star-pathfinder {
        grid-template-columns: 1fr;
        grid-template-rows: 3fr 2fr;

        .canvas2d {
            grid-row: 1;

        }

        .tweakpane {
            grid-row: 2;
            overflow: auto;
        }
    }
}
</style>