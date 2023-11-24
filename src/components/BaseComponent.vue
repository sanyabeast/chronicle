
<script lang="ts">
import { get_bright_web_color, get_dark_web_color, get_web_color } from '@/tools';
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
        // update the route with the given params
        update_route(params) {
            return this.$router.replace({
                name: this.$router.currentRoute.name,
                params: params
            }).catch(err => {
                console.warn("update_route error", err);
            })
        },
        copy_to_clipboard(text) {
            if (!navigator.clipboard) {
                // Clipboard API not available, fall back to a more compatible method
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    const successful = document.execCommand('copy');
                    const msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Fallback: Copying text command was ' + msg);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textarea);
            } else {
                // Modern approach with Clipboard API
                navigator.clipboard.writeText(text).then(
                    () => console.log('Async: Copying to clipboard was successful!'),
                    (err) => console.error('Async: Could not copy text: ', err)
                );
            }
        },
        get_web_color(color: string) {
            return get_web_color(color);
        },
        get_bright_web_color(color: string) {
            return get_bright_web_color(color);
        },
        get_dark_web_color(color: string) {
            return get_dark_web_color(color);
        },
    }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
