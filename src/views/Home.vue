<template>
  <div class="home">
    <div class="content">
      <TextView src="assets/docs/about.txt">
        <div class="avatars">
          <ImageView src="assets/foamy.png" class="avatar" @click="toggle_avatar" v-if="avatar_index === 0" />
          <ImageView src="assets/sanya.png" class="avatar" @click="toggle_avatar" v-if="avatar_index === 1" />
        </div>
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

  .avatars {
    display: flex;
    width: 100px;
    height: 100px;
    shape-outside: circle();
    float: left;
    margin-right: 0;
    align-items: center;
    justify-content: center;
    margin-right: 32px;
    border-radius: 50%;
    background-color: #0c0c0c;
    overflow: hidden;

    .image-view {
      width: 100%;
      height: 100%;
      background-color: transparent;

      .preloader {
        background-color: transparent;
      }
    }
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
      line-height: 1.5em;
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