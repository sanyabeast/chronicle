<template>
  <div id="vue_app" @keydown="handle_keydown" :class="{ home: $route.name === 'home' }">
    <header>
      <router-link id="homepage" to="/" title="homepage">
        <h1>home</h1>
      </router-link>
      <div class="menu">
        <router-link id="search" to="/applets" title="menu">
          <h1 v-html="search_link_label"></h1>
        </router-link>
        <input v-if="$route.name === `applets-catalog`" ref="search_input" type="search" id="search-input"
          autocomplete="off" spellcheck="false" @focus="handle_searchbox_focus" @input="handle_searchbox_input"
          @blur="handle_searchbox_blur" :value="$store.state.search_query">
        <a href="#" title="clear search" v-if="show_clear_search" class="clear_search" @click="clear_search"></a>
      </div>
      <a id="quit-link" href="https://google.com" title="quit">
        <h1>quit</h1>
      </a>
    </header>
    <div class="header-imposter"></div>
    <main>
      <router-view class="view" />
      <Cookies v-if="$store.state.show_cookie" />
    </main>
    <footer>
      <p v-html="`${career_start_date} - ${get_current_year()}`"></p>
      <b>Ukraine</b>
      <p>prototyped & implemented by</p>
      <a :href="mail_link" id="mail" title="mailto">@sanyabeast</a>
      <a class="github" title="github" href="https://github.com/sanyabeast" target="_blank">github</a>
      <router-link to="/" v-html="href" title="home"></router-link>
      <a :href="sitemap_url" id="sitemap" title="sitemap">web 1.0</a>
      <i id="version" v-html="app_version"></i>
    </footer>
    <!-- <nav>
      <image-link target="/" label="Home" />
      <image-link target="/about" label="About" />
    </nav>
    <router-view /> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ImageLink from './components/ImageLink.vue'
import Cookies from './components/Cookies.vue';
import mixins from 'vue-typed-mixins';
import BaseComponent from './components/BaseComponent.vue';
import { get_current_year } from './tools';
import { urls } from './router';

export default mixins(BaseComponent).extend({
  name: 'App',
  data() {
    return {
      career_start_date: 2013,
      href: location.host,
      mail_link: urls.mailto
    }
  },
  components: { ImageLink, Cookies },
  watch: {
    '$route'(to, from) {
      if (to.name === 'applets-catalog') {
        let timeout = 2000;
        let start_data = Date.now();
        let search_focus_interval = setInterval(() => {
          if (this.$refs.search_input) {
            clearInterval(search_focus_interval)
            let search_input: HTMLInputElement = this.$refs.search_input as HTMLInputElement
            search_input.focus()
          }

          if (Date.now() - start_data > timeout) {
            clearInterval(search_focus_interval)
          }
        }, 100)
      }
    }
  },
  computed: {
    sitemap_url() {
      return `static/index.html`
    },
    search_link_label() {
      if (this.$route.name !== 'applets-catalog') {
        return 'menu';
      } else {
        return this.$store.state.search_query.length > 0 ? '' : 'menu'
      }
    },
    show_search_link() {
      return this.$route.name !== 'applets-catalog'
    },
    show_clear_search() {
      return this.$route.name === 'applets-catalog' && this.$store.state.search_query.length > 0
    },
    search_query() {
      return this.$store.state.search_query
    },
    app_version() {
      return `v${this.$store.state.package_data.version}`
    }
  },
  mounted() {
    console.log('App mounted');
    (window as any).vue_app = this;
  },
  methods: {
    get_current_year: get_current_year,
    handle_searchbox_focus(event: FocusEvent) {
      // this.route_push('applets-catalog', { query: this.search_query })
    },
    handle_searchbox_blur(event: FocusEvent) {
      // this.$store.commit('route_back')
    },
    handle_searchbox_input(event: Event) {
      let search_input: HTMLInputElement = this.$refs.search_input as HTMLInputElement
      this.$store.commit('search_query', search_input.value)
      this.$router.replace({
        name: 'applets-catalog', query: { query: this.search_query }
      })
    },
    clear_search() {
      this.$store.commit('search_query', '')
      this.$router.replace({
        name: 'applets-catalog', query: { query: this.search_query }
      })
    },
    goto_home() {
      this.$store.state.search_query = "";
      // this.route_push('home', {})
    },
    handle_keydown() {
      if (this.$store.state.focus_search_on_keydown) {
        if (this.$refs.search_input) {
          (this.$refs.search_input as HTMLInputElement).focus()
        }
      }
    },
    exit_app() {
      window.open('https://google.com', '_self')
    }
  }
});

</script>

<style lang="less">
@import url('@/assets/index.less');

/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: @color-accent @color-background;
  touch-action: manipulation;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 2px;
  border-radius: 0px;
}

*::-webkit-scrollbar-track {
  background: @color-background;
  border-radius: 0px;
}

*::-webkit-scrollbar-thumb {
  background-color: #050505;
  border-radius: 0px;
  border: 0px none @color-background;
}

html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  ;
}


body {
  overflow-x: hidden;
  overflow-y: auto;

  font-size: @font-size-base;
  font-weight: 100;
  /* Console-like font */
  background-color: @color-background;
  /* Black background */
  color: @color-text;
  /* Green text color */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: @font-family-condensed;
}

h1,
h2,
h3,
h3,
h5,
h6 {
  font-family: @font-family-serif;
}


p,
li {
  font-family: @font-family-serif;
  font-size: @font-size-m;
  line-height: 2em;
}

pre,
code {
  font-family: @font-family-monospace;
}

* {
  box-sizing: border-box;
  color: @color-text;
  user-select: none;
  flex-shrink: 0;
  flex-grow: 0;
}

