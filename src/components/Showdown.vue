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
    background-color: #b5b5b51f;
    padding-bottom: 32px;
    line-height: 1.5em;

    * {
        user-select: text;
    }

    p {
        color: #eee;
    }

    ul,
    ol {
        list-style: none;
        margin-left: 32px;
        padding: 16px;
        background: #33333338;

        li {
            color: #eee;

            &:before {
                content: "•";
                margin-right: 16px;
            }
        }
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
        background-color: #000;
        color: #ff0000;
        font-weight: 900;
    }

    a {
        &:hover {
            background-color: #fff;
            color: #000;

        }
    }


    h1,
    h2,
    h3,
    h4 {
        color: #fff;
        text-decoration: none;
        background-color: #000;
        display: inline-block;
    }

    pre {
        background-color: #000;
        border: 1px dotted #ff0000;
        margin-bottom: 16px;
        padding: 16px;
        white-space: pre-wrap;

        code {
            color: #ffc79b;
        }
    }

    img {
        background-color: #000;
        border: 2px solid #000;
        margin: 8px;

        &:first-child {
            margin-left: 0;
        }
    }
}

@media screen and (max-width: 600px) {
    .showdown-viewer {
        img {
            margin: 0;
        }
    }

}
</style>
  