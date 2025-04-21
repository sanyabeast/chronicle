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
@import url('@/assets/index.less');

.showdown-viewer {
    background-color: #b5b5b51f;
    padding-bottom: 32px;
    line-height: @line-height-default;

    * {
        display: block;
        user-select: text;
        max-width: 100%;
        word-wrap: break-word;
    }

    p {
        color: #eee;
        margin-bottom: 1em;
    }

    ul,
    ol {
        list-style: none;
        margin-left: 16px;
        padding: 16px;
        background: #33333338;
        font-size: @font-size-m;

        li {
            color: #eee;


            p {
                margin: 0;
            }

            &:before {
                content: "•";
                margin-right: 16px;
            }
        }
    }

    code {
        display: inline;
        color: #ffaf96;
    }

    li * {
        display: inline;
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
        display: inline;
        background-color: @color-background;
        color: @color-accent;
        font-weight: 900;
    }

    a {
        &:hover {
            background-color: @color-text;
            color: @color-background;

        }
    }


    h1,
    h2,
    h3,
    h4,
    h5 {
        color: @color-text;
        text-decoration: none;
        background-color: @color-background;
        font-family: @font-family-default;
    }

    pre {
        background-color: @color-background;
        border: 4px dotted @color-accent;
        margin-bottom: 16px;
        padding: 16px;
        white-space: pre-wrap;

        code {
            color: #ffc79b;
        }
    }

    img {
        background-color: @color-background;
        border: 2px solid @color-background;
        margin: 8px;
        display: inline-block;

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
  