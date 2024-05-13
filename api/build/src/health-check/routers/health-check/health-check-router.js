"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckRouter = void 0;
const express_1 = require("express");
class HealthCheckRouter {
    get router() {
        const router = (0, express_1.Router)();
        router.get('/', (req, res, next) => {
            try {
                return res.json({});
            }
            catch (error) {
                return next(error);
            }
        });
        return router;
    }
}
exports.HealthCheckRouter = HealthCheckRouter;
//# sourceMappingURL=health-check-router.js.map