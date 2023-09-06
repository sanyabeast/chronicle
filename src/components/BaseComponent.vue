
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "BaseComponent",
    methods: {
        route_push(name: string, params: {}) {
            this.$router.push({
                name,
                params
            })
        },
        route_back() {
            this.$router.back()
        }
    }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