a {
  color: magenta;
  cursor: cell;
  text-decoration: none;
  border-bottom: 4px solid magenta;
  color: @color-text;

  &:hover {
    background: #ffffff;
    color: #000000;
  }

  &[title="github"] {
    color: #999999;
  }

  &[title="sitemap"] {
    color: #999999;
  }

  &[title="mailto"] {
    color: #999999;
  }
}

img {
  // image-rendering: pixelated;
}

input[type="search"] {
  background: transparent;
  border: none;
  outline: none;
  color: @color-text;
  max-width: 100%;
  text-align: center;
  font-family: @font-family-serif;
  font-size: @font-size-l;
  font-style: italic;
  align-self: flex-end;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="search"]::-webkit-search-cancel-button {
  display: none;
}

h1 {
  font-size: @font-size-l;
}

#homepage,
#quit-link,
#search {
  height: 100%;
  display: flex;
  cursor: cell;
  align-items: center;
  justify-content: center;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;
    color: @color-deco-1;
    height: 100%;
    margin: 0;
    // margin-bottom: 1px;
  }
}

a#homepage {
  align-items: flex-start;
  justify-self: flex-start;
}

a#search {
  width: 100%;
}

a#quit-link {
  align-items: flex-end;
  justify-self: flex-end;

  h1 {
    text-align: right;
  }
}

a#homepage:hover,
a#quit-link:hover,
a#search:hover {
  h1 {
    color: @color-accent;
  }
}

#vue_app {
  text-align: center;
  color: #2c3e50;
  width: 100%;
  max-width: 1360px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 48px 1fr 32px;
  height: 100%;
  max-height: 100%;
  position: relative;
  overflow: hidden;
}

header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background: @color-background;
  border-bottom: 4px solid #333;
  line-height: 0;
  height: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  width: 100%;


  a {
    text-decoration: none;
    display: flex;
    height: 100%;
    width: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;

    &:hover {
      background: transparent;
    }
  }

  .menu {
    height: 100%;
    width: auto;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-items: center;
    position: relative;

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0;
    }

    .clear_search {
      position: absolute;
      right: 0;
      top: 0;
      width: 48px;
      height: 100%;
      cursor: cell;

      &:after {
        content: "";
        position: absolute;
        width: @clear-search-icon-el-width;
        height: @clear-search-icon-el-height;
        top: calc(50% + 2px);
        left: 50%;
        transform: translateY(-50%) translateX(-50%) rotate(45deg);
        background: @color-deco-1;
      }

      &:before {
        content: "";
        position: absolute;
        width: @clear-search-icon-el-width;
        height: @clear-search-icon-el-height;
        top: calc(50% + 2px);
        left: 50%;
        transform: translateY(-50%) translateX(-50%) rotate(-45deg);
        background: @color-deco-1;
      }

      &:hover {
        &:after {
          background: @color-accent;
        }

        &:before {
          background: @color-accent;
        }
      }
    }

  }
}

&.home {
  header .menu input {
    pointer-events: none;
  }
}


main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  /* Adjust the minmax values as needed */
  grid-gap: 10px;
  /* Adjust the gap between elements as needed */

  .router-thumb-link {
    width: 128px;
    height: 64px;
  }


}

.view {
  color: @color-text;
  text-align: left;
  max-width: 1360px;
  padding: 16px 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

footer {
  color: #5c5c5c;
  line-height: 0;
  border-top: 4px solid #333;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: center;
  line-height: 1em;
  font-family: @font-family-condensed;
  color: @color-text;

  >* {
    color: #666;
    margin: 0;
    font-family: @font-family-condensed;
    font-size: @font-size-s;

    &:after,
    &:first-child:before {
      content: "•";
      margin: 0 4px;
      background-color: @color-background;
      color: #3f3f3f;
    }
  }

  a {
    color: @color-text;
    text-decoration: none;
    border: none;

    &:hover {
      color: @color-accent;
    }
  }

  b {
    position: relative;
    background: cornflowerblue;
    background: -webkit-linear-gradient(to bottom, cornflowerblue 50%, gold 50%);
    background: -moz-linear-gradient(to bottom, cornflowerblue 50%, gold 50%);
    background: linear-gradient(to bottom, cornflowerblue 50%, gold 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  i {
    position: absolute;
    right: 8px;
    bottom: 50%;
    transform: translateY(50%);
    font-size: @font-size-s;
    color: #2f2f2f;
  }
}


/* Media query for screens less than 600px */
@media screen and (max-width: 1400px) {
  header {
    padding: 0 16px;
    grid-template-columns: 1fr 2fr 1fr;
  }
}

/* Media query for screens less than 600px */
@media screen and (max-width: 600px) {
  #vue_app {
    grid-template-rows: 48px 1fr 48px;
  }

  header {
    padding: 0 16px;
    grid-template-columns: 1fr 64px;


    a#quit-link {
      display: none;
    }

    a#search {
      align-items: flex-start;
      width: auto;
    }

    a#homepage {
      grid-column: 2;
      grid-row: 1;
      width: 100%;

      h1 {
        width: 100%;
        text-align: right;
      }
    }

    input#search-input {
      text-align: left;
      width: auto;
      grid-column: 1;
      grid-row: 1;
      padding-left: 0;
    }
  }

  &.home {
    header {
      a#quit-link {
        grid-column: 2;
        grid-row: 1;
        width: 100%;
        display: flex;

        h1 {
          width: 100%;
          text-align: right;
        }
      }

      a#homepage {
        display: none;
      }

    }
  }

  .view {
    padding: 16px;
  }

  footer {
    font-size: @font-size-s;
    padding-bottom: 8px;

    i {
      display: none;
    }
  }

  h2 {
    font-size: @font-size-m;
  }
}
</style>
