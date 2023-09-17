<template>
    <div class="preloader" :class="{ full: full, fill: fill }">
        <span class="loader" :data-loader-type="loader_type"></span>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';

export enum ELoaderType {
    Default = 'default',
    DefaultInner = 'default-inner',
    Alternate01 = 'alternate-01',
    Alternate02 = 'alternate-02',
    Coffee = 'coffee',
    Chiptune = 'chiptune'

}

export default Vue.extend({
    name: 'Preloader',
    data() {
        return {}
    },
    props: {
        full: {
            type: Boolean,
            default: false
        },
        fill: {
            type: Boolean,
            default: false
        },
        loader_type: {
            type: String,
            default: ELoaderType.Chiptune
        }
    },
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

    &.fill {
        background-color: #000;
    }

    &.full {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .loader {
        &[data-loader-type="default"] {
            width: 48px;
            height: 48px;
            border: 3px solid #FFF;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;

            &::after {
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

        &[data-loader-type="default-inner"] {
            width: 48px;
            height: 48px;
            border: 3px solid #FFF;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;

            &::after {
                content: '';
                box-sizing: border-box;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid transparent;
                border-bottom-color: #FF0000;
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

        &[data-loader-type="alternate-01"] {
            width: 48px;
            height: 48px;
            border: 3px dotted #FFF;
            border-style: solid solid dotted dotted;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            animation: rotation 2s linear infinite;

            &::after {
                content: '';
                box-sizing: border-box;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                border: 3px dotted #FF0000;
                border-style: solid solid dotted;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                animation: rotationBack 1s linear infinite;
                transform-origin: center center;
            }

            @keyframes rotation {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }

            @keyframes rotationBack {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(-360deg);
                }
            }
        }

        &[data-loader-type="alternate-02"] {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            border-top: 4px solid #FFF;
            border-right: 4px solid transparent;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;

            &::after {
                content: '';
                box-sizing: border-box;
                position: absolute;
                left: 0;
                top: 0;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border-left: 4px solid #FF0000;
                border-bottom: 4px solid transparent;
                animation: rotation 0.5s linear infinite reverse;
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

        &[data-loader-type="coffee"] {
            width: 48px;
            height: 48px;
            display: inline-block;
            position: relative;
            border: 4px solid #FFF;
            box-sizing: border-box;
            animation: fill 2s linear infinite alternate;
            color: rgba(255, 0, 0, 0.9);
            border-radius: 0 0 4px 4px;

            &::after {
                content: '';
                box-sizing: border-box;
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                border: 4px solid #FFF;
                width: 20px;
                height: 25px;
                border-radius: 0 4px 4px 0;
            }

            @keyframes fill {
                0% {
                    box-shadow: 0 0 inset;
                }

                100% {
                    box-shadow: 0 -48px inset;
                }
            }
        }

        &[data-loader-type="chiptune"] {
            display: flex;
            animation: spin 2s linear infinite;
            height: 8px;
            width: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            border-radius: 0;
            background-color: transparent;
            border: none;

            @loader-color: #8e8e8e;

            &::after {
                display: none;
            }

            @keyframes spin {
                0% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                6.25% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                12.5% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                18.75% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                25% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                31.25% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                37.5% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }

                43.75% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px @loader-color,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px transparent;
                }

                50% {
                    box-shadow:
                        0px -30px transparent,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px @loader-color,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                56.25% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px transparent,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px @loader-color,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                62.5% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px transparent,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px @loader-color,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                68.75% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px transparent,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px @loader-color,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                75% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px transparent,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px @loader-color,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                81.25% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px transparent,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px @loader-color,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                87.5% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px transparent,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px @loader-color,
                        -10px -30px @loader-color;
                }

                93.75% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px transparent,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px @loader-color;
                }

                100% {
                    box-shadow:
                        0px -30px @loader-color,
                        10px -30px @loader-color,
                        20px -20px @loader-color,
                        30px -10px @loader-color,
                        30px 0px @loader-color,
                        30px 10px @loader-color,
                        20px 20px @loader-color,
                        10px 30px @loader-color,
                        0px 30px transparent,
                        -10px 30px transparent,
                        -20px 20px transparent,
                        -30px 10px transparent,
                        -30px 0px transparent,
                        -30px -10px transparent,
                        -20px -20px transparent,
                        -10px -30px transparent;
                }
            }
        }
    }
}
</style>
  