<template>
  <div id="app" @keydown="handle_keydown">
    <header>
      <div id="homepage" @click="goto_home()" title="homepage">
        <h1>home</h1>
      </div>
      <input ref="search_input" type="search" placeholder="menu" id="search" autocomplete="off" spellcheck="false"
        @focus="handle_searchbox_focus" @input="handle_searchbox_input" @blur="handle_searchbox_blur">
      <div id="wtf" @click="goto_home()" title="homepage">
        <h1 @click="exit_app">quit</h1>
      </div>
    </header>
    <div class="header-imposter"></div>
    <main>
      <router-view />
      <Cookies v-if="$store.state.show_cookie" />
    </main>
    <footer>
      <p><span v-html="getCurrentYear()"></span> | <b>Ukraine</b> | prototyped &
        implemented by <a :href="sanyabeast_link" title="mailto">@sanyabeast</a> | <a title="github" href="https://github.com/sanyabeast
https://github.com/sanyabeast">github</a> | <a href="#" v-html="href" title="home" @click="goto_home"></a></p>
      <i id="version" v-html="app_version"></i>
    </footer>
    <footer class="mobile">
      <p><span v-html="getCurrentYear()"></span> | <b>Ukraine</b> | <a :href="sanyabeast_link"
          title="github">@sanyabeast</a> | <a href="#" v-html="href" @click="goto_home" title="home"></a></p>

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

export default Vue.extend({
  name: 'App',
  data() {
    return {
      href: location.host,
      sanyabeast_link: 'mailto:a.gvrnsk@gmail.com?subject=chronicle'
    }
  },
  components: { ImageLink, Cookies },
  computed: {
    search_query() {
      return this.$store.state.search_query
    },
    app_version() {
      return `v${this.$store.state.package_data.version}`
    }
  },
  mounted() {
    console.log(this)
  },
  methods: {
    getCurrentYear() {
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      return currentYear;
    },
    handle_searchbox_focus(event: FocusEvent) {
      this.$store.commit('route_replace', {
        name: 'search-result',
        props: { query: this.search_query }
      })
    },
    handle_searchbox_blur(event: FocusEvent) {
      console.log(`searchbox blur`)
      // this.$store.commit('route_back')
    },
    handle_searchbox_input(event: Event) {
      console.log(`searchbox input`)
      let search_input: HTMLInputElement = this.$refs.search_input as HTMLInputElement
      this.$store.commit('search_query', search_input.value)
    },
    goto_home() {
      this.$store.commit('route_replace', {
        name: 'home'
      })
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
html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: monospace;
}


body {
  overflow-x: hidden;
  overflow-y: auto;
  font-family: monospace;
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
  font-family: monospace;
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
    color: grey;
  }
}

img {
  image-rendering: pixelated;
}

input[type="search"] {
  background: #000;
  border: none;
  outline: none;
  padding: 4px;
  color: #fff;
  max-width: 100%;
  text-align: center;
  font-family: monospace;
  font-size: 24px;
  font-style: italic;
  align-self: flex-end;
  height: 100%;
}

input[type="search"]::-webkit-search-cancel-button {
  display: none;
}

/* Center-align the placeholder text */
input[type="search"]::placeholder {
  font-style: normal;
  color: #999;
  font-size: 24px;
  font-weight: bold;
}

input[type="search"]:hover::placeholder {
  color: red;
}

h1 {
  font-size: 24px;
}

#homepage,
#wtf {
  height: 100%;
  align-items: center;
  display: flex;
  cursor: cell;
  align-self: flex-end;

  h1 {
    display: block;
    text-align: left;
    color: #999;
  }
}

div#homepage {
  justify-self: flex-start;
}

div#wtf {
  justify-self: flex-end;

  h1 {
    text-align: right;
  }
}

div#homepage:hover,
div#wtf:hover {
  h1 {
    color: red;
  }
}

#app {
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
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  justify-content: center;
  width: 100%;
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
@media screen and (max-width: 1360px) {
  header {
    padding: 0 16px;
  }
}

/* Media query for screens less than 600px */
@media screen and (max-width: 600px) {
  #app {
    grid-template-rows: 48px 1fr 32px;
  }

  header {
    padding: 0 16px;
    grid-template-columns: 1fr 64px;

    #wtf {
      display: none;
    }

    #homepage {
      grid-column: 2;
      grid-row: 1;
      width: 100%;

      h1 {
        width: 100%;
        text-align: right;
      }
    }

    input#search {
      text-align: left;
      width: 100%;
      grid-column: 1;
      grid-row: 1;
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
