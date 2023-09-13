import Vue, { VNode } from 'vue'

// declare module '*.svg';
// declare module '*.png';
// declare module '*.jpg';

declare module '*.png' {
  const content: any
  export default content
}

declare module '*.yaml' {
  const data: any
  export default data
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
    index?: number
    title: string,
    summary?: string
    document?: string
    preview?: string
    tags: string[]
    category: string[]
    route: RouteConfig,
    props?: {}
  }
}
