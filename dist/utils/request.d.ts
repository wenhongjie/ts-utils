declare type Data = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
interface Options {
    baseUrl?: string;
    headers?: Record<string, string>;
    timeout?: number;
    responseType?: string;
}
interface RequestOptions extends Options {
    url: string;
    method: string;
    data?: Data;
}
declare class Req {
    constructor(options?: Options);
    responseType: string;
    baseUrl: string;
    timeout: number;
    headers: Record<string, string>;
    before(fn: Function): void;
    after(callback: Function): void;
    request(options: RequestOptions): Promise<{}>;
    get(url: string, data?: Data): Promise<{}>;
    post(url: string, data?: Data): Promise<{}>;
    put(url: string, data?: Data): Promise<{}>;
    patch(url: string, data?: Data): Promise<{}>;
    delete(url: string, data?: Data): Promise<{}>;
}
declare const _default: {
    create(options: Options): Req;
};
export default _default;
