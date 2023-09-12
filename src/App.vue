<template>
  <div id="vue_app" @keydown="handle_keydown" :class="{ home: $route.name === 'home' }">
    <header>
      <router-link id="homepage" to="/" title="homepage">
        <h1>home</h1>
      </router-link>
      <div class="menu">
        <router-link id="search" to="/search-result" title="menu">
          <h1 v-html="search_link_label"></h1>
        </router-link>
        <input v-if="$route.name === `search-result`" ref="search_input" type="search" id="search-input"
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
      <p><span v-html="get_current_year()"></span> |
        <b>Ukraine</b> |
        prototyped &
        implemented by <a :href="mail_link" id="mail" title="mailto">@sanyabeast</a> | <a class="github"
          title="github" href="https://github.com/sanyabeast" target="_blank">github</a> | <router-link to="/"
          v-html="href" title="home"></router-link> | <a :href="sitemap_url" id="sitemap" title="sitemap">sitemap</a>
      </p>
      <i id="version" v-html="app_version"></i>
    </footer>
    <footer class="mobile">
      <p><span v-html="get_current_year()"></span> | <b>Ukraine</b> | <a :href="mail_link"
          title="github">@sanyabeast</a> | <router-link v-html="href" to="/" title="home"></router-link> | <a
          :href="sitemap_url" id="sitemap" title="sitemap">sitemap</a></p>

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

export default mixins(BaseComponent).extend({
  name: 'App',
  data() {
    return {
      href: location.host,
      mail_link: 'mailto:a.gvrnsk@gmail.com?subject=chronicle'
    }
  },
  components: { ImageLink, Cookies },
  watch: {
    '$route'(to, from) {
      if (to.name === 'search-result') {
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
    sitemap_url(){
      return `sitemap.html`
    },
    search_link_label() {
      if (this.$route.name !== 'search-result') {
        return 'menu';
      } else {
        return this.$store.state.search_query.length > 0 ? '' : 'menu'
      }
    },
    show_search_link() {
      return this.$route.name !== 'search-result'
    },
    show_clear_search() {
      return this.$route.name === 'search-result' && this.$store.state.search_query.length > 0
    },
    search_query() {
      return this.$store.state.search_query
    },
    app_version() {
      return `v${this.$store.state.package_data.version}`
    }
  },
  mounted() {
    (window as any).vue_app = this;
  },
  methods: {
    get_current_year: get_current_year,
    handle_searchbox_focus(event: FocusEvent) {
      // this.route_push('search-result', { query: this.search_query })
    },
    handle_searchbox_blur(event: FocusEvent) {
      // this.$store.commit('route_back')
    },
    handle_searchbox_input(event: Event) {
      let search_input: HTMLInputElement = this.$refs.search_input as HTMLInputElement
      this.$store.commit('search_query', search_input.value)
      this.$router.replace({
        name: 'search-result', query: { query: this.search_query }
      })
    },
    clear_search() {
      this.$store.commit('search_query', '')
      this.$router.replace({
        name: 'search-result', query: { query: this.search_query }
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
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #ff0000 #000000;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 2px;
}

*::-webkit-scrollbar-track {
  background: #000000;
}

*::-webkit-scrollbar-thumb {
  background-color: #050505;
  border-radius: 0px;
  border: 0px none #000000;
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
  font-family: 'Ubuntu', sans-serif;
  ;
  font-size: 14px;
  font-weight: 100;
  /* Console-like font */
  background-color: #000;
  /* Black background */
  color: #fff;
  /* Green text color */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monospace {
  font-family: 'Ubuntu Mono', monospace;
  ;
}

* {
  box-sizing: border-box;
  color: #fff;
  user-select: none;
  flex-shrink: 0;
  flex-grow: 0;
}

a {
  color: red;
  cursor: cell;

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
  image-rendering: pixelated;
}

input[type="search"] {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  max-width: 100%;
  text-align: center;
  font-family: 'Ubuntu', sans-serif;
  font-size: 24px;
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
  font-size: 24px;
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
    color: #eee;
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
    color: red;
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
  background: #000;
  border-bottom: 1px solid #333;
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
        width: 1px;
        height: 18px;
        top: calc(50% + 2px);
        left: 50%;
        transform: translateY(-50%) translateX(-50%) rotate(45deg);
        background: #eee;
      }

      &:before {
        content: "";
        position: absolute;
        width: 1px;
        height: 18px;
        top: calc(50% + 2px);
        left: 50%;
        transform: translateY(-50%) translateX(-50%) rotate(-45deg);
        background: #eee;
      }

      &:hover {
        &:after {
          background: red;
        }

        &:before {
          background: red;
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
  color: #fff;
  text-align: left;
  max-width: 1360px;
  padding: 16px 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

footer {
  font-size: 12px;
  color: #5c5c5c;
  line-height: 0;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &.mobile {
    display: none;
  }

  p,
  span {
    color: #5c5c5c;
  }

  span {
    font-weight: bold;
  }

  i {
    user-select: none;
    pointer-events: none;
    position: absolute;
    right: 16px;
    top: 50%;
    color: #333;
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
    grid-template-rows: 48px 1fr 32px;
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
    display: none;

    p,
    span,
    a {
      font-size: 10px;
    }

    &.mobile {
      display: flex;
      flex-direction: column;
    }

    * {
      flex-shrink: 0;
    }
  }

  h2 {
    font-size: 16px;
  }
}
</style>
