import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface IAppletMetadata {
    route: RouteConfig,
    name: String,
    tags: String[]
    noindex?: boolean,
    title?: String,
    props?: {}
  }
}
