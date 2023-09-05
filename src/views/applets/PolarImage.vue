<template>
    <div class="view">
        <ThreeRenderer ref="three_renderer" :helpers="true" orbit_controls/>
        <!-- Other components and UI elements -->
    </div>
</template>
  
<script>

import ThreeRenderer from '../../components/ThreeRenderer.vue';

export default {
    name: 'PolarImage',
    components: {
        ThreeRenderer,
    },
    mounted() {
        console.log(this.$refs.three_renderer)
    }
};
</script>