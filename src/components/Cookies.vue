<template>
    <div class="cookies">
        <p class="warning">WARNING!</p>
        <p class="warning again">WARNING!</p>
        <p>This website <span>does not</span> use cookies.</p>
        <div @click="on_cookie_discarded">Hmm, well, alright then</div>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Cookies',
    props: {
        msg: String,
    },
    methods: {
        on_cookie_discarded() {
            this.$store.commit('no_cookie')
        }
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import url('@/assets/index.less');

.cookies {
    position: fixed;
    bottom: 32px;
    left: 0;
    width: 100%;
    min-height: 200px;
    background-color: #eee;
    border-top: 2px solid @color-accent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 999;

    p {
        &.warning {
            color: @color-accent;
            position: absolute;
            left: 0;
            top: 0;

            &.again {
                top: auto;
                left: auto;
                right: 0;
                bottom: 0;
            }
        }

        font-size:  @font-size-l;
        color: @color-background;
        margin: 12px;

        span {
            color: @color-background;
            font-style: italic;
        }
    }

    div {
        border: 2px solid @color-accent;
        color: @color-background;
        padding: 12px;
        font-size:  @font-size-l;
        margin: 12px;
        cursor: cell;

        &:hover {
            background-color: @color-accent;
            color: #eee;
        }
    }


}

@media screen and (max-width: 1400px) {
    .cookies p.warning {
        display: flex;
    }
}

/* Media query for screens less than 600px */
@media screen and (max-width: 1000px) {
    .cookies p.warning {
        display: none;
    }
}
</style>
  