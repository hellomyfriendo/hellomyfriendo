import {Router} from 'express';
import {Joi, Segments, celebrate} from 'celebrate';
import {StatusCodes} from 'http-status-codes';
import {WantVisibility} from '../../models';
import {WantsRouterArgs} from './interfaces';

class WantsRouter {
  private readonly auth;
  private readonly wantsService;

  constructor(args: WantsRouterArgs) {
    this.auth = args.auth;
    this.wantsService = args.wantsService;
  }

  get router() {
    const router = Router();

    router.post(
      '/',
      this.auth.requireAuth,
      celebrate({
        [Segments.BODY]: Joi.object()
          .keys({
            title: Joi.string().required(),
            description: Joi.string(),
            visibility: Joi.string()
              .valid(...Object.values(WantVisibility))
              .required(),
            address: Joi.string(),
            radiusInMeters: Joi.number().integer(),
          })
          .required(),
      }),
      async (req, res, next) => {
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

          return res.status(StatusCodes.CREATED).json(want);
        } catch (error) {
          return next(error);
        }
      }
    );

    router.get(
      '/feed',
      this.auth.optionalAuth,
      celebrate({
        [Segments.QUERY]: Joi.object().keys({
          limit: Joi.number().integer().required(),
          offset: Joi.number().integer().required(),
          latitude: Joi.number().min(-90).max(90),
          longitude: Joi.number().min(-180).max(180),
        }),
      }),
      async (req, res, next) => {
        try {
          let location;
          if (req.query.latitude && req.query.longitude) {
            location = {
              latitude: Number.parseFloat(req.query.latitude as string),
              longitude: Number.parseFloat(req.query.longitude as string),
            };
          }

          const feed = await this.wantsService.wantsFeed({
            userId: req.user?.id,
            location,
            limit: Number.parseInt(req.query.limit as string),
            offset: Number.parseInt(req.query.offset as string),
          });

          return res.json(feed);
        } catch (error) {
          return next(error);
        }
      }
    );

    return router;
  }
}

export {WantsRouter};
