import * as express from 'express';
import {celebrate, Joi, Segments} from 'celebrate';
import {StatusCodes} from 'http-status-codes';
import {WantsService} from '../../services';
import {GeolocationCoordinates, WantVisibility} from '../../models';
import {UnauthorizedError} from '../../../errors/unauthorized-error';
import {ForbiddenError, NotFoundError} from '../../../errors';

interface WantsRouterSettings {
  wantsService: WantsService;
}

class WantsRouter {
  constructor(private readonly settings: WantsRouterSettings) {}

  get router() {
    const router = express.Router();

    router.post(
      '/',
      celebrate({
        [Segments.BODY]: Joi.object()
          .keys({
            title: Joi.string().required(),
            description: Joi.string(),
            visibility: Joi.string()
              .valid(...Object.values(WantVisibility))
              .required(),
            visibleTo: Joi.array().items(Joi.string()),
            address: Joi.string().required(),
            radiusInMeters: Joi.number().integer().required(),
          })
          .required(),
      }),
      async (req, res, next) => {
        try {
          req.log.info(req, 'Create Want request received');

          const userId = req.userId;

          if (!userId) {
            throw new UnauthorizedError('User not found in req');
          }

          const {
            title,
            description,
            visibility,
            visibleTo,
            address,
            radiusInMeters,
          } = req.body;

          const want = await this.settings.wantsService.createWant({
            creatorId: userId,
            title,
            description,
            visibility,
            visibleTo,
            address,
            radiusInMeters,
          });

          req.log.info(want, 'Want created!');

          return res.status(StatusCodes.CREATED).json(want);
        } catch (err) {
          return next(err);
        }
      }
    );

    router.post('/:wantId/upload-image', async (req, res, next) => {
      try {
        req.log.info(req, 'Upload image request received');

        const userId = req.userId;

        if (!userId) {
          throw new UnauthorizedError('User not found in the request');
        }

        const {wantId} = req.params;

        const want = await this.settings.wantsService.getWantById(wantId);

        if (!want) {
          throw new NotFoundError(`Want ${wantId} not found`);
        }

        if (!want.administratorsIds.includes(userId)) {
          throw new ForbiddenError(
            `User ${userId} cannot update the Want ${want.id} image`
          );
        }

        if (!req.files) {
          throw new RangeError('No files were uploaded');
        }

        const fileKeys = Object.keys(req.files);

        if (fileKeys.length !== 1) {
          throw new RangeError('A single file must be uploaded');
        }

        const uploadedImage = req.files[fileKeys[0]];

        if (!('data' in uploadedImage)) {
          throw new Error(
            "The uploaded file should contain the 'data' property"
          );
        }

        const updatedWant = await this.settings.wantsService.updateWantById(
          want.id,
          {
            image: {
              data: uploadedImage.data,
              mimeType: uploadedImage.mimetype,
            },
          }
        );

        req.log.info(updatedWant, `Want ${updatedWant.id} updated!`);

        return res.json(updatedWant);
      } catch (err) {
        return next(err);
      }
    });

    router.get('/', async (req, res, next) => {
      try {
        const userId = req.userId;

        if (!userId) {
          throw new UnauthorizedError('User not found in the request');
        }

        const wants = await this.settings.wantsService.listWants({
          userId,
          orderBy: [
            {
              column: 'createdAt',
              order: 'desc',
            },
          ],
        });

        return res.json(wants);
      } catch (err) {
        return next(err);
      }
    });

    router.get(
      '/home-feed',
      celebrate({
        [Segments.QUERY]: Joi.object()
          .keys({
            latitude: Joi.number()
              .min(GeolocationCoordinates.minLatitude)
              .max(GeolocationCoordinates.maxLatitude)
              .required(),
            longitude: Joi.number()
              .min(GeolocationCoordinates.minLongitude)
              .max(GeolocationCoordinates.maxLongitude)
              .required(),
          })
          .required(),
      }),
      async (req, res, next) => {
        try {
          const userId = req.userId;

          if (!userId) {
            throw new UnauthorizedError('User not found in the request');
          }

          const {latitude, longitude} = req.query;

          const geolocationCoordinates = new GeolocationCoordinates(
            Number.parseFloat(latitude as string),
            Number.parseFloat(longitude as string)
          );

          const wants = await this.settings.wantsService.listHomeFeed({
            userId,
            geolocationCoordinates,
          });

          return res.json(wants);
        } catch (err) {
          return next(err);
        }
      }
    );

    return router;
  }
}

export {WantsRouter};
