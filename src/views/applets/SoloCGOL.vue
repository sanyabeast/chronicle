<template>
    <div class="view solo-cgol">
        <div class="underlay"></div>
        <div id="menu">
            <div class="body">
                <h1>Game of Life</h1>
                <div class="cat">
                    <h2>Rules</h2>
                    <div class="subcat">
                        <h3>Presets</h3>
                        <h4>Tip: you can use "H-Trees" to fill the field.</h4>
                        <select class="rules-presets">
                            <option data-born="3" data-surv="23">Conway's Game of Life</option>
                            <option data-born="1" data-surv="012345678">H-Trees</option>
                            <option data-born="378" data-surv="235678">Coagulations</option>
                            <option data-born="3" data-surv="238">Pulsar Life</option>
                            <option data-born="37" data-surv="1234">Mazectric with Mice</option>
                            <option data-born="3" data-surv="12345">Maze</option>
                            <option data-born="3" data-surv="1234">Mazectric</option>
                            <option data-born="31" data-surv="321">Crystalyzer</option>
                            <option data-born="1357" data-surv="02468">Fredkin</option>
                            <option data-born="234" data-surv="">Persian Rug</option>
                            <option data-born="3" data-surv="012345678">Flakes</option>
                            <option data-born="3" data-surv="45678">Coral</option>
                            <option data-born="34" data-surv="456">Bacteria</option>
                            <option data-born="345" data-surv="5">Long Life</option>
                            <option data-born="35" data-surv="234578">Land Rush</option>
                            <option data-born="3678" data-surv="235678">Stains</option>
                            <option data-born="378" data-surv="012345678">Plow World</option>
                            <option data-born="45" data-surv="12345">Electrified Maze</option>
                            <option data-born="45678" data-surv="2345">Walled cities</option>
                            <option data-born="4678" data-surv="35678">Anneal</option>
                            <option data-born="36" data-surv="125">Ashes</option>
                        </select>
                    </div>
                    <div class="subcat">
                        <h3>Custom</h3>
                        <h4>Allowed number of live neighbours at which new cell will born.</h4>
                        <input type="text" value="3" class="born-input"></input>
                        <h4>Allowed number of live neighbours at which cell survive.</h4>
                        <input type="text" value="3, 2" class="surv-input"></input>
                    </div>
                </div>
                <div class="cat">
                    <h2>Appearance</h2>
                    <div class="subcat">
                        <h3>Simulation speed</h3>
                        <input type="text" value="50" class="sim-speed">
                    </div>
                    <div class="subcat">
                        <h3>Theme</h3>
                        <div class="theme-selector">
                            <div class="theme-button"
                                data-theme='{"bg-darker":"#1b050c","bg-lighter":"#2d0814","border-0":"#bc1a5c","border-1":"#c81c63","ca-bg":"#c81c63","ca-stroke":"#370717","ca-cell":"#ffc107"}'
                                style="background:#b38705"></div>
                            <div class="theme-button"
                                data-theme='{"bg-darker":"#0a0023","bg-lighter":"#08212d","border-0":"#1abcb0","border-1":"#1cc8ab","ca-bg":"#0e3e3d","ca-stroke":"#040c19","ca-cell":"#ffffff"}'
                                style="background:#119e7d"></div>
                            <div class="theme-button"
                                data-theme='{"bg-darker":"#1f1f1f","bg-lighter":"#333333","border-0":"#ffffff","border-1":"#eeeeee","ca-bg":"#ffffff","ca-stroke":"#999999","ca-cell":"#000000"}'
                                style="background:#ffffff"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="menu-trigger">menu</div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import emoji_data from '@/assets/emoji.json'

"use strict";

export default Vue.extend({
    name: "SoloCGOL",
    mounted() {

    },
    beforeMount() {

    },
    methods: {},
    computed: {},
    props: {
        category: String
    },
    components: {},
    data() {
        return {
            emoji_data: emoji_data
        }
    }
})
</script>
<style lang="less">
.view.solo-cgol {
    color: red;

    canvas {
        width: 100%;
        height: 100%;
        transform: none;
    }

    #menu {
        transform: translateZ(0);
        display: flex;
        flex-direction: column;
        width: 80%;
        position: absolute;
        z-index: 1;
        left: -80%;
        transition: 0.27s ease-out;
        padding: 10px 20px;
        box-sizing: border-box;
        overflow-y: auto;
        height: 100%;
    }

    #menu .cat {
        border: dotted 1px;
        padding: 5px;
        padding-top: 16px;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 25px;
    }

    .underlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.3;
        display: none;
    }

    .underlay.active {
        display: block;
    }

    #menu .subcat {
        padding: 5px;
        margin-bottom: 10px;
    }

    select {
        outline: none;
        color: white;
        border: 2px solid;
        padding: 6px;
        width: 100%;
    }

    input {
        width: 100%;
        border: 2px solid;
        padding: 6px;
        outline: none;
        color: white;
        box-sizing: border-box;
    }

    h1,
    h2,
    h3,
    h4 {
        color: white;
        font-family: 'Ubuntu Mono', monospace;;
        text-align: center;
    }

    h1 {
        font-size: 24px;
    }

    h2 {
        font-size: 20px;
        position: absolute;
        top: -14px;
        margin: 0;
    }

    h3 {
        font-size: 12px;
        text-align: left;
        margin-top: 0;
        margin-bottom: 5px;
    }

    h4 {
        font-size: 12px;
        text-align: left;
        margin: 0;
        margin-top: 10px;
        margin-bottom: 4px;
    }

    #menu.opened {
        left: 0;
    }

    #menu-trigger {
        color: white;
        font-family: 'Ubuntu Mono', monospace;;
        /* font-weight: bold; */
        font-size: 16px;
        position: absolute;
        left: -18px;
        background: rgba(26, 5, 11, 0.6);
        padding: 0px 10px 4px 10px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
    }

    #menu .trigger.unactive {
        display: none;
    }

    .theme-selector {
        display: flex;
    }

    .theme-button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 16px 5px;
        cursor: pointer;
    }
}
</style>