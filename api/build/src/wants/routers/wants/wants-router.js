"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WantsRouter = void 0;
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../../models");
class WantsRouter {
    constructor(args) {
        this.auth = args.auth;
        this.wantsService = args.wantsService;
    }
    get router() {
        const router = (0, express_1.Router)();
        router.post('/', this.auth.requireAuth, (0, celebrate_1.celebrate)({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object()
                .keys({
                title: celebrate_1.Joi.string().required(),
                description: celebrate_1.Joi.string(),
                visibility: celebrate_1.Joi.string()
                    .valid(...Object.values(models_1.WantVisibility))
                    .required(),
                address: celebrate_1.Joi.string(),
                radiusInMeters: celebrate_1.Joi.number().integer(),
            })
                .required(),
        }), async (req, res, next) => {
            try {
                if (!req.user) {
                    throw new RangeError('req.user is required');
                }
                const want = await this.wantsService.createWant({
                    creatorId: req.user.id,
                    title: req.body.title,
                    description: req.body.description,
                    visibility: req.body.visibility,
                    address: req.body.address,
                    radiusInMeters: req.body.radiusInMeters,
                });
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(want);
            }
            catch (error) {
                return next(error);
            }
        });
        router.get('/feed', this.auth.optionalAuth, (0, celebrate_1.celebrate)({
            [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object().keys({
                limit: celebrate_1.Joi.number().integer().required(),
                offset: celebrate_1.Joi.number().integer().required(),
                latitude: celebrate_1.Joi.number().min(-90).max(90),
                longitude: celebrate_1.Joi.number().min(-180).max(180),
            }),
        }), async (req, res, next) => {
            var _a;
            try {
                let location;
                if (req.query.latitude && req.query.longitude) {
                    location = {
                        latitude: Number.parseFloat(req.query.latitude),
                        longitude: Number.parseFloat(req.query.longitude),
                    };
                }
                const feed = await this.wantsService.wantsFeed({
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    location,
                    limit: Number.parseInt(req.query.limit),
                    offset: Number.parseInt(req.query.offset),
                });
                return res.json(feed);
            }
            catch (error) {
                return next(error);
            }
        });
        return router;
    }
}
exports.WantsRouter = WantsRouter;
//# sourceMappingURL=wants-router.js.map