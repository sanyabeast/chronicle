
<script lang="ts">
import { load_text_file } from '@/tools';
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
        },
        async load_text(src: string): Promise<string> {
            return await load_text_file(src);
        },
    }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
