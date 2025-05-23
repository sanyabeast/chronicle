<template>
    <div class="canvas2d" :class="{ decoration: decoration }" @mousemove="handle_mousemove"
        @mousedown="user.pointer.is_down = true" @mouseup="user.pointer.is_down = false" @contextmenu="handle_contextmenu">
        <canvas ref="canvas"></canvas>
        <div v-if="decoration" class="label">
            <p>Canvas 2D</p>
        </div>
        <div v-if="show_debug" class="debug-layer">

            <div>
                <p>frames</p>
                <p v-html="`${this.stats.frames_rendered}`">
                </p>
            </div>
            <div>
                <p>items r/s</p>
                <p v-html="`${this.stats.items_rendered}/${this.stats.items_skipped}`">
                </p>
            </div>
            <div>
                <p>canvas</p>
                <p v-html="`[${this.width}x${this.height}] (${this.resolution}x)`"></p>
            </div>
            <div>
                <p>viewport</p>
                <p v-html="`${this.viewport.width}x${this.viewport.height}`"></p>
            </div>
            <div>
                <p>user</p>
                <p
                    v-html="`${this.viewport.computed.scale.toFixed(2)}% [x+${this.viewport.computed.offset.x.toFixed(2)}, y+${this.viewport.computed.offset.y.toFixed(2)}]`">
                </p>
            </div>

        </div>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
    name: 'Canvas2d',
    data() {
        return {
            // virtual viewport dimensions

            // real canvas dimensions
            height: 1,
            width: 1,
            aspect_ratio: 1,
            resolution: 1,
            // 
            viewport: {
                width: 1,
                height: 1,
                padding: 16,
                rect_size: 1,
                computed: {
                    offset: {
                        x: 0,
                        y: 0
                    },
                    scale: 1,
                },
                min_scale: 0.125,
                max_scale: 4
            },
            user: {
                pointer: {
                    position: {
                        x: 0,
                        y: 0
                    },
                    is_down: false
                },
                scale: 1,
                offset: {
                    x: 0,
                    y: 0
                },

            },
            stats: {
                frames_rendered: 0,
                items_rendered: 0,
                items_skipped: 0,
            },
            render_loop: null,
            items_rendered: 0,
            items_skipped: 0,
        }
    },
    props: {
        show_debug: {
            type: Boolean,
            default: false
        },
        allow_user_scale: {
            type: Boolean,
            default: false
        },
        allow_user_translate: {
            type: Boolean,
            default: false
        },
        allow_context_menu: {
            type: Boolean,
            default: false
        },
        decoration: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.resolution = window.devicePixelRatio || 1;

        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.hidden_canvas = document.createElement('canvas');
        this.hidden_context = this.hidden_canvas.getContext('2d') as CanvasRenderingContext2D;

        this.resize_canvas();
        this.resize_canvas = this.resize_canvas.bind(this);
        this.handle_scroll = this.handle_scroll.bind(this);

        window.addEventListener('resize', this.resize_canvas);
        this.$el.addEventListener('mousewheel', this.handle_scroll, { passive: false });
        window.addEventListener('keydown', this.handle_keypress);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize_canvas);
        this.$el.removeEventListener('mousewheel', this.handle_scroll);
        window.removeEventListener('keydown', this.handle_keypress);
    },
    methods: {
        handle_contextmenu(event) {
            if (!this.allow_context_menu) {
                event.preventDefault();
            }
        },
        handle_keypress(event) {

        },
        reset_user_transform() {
            this.user.scale = 1;
            this.user.offset.x = 0;
            this.user.offset.y = 0;
            this.compute_viewport();
            this.$emit('update');
        },
        screen_to_viewport({ x, y }) {
            x = x * this.resolution;
            y = y * this.resolution;


            let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
            let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;

            return {
                x: (x - v_dx) / this.viewport.computed.scale,
                y: (y - v_dy) / this.viewport.computed.scale
            }
        },
        viewport_to_screen({ x, y }) {
            let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
            let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;

            return {
                x: x * this.viewport.computed.scale + v_dx,
                y: y * this.viewport.computed.scale + v_dy
            }
        },
        handle_mousemove(event: MouseEvent) {
            this.user.pointer.position.x = event.offsetX * this.resolution;
            this.user.pointer.position.y = event.offsetY * this.resolution;

            if (this.user.pointer.is_down) {
                if (this.allow_user_translate) {
                    this.user.offset.x += (event.movementX * this.resolution) / this.viewport.computed.scale;
                    this.user.offset.y += (event.movementY * this.resolution) / this.viewport.computed.scale;

                    this.compute_viewport();
                    this.$emit('update');
                }
            }
        },
        set_canvas_settings({ fill_color, stroke_color, line_width, alpha }) {
            if (fill_color !== undefined) {
                this.hidden_context.fillStyle = fill_color;
            }

            if (stroke_color !== undefined) {
                this.hidden_context.strokeStyle = stroke_color;
            }

            if (line_width !== undefined) {
                this.hidden_context.lineWidth = line_width * this.viewport.computed.scale;
            }

            if (alpha !== undefined) {
                this.hidden_context.globalAlpha = alpha;
            }
        },
        reset_canvas_settings() {
            this.hidden_context.fillStyle = 'black';
            this.hidden_context.strokeStyle = 'black';
            this.hidden_context.lineWidth = 1;
            this.hidden_context.globalAlpha = 1;
        },
        handle_scroll(event: WheelEvent) {
            // altering scale considering mouse position
            if (this.allow_user_scale) {
                event.preventDefault();

                let scale = this.user.scale + event.deltaY * -0.001;
                // let mouse_position = this.screen_to_viewport({ x: event.offsetX, y: event.offsetY });


                // Restrict scale
                scale = Math.min(Math.max(this.viewport.min_scale, scale), this.viewport.max_scale);

                this.user.offset.x -= this.user.pointer.position.x / this.viewport.computed.scale;
                this.user.offset.y -= this.user.pointer.position.y / this.viewport.computed.scale;

                this.compute_viewport()

                this.user.scale = scale;

                this.compute_viewport()


                // this.compute_viewport();

                this.user.offset.x += this.user.pointer.position.x / this.viewport.computed.scale;
                this.user.offset.y += this.user.pointer.position.y / this.viewport.computed.scale;

                this.compute_viewport()

                // this.user.offset.x -= extra_offset.x;
                // this.user.offset.y -= extra_offset.y;

                // Compute ratios between old and new offsets
                this.compute_viewport();
                this.$emit('update');
            }
        },
        clear(clear_color: String) {
            this.hidden_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.hidden_context.fillStyle = clear_color;
            this.hidden_context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },
        draw_rect({ x, y, width, height, fill_color, stroke_color, line_width = 0, alpha = 1, rotation = 0 }) {
            if (x === undefined || y === undefined || width === undefined || height === undefined) {
                throw new Error('x, y, width, height are required');
            }

            if (!this.should_skip_rendering(x, y, width, height)) {
                let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
                let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;
                x = x * this.viewport.computed.scale + v_dx;
                y = y * this.viewport.computed.scale + v_dy;
                width = width * this.viewport.computed.scale;
                height = height * this.viewport.computed.scale;

                this.set_canvas_settings({ fill_color, stroke_color, line_width, alpha });

                if (fill_color) {
                    this.hidden_context.fillRect(x, y, width, height);
                }

                if (stroke_color) {
                    this.hidden_context.strokeRect(x, y, width, height);
                }

                this.items_rendered++
                this.reset_canvas_settings();
            } else {
                this.items_skipped++
            }
        },
        draw_text({ x, y, text, fill_color, stroke_color, font_family, font_size, font_weight, text_align, max_width, alpha = 1 }) {
            if (x === undefined || y === undefined || text === undefined) {
                throw new Error('x, y, text are required');
            }

            let x0 = x
            let y0 = y

            let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
            let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;

            x = x * this.viewport.computed.scale + v_dx;
            y = y * this.viewport.computed.scale + v_dy;

            if (font_family || font_size || font_weight) {
                font_family = font_family || 'sans-serif';
                font_size = font_size || (16 / this.viewport.computed.scale);
                font_weight = font_weight || 'normal';

                this.hidden_context.font = `${font_weight || ''} ${(font_size * this.viewport.computed.scale) || ''}px ${font_family}`;
                let font_scale = 1;

                let text_measurement = this.measure_text({ text, font_family, font_size, font_weight });

                if (this.should_skip_rendering_text(x0, y0, text_measurement.width, text_measurement.height)) {
                    this.items_skipped++
                    return;
                }

                if (max_width && text_measurement.width > max_width) {
                    font_scale = max_width / text_measurement.width;
                }

                this.hidden_context.font = `${font_weight || ''} ${(font_size * this.viewport.computed.scale * font_scale) || ''}px ${font_family}`;
            }

            this.set_canvas_settings({ fill_color, stroke_color })

            if (text_align) {
                this.hidden_context.textAlign = text_align;
            }

            if (fill_color) {
                this.hidden_context.fillText(text, x, y);
            }

            if (stroke_color) {
                this.hidden_context.strokeText(text, x, y);
            }

            this.items_rendered++
            this.reset_canvas_settings();
        },
        measure_text({ text, font_family, font_size, font_weight }) {
            if (font_family) {
                this.hidden_context.font = `${font_weight || ''} ${(font_size * this.viewport.computed.scale) || ''}px ${font_family}`;
            }

            let text_measure = this.hidden_context.measureText(text);

            return {
                width: text_measure.width / this.viewport.computed.scale,
                height: text_measure.actualBoundingBoxAscent / this.viewport.computed.scale,
            }
        },
        draw_line({ points, stroke_color, line_width, alpha = 1 }) {
            if (points === undefined) {
                throw new Error('points are required');
            }

            if (points.length < 2) {
                throw new Error('at least 2 points are required');
            }

            if (!this.should_skip_rendering_line(line_width)) {
                this.set_canvas_settings({ stroke_color, line_width, alpha });

                this.hidden_context.beginPath();

                let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
                let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;

                this.hidden_context.moveTo(
                    points[0].x * this.viewport.computed.scale + v_dx,
                    points[0].y * this.viewport.computed.scale + v_dy
                );

                for (let i = 1; i < points.length; i++) {
                    this.hidden_context.lineTo(
                        points[i].x * this.viewport.computed.scale + v_dx,
                        points[i].y * this.viewport.computed.scale + v_dy
                    );
                }

                this.hidden_context.stroke();

                this.items_rendered++
                this.reset_canvas_settings();
            } else {
                this.items_skipped++
            }
        },
        resize_canvas(emit_event: boolean = true) {
            if (this.canvas) {
                let new_width = Math.ceil(this.canvas.clientWidth * this.resolution);
                let new_height = Math.ceil(this.canvas.clientHeight * this.resolution);

                this.canvas.width = this.hidden_canvas.width = this.width = new_width;
                this.canvas.height = this.hidden_canvas.height = this.height = new_height;
                this.aspect_ratio = this.width / this.height;
                this.compute_viewport();

                if (emit_event) {
                    this.$emit('update');
                }
            }
        },
        render() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(this.hidden_canvas, 0, 0);
            this.stats.frames_rendered++;
            this.stats.items_rendered = this.items_rendered;
            this.stats.items_skipped = this.items_skipped;
            this.items_rendered = 0;
            this.items_skipped = 0;
        },

        // method computeds viewport.translate and viewport.scale properties so that the virtual viewport fits the real canvas
        // method does not alternates viewport.width and viewport.height propeties
        compute_viewport() {
            let scale = 1
            let viewport_aspect_ratio = this.viewport.width / this.viewport.height;

            let padded_width = this.width - this.viewport.padding * 2;
            let padded_height = this.height - this.viewport.padding * 2;

            if (viewport_aspect_ratio > this.aspect_ratio) {
                scale = padded_width / this.viewport.width;
                this.viewport.rect_size = padded_width
            } else {
                scale = padded_height / this.viewport.height;
                this.viewport.rect_size = padded_height
            }

            this.viewport.computed.scale = scale * this.user.scale;
            // centrizing virtual viewport
            // this.viewport.computed.offset.x = (this.width - this.viewport.width * scale) / 2;
            // this.viewport.computed.offset.y = (this.height - this.viewport.height * scale) / 2;

            // applying user transform
            this.viewport.computed.offset.x = this.user.offset.x;
            this.viewport.computed.offset.y = this.user.offset.y;
        },
        centrize() {
            this.user.offset.x = (this.width / this.viewport.computed.scale - this.viewport.width) / 2;
            this.user.offset.y = (this.height / this.viewport.computed.scale - this.viewport.height) / 2;
            this.compute_viewport();
            this.$emit('update');
        },
        should_skip_rendering(x, y, width, height) {
            let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
            let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;
            x = x * this.viewport.computed.scale + v_dx;
            y = y * this.viewport.computed.scale + v_dy;
            width = width * this.viewport.computed.scale;
            height = height * this.viewport.computed.scale;

            if (width < this.resolution / 2 || height < this.resolution / 2) {
                return true;
            }

            return x > this.width || x + width < 0 || y > this.height || y + height < 0;
        },
        should_skip_rendering_line(line_width) {
            return line_width * this.viewport.computed.scale < this.resolution / 2;
        },
        should_skip_rendering_text(x, y, width, height) {
            if (height * this.viewport.computed.scale < 4 * this.resolution) {
                return true;
            }

            return this.should_skip_rendering(x, y, width, height);
        }
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
@import url('@/assets/index.less');

.canvas2d {
    position: relative;

    canvas {
        width: 100%;
        height: 100%;
    }

    >.label {
        position: absolute;
        top: 0;
        left: 8px;
        width: auto;
        max-width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 16px;
        z-index: 1;

        p {
            color: rgba(255, 255, 255, 0.425);
            margin: 0;
            font-family: @font-family-default;
            font-size: 8px;
        }
    }

    .debug-layer {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 16px;
        background: rgba(0, 0, 0, 0.5);
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        overflow: hidden;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 1;

        &:hover {
            opacity: 0;
        }

        >div {
            pointer-events: none;
            display: flex;
            flex-direction: row;
            margin-right: 16px;
            align-items: center;
            justify-content: center;
            grid-gap: 8px;

            p {
                line-height: @line-height-default;
                margin: 0;
                font-size:  @font-size-s;
                font-family: monospace;

                &:first-child {
                    color: rgb(171, 171, 171);
                }
            }
        }
    }
}

@media screen and (max-width: 1400px) {

    .canvas2d {
        .debug-layer {
            height: 32px;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: 1fr 1fr;
        }
    }
}

@media screen and (max-width: 600px) {

    .canvas2d {
        .debug-layer {
            display: none;
        }
    }
}
</style>
  