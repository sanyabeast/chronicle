declare module 'gif.js.optimized' {
    // Export any types you want here
    export class GIF {
        constructor(params: any)
        on(event_name: string, callback: (blob: Blob) => any)
        load(src: string)
    };


    // If the module is a function or class, use this syntax:
    // export = SomeLibFunctionOrClass;
}


declare interface IAppletData {
    route: {
        path: string
        name: string
        component: any
        props: boolean
    }
    index?: string
    summary?: string
    document?: string
    tags: string[]
    category: string[]
    title?: string
    package?: string
    preview?: string
    preview_images?: string[]
    launcher: boolean
    props: {
        [x: string]: any
    }
}

declare interface IShaderData {
    fragment: string
    vertex: string
    uniforms: {
        [x: string]: number | number[] | string
    }
}

declare module "*.yaml" {
    const value: any;
    export default value;
}


declare module "@/router/config.yaml" {
    const value: {
        packages: {
            [x: string]: string[][]
        }
        applets: IAppletData[],
        urls: {
            [x: string]: string
        },
        shaders: {
            [x: string]: IShaderData
        }
    };
    export default value;
}