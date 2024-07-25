<template>
  <div class="about-page">
    <div class="content">
      <TextView src="assets/docs/greet.txt">
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
  name: 'AboutPage',
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
@import url('@/assets/index.less');

.about-page {

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
    margin-top: 8px;
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
    color: @color-text;

    &:hover {
      color: @color-accent;
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
  .about-page {
    justify-content: flex-start;
  }
}
</style>