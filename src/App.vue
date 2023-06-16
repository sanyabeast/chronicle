<template>
  <div id="app">
    <header>
      <form>
        <input type="text" placeholder="Search">
      </form>
    </header>
    <main>
      <router-view />
    </main>
    <div style="flex-grow: 1"></div>
    <footer>
      <p>&copy; <span v-html="getCurrentYear()"></span> | Ukraine | Created by @sanyabeast | <a :href="href"
          v-html="href"></a></p>
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
  mounted() {
    console.log(this)
  },
  methods: {
    getCurrentYear() {
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      return currentYear;
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
}

body {
  overflow-x: hidden;
  overflow-y: auto;
  font-family: monospace;
  font-family: "Courier New", monospace;
  /* Console-like font */
  background-color: #000;
  /* Black background */
  color: #fff;
  /* Green text color */
}

* {
  box-sizing: border-box;
}

a {
  color: magenta;
}

input[type="text"] {
  background: #000;
  border: 1px solid #fff;
  outline: none;
  font-family: monospace;
  padding: 4px;
  color: #fff;
  max-width: 100%;
  text-align: center;
}

#app {
  padding: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 16px;
  background: #000;
  border-bottom: 1px solid #fff;
  line-height: 0;
}

main {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  padding: 30px;
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
  font-family: monospace;
  text-align: left;
}

footer {
  font-size: 10px;
  color: #5c5c5c;
  line-height: 0;
}
</style>
