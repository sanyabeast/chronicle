<template>
    <div class="canvas2d">
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
                computed: {
                    offset: {
                        x: 0,
                        y: 0
                    },
                    scale: 1,
                }
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
        window.addEventListener('resize', this.resize_canvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize_canvas);
    },
    methods: {
        clear(clear_color: String) {
            this.hidden_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.hidden_context.fillStyle = clear_color;
            this.hidden_context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },
        draw_rect({ x, y, width, height, fill_color, stroke_color }) {
            if (x === undefined || y === undefined || width === undefined || height === undefined) {
                throw new Error('x, y, width, height are required');
            }

            x = x * this.viewport.computed.scale + this.viewport.computed.offset.x;
            y = y * this.viewport.computed.scale + this.viewport.computed.offset.y;
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

            x = x * this.viewport.computed.scale + this.viewport.computed.offset.x;
            y = y * this.viewport.computed.scale + this.viewport.computed.offset.y;

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

            this.hidden_context.moveTo(
                points[0].x * this.viewport.computed.scale + this.viewport.computed.offset.x,
                points[0].y * this.viewport.computed.scale + this.viewport.computed.offset.y
            );

            for (let i = 1; i < points.length; i++) {
                this.hidden_context.lineTo(
                    points[i].x * this.viewport.computed.scale + this.viewport.computed.offset.x,
                    points[i].y * this.viewport.computed.scale + this.viewport.computed.offset.y
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
                    this.$emit('resize', { width: this.width, height: this.height });
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
            } else {
                scale = padded_height / this.viewport.height;
            }

            this.viewport.computed.scale = scale;
            // centrizing virtual viewport
            this.viewport.computed.offset.x = (this.width - this.viewport.width * scale) / 2;
            this.viewport.computed.offset.y = (this.height - this.viewport.height * scale) / 2;
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
  