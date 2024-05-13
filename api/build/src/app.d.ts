/// <reference types="bunyan" />
declare function createApp(): Promise<{
    app: import("express-serve-static-core").Express;
    logger: import("bunyan");
}>;
export { createApp };
