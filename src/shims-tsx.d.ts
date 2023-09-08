import Vue, { VNode } from 'vue'

// declare module '*.svg';
// declare module '*.png';
// declare module '*.jpg';

declare module '*.png' {
  const content: any
  export default content
}

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
    tags: string[]
    hidden?: boolean,
    title: string,
    preview?: string
    props?: {}
    index?: number
    document?: string
    summary?: string
    show_in_search?: boolean
  }
}
