<template>
    <div class="maze-generator">
        <div class="control-panel">
            <Tweakpane ref="tweakpane"></Tweakpane>
            <ul class="info">
                <li>Use <i>Space</i> to reset user transformations</li>
            </ul>
        </div>
        <Canvas2D ref="canvas" @update="render" :show_debug="!is_mobile" :allow_user_scale="true"
            :allow_user_translate="true" :allow_context_menu="true">
        </Canvas2D>
        <Syntax :code="json_data" :popup="true" @close="show_json_data_popup = false" v-if="show_json_data_popup"
            :download_name="`maze_${maze_generator.seed}.json`" />
    </div>
</template>
<script lang="ts">

import Vue from 'vue';
import Tweakpane from '@/components/Tweakpane.vue';
import { MazeGenerator, ECellCategory, MazeCell, ECellAccessibilityLevel } from './MazeGenerator/MazeGenerator'
import Canvas2D from '@/components/Canvas2D.vue';
import mixins from 'vue-typed-mixins'
import BaseComponent from '@/components/BaseComponent.vue';
import { map, throttle } from 'lodash';
import Syntax from '@/components/Syntax.vue';

export enum EColorScheme {
    ProgrammerView,
    MidnightContrast,
    Midnight
}

const color_schemes = {
    [EColorScheme.ProgrammerView]: {
        background: '#050505', // '#000000
        floor_start_and_end: '#142f1e', // '#000000
        floor_isolated: "#050505",
        floor_dead_end: "#2f1414",
        floor_transitive: "#191919",
        fork_floor: "#26142f",
        crossroad_floor: "#2f142f",
        wall_north: "hsl(0deg 50% 50%)",
        wall_east: "hsl(90deg 50% 50%)",
        wall_south: "hsl(180deg 50% 50%)",
        wall_west: "hsl(270deg 50% 50%)",
        label_start: "#8bc34a",
        label_end: "#ff5722",
        label_shortcut: "#4f4937",
        label_loop: "#2b4964",
        label_dead_end: "#454545",
        label_fork: "#454545",
        label_crossroad: "#454545",
        label_background: '#000000'
    },
    [EColorScheme.MidnightContrast]: {
        background: '#0d1117', // A very dark gray for high contrast with wall colors
        floor_start_and_end: '#58a6ff', // A bright blue to stand out for 'Start' and 'End'
        floor_isolated: "#161b22", // A slightly lighter shade of the background for empty cells
        floor_dead_end: "#ff7b72", // A soft red to indicate dead ends without overwhelming
        floor_transitive: "#30363d", // Medium gray to indicate passable pathways
        fork_floor: "#a371f7", // A gentle purple to denote forks in the maze
        crossroad_floor: "#a371f7", // A strong blue to indicate crossroads clearly
        wall_north: "hsl(210deg 100% 70%)", // Bright blue for north walls
        wall_east: "hsl(45deg 100% 60%)", // A golden hue for east walls
        wall_south: "hsl(140deg 100% 60%)", // Lively green for south walls
        wall_west: "hsl(330deg 100% 70%)", // Pink for west walls
        label_start: "#7ee787", // A vibrant green for the 'Start' label
        label_end: "#ff6e6e", // A striking red for the 'End' label
        label_shortcut: "#f2cc60", // Yellow for shortcuts to draw attention
        label_loop: "#56d4dd", // Cyan for loops for a calming effect
        label_dead_end: "#ff8585", // A lighter red for dead-end labels for readability
        label_fork: "#bf91f3", // A lighter purple for fork labels
        label_crossroad: "#4c9aff", // A different shade of blue for crossroad labels
        label_background: '#21262d' // A dark slate for label backgrounds for contrast
    },
    [EColorScheme.Midnight]: {
        background: '#252a33', // A deep charcoal gray for subtle contrast with wall colors
        floor_start_and_end: '#3b5440', // A toned-down blue for a less stark 'Start' and 'End'
        floor_isolated: "#1f232b", // A gray that's slightly lighter than the background for empty cells
        floor_dead_end: "#513e3e", // Muted terracotta for indicating dead ends less dramatically
        floor_transitive: "#3e4451", // Dark gray for passable pathways that blend with the surroundings
        fork_floor: "#4c424c", // A dusky purple for a less vivid presentation of forks
        crossroad_floor: "#413e51", // A desaturated blue for a less prominent indication of crossroads
        wall_north: "hsl(210deg 80% 50%)", // Less bright blue for north walls
        wall_east: "hsl(45deg 80% 50%)", // Softer golden for east walls
        wall_south: "hsl(140deg 80% 50%)", // Soft green for south walls
        wall_west: "hsl(330deg 80% 50%)", // Plum for west walls
        label_start: "#68a97b", // Olive green for the 'Start' label
        label_end: "#e57373", // Soft red for the 'End' label
        label_shortcut: "#e0ca68", // Muted yellow for shortcuts
        label_loop: "#68a0b0", // Soft teal for loops
        label_dead_end: "#e59797", // Blush pink for dead-end labels
        label_fork: "#a094c7", // Lavender for fork labels
        label_crossroad: "#6094cc", // Softened blue for crossroad labels
        label_background: '#2d313a' // Dark gray for label backgrounds that reduce contrast
    }
}

