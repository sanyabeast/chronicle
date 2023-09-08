<template>
    <div class="preloader">
        <span class="loader"></span>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
    name: 'Preloader',
    data() {
        return {}
    },
    props: {},
    mounted() { },
    methods: {}
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.preloader {
    display: flex;
    justify-content: center;
    align-items: center;

    .loader {
        width: 48px;
        height: 48px;
        border: 3px solid #FFF;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    .loader::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-bottom-color: #ff0000;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
  