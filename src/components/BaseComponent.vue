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