export default mixins(BaseComponent).extend({
    name: "MazeGenerator",
    computed: {},
    props: {
        category: String,
        seed: {
            type: String,
            default: 0
        }
    },
    components: { Tweakpane, Canvas2D, Syntax },
    data() {
        return {
            wall_width: 0.015,
            path_width: 0.035,
            wall_padding: 0.03,
            current_color_scheme: EColorScheme.Midnight,
            json_data: {},
            show_json_data_popup: false
        }
    },
    mounted() {
        (window as any).maze_generator = this;
        this.render = this.render.bind(this);
        this.canvas = this.$refs.canvas
        this.maze_generator = new MazeGenerator();

        // parsing seed
        if (!isNaN(parseInt(this.seed))) {
            console.log(`seed not random: ${this.seed}`)
            this.maze_generator.seed = parseInt(this.seed);
        } else {
            console.log(`seed: random`)
            this.set_random_seed()
        }

        this.generate()
        this.update_canvas()
        this.setup_tweakpane()
        this.render()
    },
    beforeDestroy() {
        (window as any).maze_generator = null;
    },
    methods: {
        generate() {
            this.maze_generator.generate();
            this.json_data = this.maze_generator.to_json();
        },
        render() {
            if (this.canvas) {
                this.canvas.clear(color_schemes[this.current_color_scheme].background)

                this.draw_cells()
                this.draw_path();
                this.draw_lables();
                this.draw_indexes();

                this.canvas.render()
            }
        },
        update_canvas() {
            this.canvas.viewport.width = this.maze_generator.grid_size;
            this.canvas.viewport.height = this.maze_generator.grid_size;
            this.canvas.user.scale = 1;
            this.canvas.resize_canvas();
            this.canvas.centrize()
        },
        draw_cells() {
            this.maze_generator.for_each_cell((cell) => {
                this.draw_cell(cell);
            })
        },
        draw_lables() {

            this.maze_generator.cells.forEach(cells => {
                cells.forEach(cell_data => {
                    switch (cell_data.category) {
                        case ECellCategory.Start: {
                            this.draw_cell_label(cell_data, "START", color_schemes[this.current_color_scheme].label_start)
                            break;
                        }
                        case ECellCategory.End: {
                            this.draw_cell_label(cell_data, "FINISH", color_schemes[this.current_color_scheme].label_end)
                            break;
                        }
                        case ECellCategory.Shortcut: {
                            this.draw_cell_label(cell_data, "shortcut", color_schemes[this.current_color_scheme].label_shortcut)
                            break;
                        }
                        case ECellCategory.Loop: {
                            this.draw_cell_label(cell_data, "loop", color_schemes[this.current_color_scheme].label_loop)
                            break;
                        }
                        default: {
                            switch (cell_data.walls_count) {
                                case ECellAccessibilityLevel.DeadEnd: {
                                    this.draw_cell_label(cell_data, "dead", color_schemes[this.current_color_scheme].label_dead_end)
                                    break;
                                }
                                case ECellAccessibilityLevel.Fork: {
                                    this.draw_cell_label(cell_data, "fork", color_schemes[this.current_color_scheme].label_fork)
                                    break;
                                }
                                case ECellAccessibilityLevel.Crossroad: {
                                    this.draw_cell_label(cell_data, "cross", color_schemes[this.current_color_scheme].label_crossroad)
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
                fill_color: color_schemes[this.current_color_scheme].label_background
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
                    fill_color: color_schemes[this.current_color_scheme].floor_start_and_end
                });
            } else {
                switch (cell_data.walls_count) {
                    case ECellAccessibilityLevel.Isolated: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: color_schemes[this.current_color_scheme].floor_isolated
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
                            fill_color: color_schemes[this.current_color_scheme].floor_dead_end
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Transitive: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: color_schemes[this.current_color_scheme].floor_transitive
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Fork: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: color_schemes[this.current_color_scheme].fork_floor
                        });
                        break;
                    }
                    case ECellAccessibilityLevel.Crossroad: {
                        this.canvas.draw_rect({
                            x: x + dx,
                            y: y + dx,
                            width: 1 - dx * 2,
                            height: 1 - dx * 2,
                            fill_color: color_schemes[this.current_color_scheme].crossroad_floor
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
                    stroke_color: color_schemes[this.current_color_scheme].wall_north,
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
                    stroke_color: color_schemes[this.current_color_scheme].wall_east,
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
                    stroke_color: color_schemes[this.current_color_scheme].wall_south,
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
                    stroke_color: color_schemes[this.current_color_scheme].wall_west,
                    line_width: this.wall_width

                })
            }

        },
        draw_indexes() {
            let dx = this.wall_padding

            this.maze_generator.for_each_cell((cell) => {
                if (cell.category !== ECellCategory.Empty) {
                    this.canvas.draw_text({
                        x: cell.x - dx + 1 - (1 / 16),
                        y: cell.y - dx + 1 - (1 / 16),
                        text: `idx: ${cell.index}`,
                        fill_color: '#ffffff',
                        font_family: 'monospace',
                        font_size: 1 / 16,
                        text_align: 'right',
                        max_width: 1
                    })
                }
            })

            this.maze_generator.for_each_cell((cell) => {
                if (cell.category !== ECellCategory.Empty) {
                    this.canvas.draw_text({
                        x: cell.x + dx + (1 / 16),
                        y: cell.y - dx + 1 - (1 / 16),
                        text: `dst: ${cell.distance}`,
                        fill_color: '#000000',
                        font_family: 'monospace',
                        font_size: 1 / 16,
                        text_align: 'left',
                        max_width: 1
                    })
                }
            })
        },
        draw_path(start_cell: MazeCell = this.maze_generator.start_cell) {
            let routes = this.maze_generator.routes;
            routes.forEach((route: MazeCell[], route_index: number) => {
                let points = map(route, (cell: MazeCell, distance: number) => {
                    return {
                        x: cell.x + 0.5,
                        y: cell.y + 0.5
                    }
                })

                this.canvas.draw_line({
                    points: points,
                    stroke_color: `hsl(${(route_index / routes.length) * 360 + 90}, 100%, 75%)`,
                    line_width: this.path_width
                })
            })
        },
        set_random_seed() {
            this.maze_generator.seed = Math.floor(Math.random() * 10000);
        },
        setup_tweakpane() {
            let pane = this.$refs.tweakpane.pane;

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this.maze_generator, 'seed', {
                label: 'Seed',
                min: 0,
                max: 10000,
                step: 1,
            }).on('change', throttle(() => {
                this.generate();
                this.render()

                this.update_route({
                    seed: this.maze_generator.seed.toString()
                })
            }, 1000 / 15));

            pane.addButton({
                title: 'Generate maze',
            }).on('click', () => {
                this.set_random_seed()
                this.generate();
                this.$refs.tweakpane.pane.refresh();
                this.update_canvas()
                this.render()
            });

            pane.addBlade({
                view: 'separator',
            });



            pane.addBinding(this.maze_generator, 'grid_size', {
                label: 'Grid Size',
                min: 2,
                max: 20,
                step: 1,
            }).on('change', throttle(() => {
                this.update_canvas()
                this.generate();
                this.render()
            }, 1000 / 15));


            pane.addBinding(this.maze_generator, 'sparseness', {
                label: 'Sparseness',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', throttle(() => {
                this.generate();
                this.render()
            }, 1000 / 15));

            pane.addBinding(this.maze_generator, 'dead_ends_ratio', {
                label: 'Dead-Ends Ratio',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', throttle(() => {
                this.generate();
                this.render()
            }, 1000 / 15));

            pane.addBinding(this.maze_generator, 'shortcuts_ratio', {
                label: 'Shortcuts Ratio',
                min: 0,
                max: 1,
                step: 0.001,
            }).on('change', throttle(() => {
                this.generate();
                this.render()
            }, 1000 / 15));

            pane.addBlade({
                view: 'list',
                label: 'Generation Order',
                options: [
                    { text: 'Pop', value: 0 },
                    { text: 'Shift', value: 1 }
                ],
                value: 1,
            }).on('change', throttle((ev) => {
                console.log(ev.value)
                this.maze_generator.generation_order = ev.value;
                this.generate();
                this.render()
            }, 1000 / 15));

            pane.addBlade({
                view: 'separator',
            });

            pane.addBlade({
                view: 'list',
                label: 'Theme',
                options: [
                    { text: 'ProgrammerView', value: 0 },
                    { text: 'MidnightContrast', value: 1 },
                    { text: 'Midnight', value: 2 },
                ],
                value: 2,
            }).on('change', (ev) => {
                this.current_color_scheme = ev.value;
                this.render()
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

            pane.addButton({
                title: 'Show JSON',
            }).on('click', () => {
                this.show_json_data_popup = true;
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

    .maze-generator {
        padding: 16px 16px;
    }
}

@media screen and (max-width: 600px) {

    .maze-generator {
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