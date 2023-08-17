<template>
  <div class="view home">
    <div class="content">
      <img src="assets/foamy.png" class="avatar float-left" @click="toggleAvatar" />
      <img src="assets/sanya.png" class="avatar float-left" @click="toggleAvatar" />
      <p>Step into the enigmatic realm of <a title="mailto" :href="sanyabeast_link">@sanyabeast</a>, a guide through the
        mystical
        tapestry of digital
        wonders. Hailing from the heart of Ukraine, I am a seasoned TypeScript and Three.js guru, mastering the realms of
        the virtual and the real.</p>
      <p>As you venture into this ethereal domain, prepare to unlock the secrets that lie beyond the ordinary. Through the
        landscapes of TypeScript's strict typings and the immersive 3D worlds of Three.js, I beckon you to a reality that
        few have ventured.</p>
      <p>Within the depths of code, I navigate the winding corridors where creativity meets innovation. Where static types
        coalesce with dynamic visualizations, I am at the crossroads.</p>
      <p>With each line crafted, a subtle spell is woven, transcending the boundaries of what is known. It's not just
        code, but a symphony of logic and artistry.</p>
      <p>Join me on a journey where the allure of limitless imagination beckons. From the flat planes of a screen to the
        3D realms, our expedition knows no bounds.</p>
      <p>Embrace the audacity of our quest, for within these realms, true coolness thrives in the pursuit of infinite
        possibilities. The union of TypeScript's precision and Three.js's canvas is the artistry I bring forth.</p>
      <p>Wanderer, let us embark on this enigmatic odyssey together,</p>
      <p>unraveling the enigma that lies at the intersection of magic and technology.</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      avatarIndex: -1,
      sanyabeast_link: 'mailto:a.gvrnsk@gmail.com?subject=chronicle'
    }
  },
  mounted() {
    this.toggleAvatar()
  },
  methods: {
    toggleAvatar() {
      let avatars = this.$el.querySelectorAll('.avatar')
      this.avatarIndex = (this.avatarIndex + 1) % avatars.length;

      avatars.forEach((el, index) => {
        let image = el as HTMLElement
        image.style.display = index === this.avatarIndex ? 'flex' : 'none'
      })

    }
  }
})

</script>
<style lang="less">
.view.home {
  img.float-left {
    float: left;
    margin-right: 16px;
    margin-top: 4px;
    /* Adjust the margin as per your preference */
  }

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .content a {
    color: #fff;

    &:hover {
      color: red;
    }
  }


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

/* Media query for screens less than 600px */
@media screen and (max-width: 600px) {
  .view.home {
    justify-content: flex-start;
  }
}
</style>