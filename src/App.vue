<template>
  <div id="app" @keydown="handle_keydown">
    <header>
      <form>
        <input ref="search_input" type="search" placeholder="Search" id="search" autocomplete="off" spellcheck="false"
          @focus="handle_searchbox_focus" @input="handle_searchbox_input" @blur="handle_searchbox_blur">
      </form>
    </header>
    <div class="header-imposter"></div>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; <span v-html="getCurrentYear()"></span> | Ukraine | Created by @sanyabeast | <a href="#" v-html="href"
          @click="goto_home"></a></p>
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

export default Vue.extend({
  name: 'App',
  data() {
    return {
      href: location.host
    }
  },
  components: { ImageLink },
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
      console.log(1);
      if (this.$store.state.focus_search_on_keydown) {
        if (this.$refs.search_input) {
          console.log(1);
          (this.$refs.search_input as HTMLInputElement).focus()
        }
      }
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
}

.monospace {
  font-family: monospace;
}

* {
  box-sizing: border-box;
}

a {
  color: magenta;
}

input[type="search"] {
  background: #000;
  border: 1px solid #fff;
  outline: none;
  padding: 4px;
  color: #fff;
  max-width: 100%;
  text-align: center;
  font-family: monospace;
  font-size: 18px;

}


#app {
  text-align: center;
  color: #2c3e50;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 48px 1fr 32px;
  min-height: 100%;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  background: #000;
  border-bottom: 1px solid #fff;
  line-height: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
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
  border-left: 1px solid #595959;
  border-right: 1px solid #595959;
  padding: 16px 32px;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

footer {
  font-size: 12px;
  color: #5c5c5c;
  line-height: 0;
  border-top: 1px solid #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  i {
    user-select: none;
    pointer-events: none;
    position: absolute;
    right: 16px;
    top: 50%;
    color: #ffffff12;
  }
}
</style>
