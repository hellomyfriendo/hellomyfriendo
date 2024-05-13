import { WantsRouterArgs } from './interfaces';
declare class WantsRouter {
    private readonly auth;
    private readonly wantsService;
    constructor(args: WantsRouterArgs);
    get router(): import("express-serve-static-core").Router;
}
export { WantsRouter };
