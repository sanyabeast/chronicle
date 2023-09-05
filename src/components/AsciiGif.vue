<template>
    <div class="cookies">
        <canvas ref="canvas"></canvas>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';

// Map grayscale values to ASCII characters
function grayToAscii(gray: number) {
    const asciiChars = ' .:-=+*%@#';  // Adjust this string for desired ASCII representation
    const index = Math.round(gray / 255 * (asciiChars.length - 1));
    return asciiChars[index];
}

interface AsciiGifData {
    mainCanvasContext?: CanvasRenderingContext2D
}

export default Vue.extend({
    name: 'AsciiGif',
    data(): AsciiGifData {
        return {
            mainCanvasContext: undefined
        }
    },
    props: {

    },
    mounted() {

    },
    methods: {
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
  