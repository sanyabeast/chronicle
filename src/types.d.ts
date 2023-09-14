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

declare interface IPackageData {
    package_data: {
        files: string[][] | null
        title: string | null
        summary: string | null
        avatar: string | null
    },
}

declare interface IAppletData {
    route: {
        path: string
        name: string
        component: any
        props: boolean
    }
    summary?: string
    document?: string
    tags: string[]
    category: string[]
    title?: string
    preview?: string
    props: {
        [x: string]: any
    }
}

declare module "*.yaml" {
    const value: any;
    export default value;
}


declare module "@/router/config.yaml" {
    const value: {
        packages: {
            [x: string]: IPackageData
        }
        applets: IAppletData[],
        urls: {
            [x: string]: string
        }
    };
    export default value;
}