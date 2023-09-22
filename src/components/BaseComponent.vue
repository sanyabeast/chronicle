
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "BaseComponent",
    computed: {
        is_mobile(): boolean {
            return this.$store.state.is_mobile_device;
        }
    },
    methods: {
        resolve_route(name: string, params: {}) {
            console.log("resolve_route", name, params);
            return this.$router.resolve({
                name: this.applet_data!.route.name,
                params: this.applet_data!.props
            }).route.path
        },
        route_push(name: string, params: {}) {
            console.log("route_push", name, params);
            this.$router.push({
                name,
                params
            })
        },
        route_replace(name: string, params: {}) {
            console.log("route_replace", name, params);
            this.$router.replace({
                name,
                params
            })
        },
        route_back() {
            console.log("route_back");
            this.$router.back()
        },
        update_route(params) {
            // override this method to update the route
            throw new Error("update_route not implemented");
        },

    }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
