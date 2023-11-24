<template>
    <div class="canvas2d" @mousemove="handle_mousemove" @mousedown="user.pointer.is_down = true"
        @mouseup="user.pointer.is_down = false" @contextmenu="handle_contextmenu">
        <canvas ref="canvas"></canvas>
        <div v-if="show_debug" class="debug-layer">
            <div>
                <p>frames rendered</p>
                <p v-html="`${this.stats.frames_rendered}`">
                </p>
            </div>
            <div>
                <p>canvas dimensions</p>
                <p v-html="`[${this.width}x${this.height}] (dpi: ${this.resolution})`"></p>
            </div>
            <div>
                <p>viewport dimensions</p>
                <p v-html="`${this.viewport.width}x${this.viewport.height}`"></p>
            </div>
            <div>
                <p>viewport transform</p>
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
                frames_rendered: 0
            }
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
            // reset user scale and transforms on 'space' key press
            if (event.code === 'Space') {
                this.reset_user_transform();
            }
        },
        reset_user_transform() {
            this.user.scale = 1;
            this.user.offset.x = 0;
            this.user.offset.y = 0;
            this.compute_viewport();
            this.$emit('update');
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
        draw_rect({ x, y, width, height, fill_color, stroke_color }) {
            if (x === undefined || y === undefined || width === undefined || height === undefined) {
                throw new Error('x, y, width, height are required');
            }

            let v_dx = this.viewport.computed.offset.x * this.viewport.computed.scale;
            let v_dy = this.viewport.computed.offset.y * this.viewport.computed.scale;

            x = x * this.viewport.computed.scale + v_dx;
            y = y * this.viewport.computed.scale + v_dy;
            width = width * this.viewport.computed.scale;
            height = height * this.viewport.computed.scale;

            if (fill_color) {
                this.hidden_context.fillStyle = fill_color;
                this.hidden_context.fillRect(x, y, width, height);
            }

            if (stroke_color) {
                this.hidden_context.strokeStyle = stroke_color;
                this.hidden_context.strokeRect(x, y, width, height);
            }
        },
        draw_text({ x, y, text, fill_color, stroke_color, font_family, font_size, font_weight, text_align, max_width }) {
            if (x === undefined || y === undefined || text === undefined) {
                throw new Error('x, y, text are required');
            }

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

                if (max_width && text_measurement.width > max_width) {
                    font_scale = max_width / text_measurement.width;
                }

                this.hidden_context.font = `${font_weight || ''} ${(font_size * this.viewport.computed.scale * font_scale) || ''}px ${font_family}`;
            }

            if (text_align) {
                this.hidden_context.textAlign = text_align;
            }

            if (fill_color) {
                this.hidden_context.fillStyle = fill_color;
                this.hidden_context.fillText(text, x, y);
            }

            if (stroke_color) {
                this.hidden_context.strokeStyle = stroke_color;
                this.hidden_context.strokeText(text, x, y);
            }
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
        draw_line({ points, stroke_color, line_width }) {
            if (points === undefined) {
                throw new Error('points are required');
            }



            if (points.length < 2) {
                throw new Error('at least 2 points are required');
            }

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

            this.hidden_context.lineWidth = (line_width || 1) * this.viewport.computed.scale;
            this.hidden_context.strokeStyle = stroke_color || 'black';
            this.hidden_context.stroke();
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
        }
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
.canvas2d {
    position: relative;

    canvas {
        width: 100%;
        height: 100%;
    }

    .debug-layer {
        position: absolute;
        bottom: 0;
        right: 0;
        width: auto;
        max-width: 100%;
        height: auto;
        padding: 8px;
        background: rgba(0, 0, 0, 0.25);
        z-index: 1;

        &:hover {
            opacity: 0;
        }

        div {
            pointer-events: none;
            display: grid;
            grid-template-columns: 1fr 2fr;
            grid-gap: 8px;

            display: flex;
            flex-direction: row;

            p {
                line-height: 1em;
                margin: 0;
                font-size: 10px;
                font-family: monospace;

                &:first-child {
                    color: grey;
                    text-align: right;
                }
            }
        }
    }
}
</style>
  