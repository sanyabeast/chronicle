
import WebFrame from '../views/WebFrame.vue'
import AppletLauncher from '../views/AppletLauncher.vue'
import AsciiGif from "../components/AsciiGif.vue"
import ModelViewer from "../views/applets/ModelViewer3D.vue"
import SoloCGOL from "../views/applets/SoloCGOL.vue"

export let webframe_route = {
    path: '/web-frame/:url',
    name: 'web-frame',
    component: WebFrame,
    props: true
};

export let applet_launcher_route = {
    path: '/applet/applet-launcher/:applet',
    name: 'applet/applet-launcher',
    component: AppletLauncher,
    props: true
}


export let model_viewer_route = {
    path: '/applet/model_viewer/:model_src?/:hdr_src?',
    name: 'applet/model_viewer',
    component: ModelViewer,
    props: true
}
