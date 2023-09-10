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

declare module "*.yaml" {
    const value: any;
    export default value;
}