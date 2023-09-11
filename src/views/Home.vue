<template>
  <div class="home">
    <div class="content">
      <TextView src="assets/docs/about.txt">
        <img src="assets/foamy.png" class="avatar" @click="toggle_avatar" v-if="avatar_index === 0" />
        <img src="assets/sanya.png" class="avatar" @click="toggle_avatar" v-if="avatar_index === 1" />
      </TextView>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      avatar_index: 0,
    };
  },
  methods: {
    toggle_avatar() {
      this.avatar_index = (this.avatar_index + 1) % 2;
    }
  }
})

</script>
<style lang="less">
.view.home {

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img.avatar {
    shape-outside: circle();
    float: left;
    margin-right: 32px;
  }

  .content a {
    color: #fff;

    &:hover {
      color: red;
    }
  }

  .text-view {
    min-width: 300px;
    min-height: 300px;

    p {
      margin: 0;
      line-height: 2em;
      width: 100%;
      max-width: 640px;
      text-align: justify;

      span {
        font-style: italic;
        font-weight: 600;

        &.oldbook {
          font-style: normal;
          font-size: 48px;
        }
      }
    }
  }
}

/* Media query for screens less than 600px */
@media screen and (max-width: 600px) {
  .view.home {
    justify-content: flex-start;
  }
}
</style>