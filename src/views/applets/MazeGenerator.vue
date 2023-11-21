<template>
    <div class="maze-generator" @contextmenu.prevent="">
        <Tweakpane ref="tweakpane"></Tweakpane>
        <Canvas2D ref="canvas" @resize="render"></Canvas2D>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Tweakpane from '@/components/Tweakpane.vue';
import { MazeGenerator, ECellCategory, MazeCell, ECellAccessibilityLevel } from './MazeGenerator/MazeGenerator'
import Canvas2D from '@/components/Canvas2D.vue';


export default Vue.extend({
    name: "MazeGenerator",
    computed: {

    },
    props: {
        category: String
    },
    components: { Tweakpane, Canvas2D },
    data() {
        return {
            bg_color: '#050505', // '#000000
            wall_width: 0.01,
            path_width: 0.01,
            wall_padding: 0.03
        }
    },
    mounted() {
        (window as any).maze_generator = this;
        this.render = this.render.bind(this);
        this.canvas = this.$refs.canvas
        this.maze_generator = new MazeGenerator();
        this.maze_generator.generate()
        this.update_canvas()
        this.setup_tweakpane()
        this.render()
    },
    beforeDestroy() {
        (window as any).maze_generator = null;
    },
    methods: {
        render() {
            if (this.canvas) {
                this.canvas.clear(this.bg_color)

                this.draw_cells()
                this.draw_path();
                this.draw_lables();

                this.canvas.render()
            }
        },
        update_canvas() {
            this.canvas.viewport.width = this.maze_generator.grid_size;
            this.canvas.viewport.height = this.maze_generator.grid_size;
            this.canvas.resize_canvas();
        },
        draw_cells() {
            this.maze_generator.cells.forEach(cells => {
                cells.forEach(cell => {
                    this.draw_cell(cell);
                })
            })
        },
        draw_lables() {

            this.maze_generator.cells.forEach(cells => {
                cells.forEach(cell_data => {
                    switch (cell_data.category) {
                        case ECellCategory.Start: {
                            this.draw_cell_label(cell_data, "START", "#8bc34a")
                            break;
                        }
                        case ECellCategory.End: {
                            this.draw_cell_label(cell_data, "FINISH", "#ff5722")
                            break;
                        }
                        case ECellCategory.Shortcut: {
                            this.draw_cell_label(cell_data, "shortcut", "#4f4937")
                            break;
                        }
                        case ECellCategory.Loop: {
                            this.draw_cell_label(cell_data, "loop", "#2b4964")
                            break;
                        }
                        default: {
                            switch (cell_data.walls_count) {
                                case ECellAccessibilityLevel.DeadEnd: {
                                    this.draw_cell_label(cell_data, "dead", "#454545")
                                    break;
                                }
                                case ECellAccessibilityLevel.Fork: {
                                    this.draw_cell_label(cell_data, "fork", "#454545")
                                    break;
                                }
                                case ECellAccessibilityLevel.Crossroad: {
                                    this.draw_cell_label(cell_data, "cross", "#454545")
                                    break;
                                }
                            }
                        }
                    }
                })
            })

        },
        draw_cell_label(cell_data: MazeCell, label: string, color: string) {
            const x = cell_data.x;
            const y = cell_data.y;

            let label_size = this.canvas.measure_text({ text: label, font_family: 'monospace', font_size: 1 / 8 });

            this.canvas.draw_rect({
                x: x + 1 / 2 - (label_size.width * 1.1) / 2,
                y: y + 1 / 2 - label_size.height * 1.1,
                width: label_size.width * 1.1,
                height: 1 / 8,
                fill_color: '#000000'
            });

            this.canvas.draw_text({
                x: x + 1 / 2,
                y: y + 1 / 2,
                text: label,
                fill_color: color,
                font_family: 'monospace',
                font_size: 1 / 8,
                text_align: 'center',
                max_width: 1
            })
        },
        draw_cell(cell_data: MazeCell) {
            const x = cell_data.x;
            const y = cell_data.y;


            let dx = this.wall_padding

            if (cell_data.category === ECellCategory.Start || cell_data.category === ECellCategory.End) {
                this.canvas.draw_rect({
                    x: x + dx,
                    y: y + dx,
                    width: 1 - dx * 2,
                    height: 1 - dx * 2,
                    fill_color: "#142f1e"
                });
            } else {
                switch (cell_data.walls_count) {
                    case ECellAccessibilityLevel.Isolated: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: "#050505"
                        });
                        return;
                        break;
                    }
                    case ECellAccessibilityLevel.DeadEnd: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: "#2f1414"
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Transitive: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: "#191919"
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Fork: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: "#26142f"
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Crossroad: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: "#2f142f"
                        });
                        break;
                    }

                }


            }
            // debug walls
            if (cell_data.walls.north) {
                this.canvas.draw_line({
                    points: [
                        {
                            x: x,
                            y: y + dx
                        },
                        {
                            x: x + 1,
                            y: y + dx
                        }
                    ],
                    stroke_color: "hsl(0deg 50% 50%)",
                    line_width: this.wall_width

                })
            }

            if (cell_data.walls.east) {
                this.canvas.draw_line({
                    points: [
                        {
                            x: x + 1 - dx,
                            y: y
                        },
                        {
                            x: x + 1 - dx,
                            y: y + 1
                        }
                    ],
                    stroke_color: "hsl(90deg 50% 50%)",
                    line_width: this.wall_width

                })
            }

            if (cell_data.walls.south) {
                this.canvas.draw_line({
                    points: [
                        {
                            x: x,
                            y: y + 1 - dx
                        },
                        {
                            x: x + 1,
                            y: y + 1 - dx
                        }
                    ],
                    stroke_color: "hsl(180deg 50% 50%)",
                    line_width: this.wall_width

                })
            }

            if (cell_data.walls.west) {
                this.canvas.draw_line({
                    points: [
                        {
                            x: x + dx,
                            y: y
                        },
                        {
                            x: x + dx,
                            y: y + 1
                        }
                    ],
                    stroke_color: "hsl(270deg 50% 50%)",
                    line_width: this.wall_width

                })
            }

        },
        /*drawing route path using canvas2d line and .siblings property of each cell*/
        draw_path(start_cell: MazeCell = this.maze_generator.start_cell) {
            this.draw_path_fragment(start_cell);
            this.maze_generator.reset_visited()
        },
        draw_path_fragment(cell: MazeCell) {
            if (cell.visited) {
                return
            }
            cell.get_open_neighbours().forEach((cell2) => {
                this.canvas.draw_line({
                    points: [
                        {
                            x: cell.x + 0.5,
                            y: cell.y + 0.5
                        },
                        {
                            x: cell2.x + 0.5,
                            y: cell2.y + 0.5
                        }
                    ],
                    stroke_color: `hsl(0, 0%, ${((cell.index / this.maze_generator.end_cell.index)) * 75 + 25}%)`,
                    line_width: this.path_width
                })
                cell.visited = true;
                this.draw_path_fragment(cell2);
            })
        },
        setup_tweakpane() {
            let pane = this.$refs.tweakpane.pane;

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'wall_padding', {
                label: 'Walls Padding',
                min: 0,
                max: 0.2,
                step: 0.01,
            }).on('change', () => {
                this.render()
            })

            pane.addBinding(this, 'wall_width', {
                label: 'Walls Width',
                min: 0.001,
                max: 0.05,
                step: 0.01,
            }).on('change', () => {
                this.render()
            })

            pane.addBinding(this, 'path_width', {
                label: 'Path Width',
                min: 0.01,
                max: 0.25,
                step: 0.01,
            }).on('change', () => {
                this.render()
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
                this.update_canvas()
                this.maze_generator.generate();
                this.render()
            });


            pane.addBinding(this.maze_generator, 'sparseness', {
                label: 'Sparseness',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', () => {
                this.maze_generator.generate();
                this.render()
            });

            pane.addBinding(this.maze_generator, 'dead_ends_ratio', {
                label: 'Dead-Ends Ratio',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', () => {
                this.maze_generator.generate();
                this.render()
            });

            pane.addBinding(this.maze_generator, 'shortcuts_ratio', {
                label: 'Shortcuts Ratio',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', () => {
                this.maze_generator.generate();
                this.render()
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
                this.render()
            });


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
                this.render()
            });

            pane.addButton({
                title: 'Generate maze',
            }).on('click', () => {
                this.maze_generator.seed = Math.floor(Math.random() * 10000);
                this.maze_generator.generate();
                this.$refs.tweakpane.pane.refresh();
                this.render()
            });

        }
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

    .maze-generator {
        padding: 16px 16px;
    }
}

@media screen and (max-width: 600px) {

    .maze-generator {
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 1fr;

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