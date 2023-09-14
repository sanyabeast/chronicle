<template>
    <div class="showdown-viewer">
        <div ref="content" class="content"></div>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins'

import BaseComponent from './BaseComponent.vue';
import showdown from 'showdown'
import { read_text_file } from '@/tools';


const converter = new showdown.Converter()

export default mixins(BaseComponent).extend({
    name: 'Showdown',
    data() {
        return {
            markdown_text: '',
        }
    },
    props: {
        markdown: {
            type: String,
            default: null
        },
        src: {
            type: String,
            default: null
        }
    },
    watch: {
        src() {
            this.load()
        },
        markdown() {
            this.set_markdown(this.markdown)
        }
    },
    mounted() {
        if (this.src !== null) {
            this.load()
        } else if (this.markdown !== null) {
            this.set_markdown(this.markdown)
        }
    },
    methods: {
        set_markdown(markdown: string) {
            let dom = converter.makeHtml(markdown);
            this.markdown_text = markdown;
            (this.$refs.content as HTMLElement).innerHTML = dom;
        },
        async load() {
            try {
                let text = await read_text_file(this.src)
                this.set_markdown(text);
            } catch (err) {
                console.error(err)
            }
        }
    },
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.showdown-viewer {
    background-color: #b5b5b50d;
    padding-bottom: 32px;

    p {
        color: #b8b8b8;
        line-height: 1.5em;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li a {
        color: #4caf50;
    }

    li li {
        padding-left: 16px;

        a {
            color: #009688;
        }
    }

    a,
    a strong {
        color: #f44336;
    }


    h1,
    h2,
    h3,
    h4 {
        color: #fff;
        text-decoration: underline;
    }

    pre {
        background-color: #000;
        border: 1px dotted #fff;
        margin-bottom: 16px;
        padding: 16px;
        font-family: 'Ubuntu Mono', monospace;
    }
}
</style>
  