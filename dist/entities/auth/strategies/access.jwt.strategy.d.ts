declare const AccessJwtStrategy_base: new (...args: any[]) => any;
export declare class AccessJwtStrategy extends AccessJwtStrategy_base {
    constructor();
    validate(payload: any): Promise<number>;
}
export {};
