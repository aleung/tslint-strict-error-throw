/*
export declare class Error {
    public name?: string;
    public message: string;
    public stack?: string;
    constructor(message?: string);
}
*/
export class FatalError extends Error {
    public static NAME = "FatalError";
    constructor(public message: string, public innerError?: Error) {
        super(message);
        this.name = FatalError.NAME;

        // Fix prototype chain for target ES5
        Object.setPrototypeOf(this, FatalError.prototype);
    }
}