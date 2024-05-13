"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WantsService = void 0;
class WantsService {
    constructor(args) {
        this.wantsTable = 'wants';
        this.db = args.db;
        this.googleCloud = args.googleCloud;
        this.logger = args.logger;
    }
    async createWant(args) {
        this.logger.info({ args }, 'Creating Want');
        await this.validateWantTitle(args.title);
        if (args.description) {
            await this.validateWantDescription(args.description);
        }
        const geocodeResult = await this.geocodeAddress(args.address);
        const wantInsert = {
            creatorId: args.creatorId,
            title: args.title,
            description: args.description,
            visibility: args.visibility,
            googlePlaceId: geocodeResult.place_id,
            formattedAddress: geocodeResult.formatted_address,
            latitude: geocodeResult.geometry.location.lat,
            longitude: geocodeResult.geometry.location.lng,
            radiusInMeters: args.radiusInMeters,
        };
        this.logger.info({ wantInsert }, 'Inserting WantRow');
        const [wantRow] = await this.db(this.wantsTable)
            .insert(wantInsert)
            .returning('*');
        this.logger.info({ want: wantRow }, `Want ${wantRow.id} created!`);
        return wantRow;
    }
    async wantsFeed(args) {
        const wantRows = await this.db(this.wantsTable)
            .modify(async (queryBuilder) => {
            if (args.location) {
                queryBuilder.whereRaw(`ST_DWithin(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint(${args.location.longitude}, ${args.location.latitude})::geography, radius_in_meters)`);
            }
        })
            .limit(args.limit)
            .offset(args.offset);
        return wantRows.map(this.makeWant);
    }
    async validateWantTitle(title) {
        const explicitContentCategory = await this.detectTextExplicitContentCategory(title);
        if (explicitContentCategory) {
            throw new RangeError(`${explicitContentCategory} detected in title: ${title}. Explicit content is not allowed.`);
        }
    }
    async validateWantDescription(description) {
        const explicitContentCategory = await this.detectTextExplicitContentCategory(description);
        if (explicitContentCategory) {
            throw new RangeError(`${explicitContentCategory} detected in description: ${description}. Explicit content is not allowed.`);
        }
    }
    async detectTextExplicitContentCategory(text) {
        const [moderateTextResult] = await this.googleCloud.language.serviceClient.moderateText({
            document: {
                type: 'PLAIN_TEXT',
                content: text,
            },
        });
        if (!moderateTextResult.moderationCategories) {
            return;
        }
        const confidenceThreshold = 0.8;
        const excludedCategories = ['Health', 'Legal', 'Religion & Belief'];
        for (const moderationCategory of moderateTextResult.moderationCategories) {
            if (!moderationCategory.name) {
                continue;
            }
            if (excludedCategories.includes(moderationCategory.name)) {
                continue;
            }
            if (!moderationCategory.confidence) {
                continue;
            }
            if (moderationCategory.confidence > confidenceThreshold) {
                return moderationCategory.name;
            }
        }
        return;
    }
    async geocodeAddress(address) {
        const geocodeResponse = await this.googleCloud.maps.serviceClient.geocode({
            params: {
                address,
                key: this.googleCloud.maps.apiKey,
            },
        });
        return geocodeResponse.data.results[0];
    }
    makeWant(wantRow) {
        return {
            id: wantRow.id,
            creatorId: wantRow.creatorId,
            title: wantRow.title,
            description: wantRow.description,
            visibility: wantRow.visibility,
            place: {
                googlePlaceId: wantRow.googlePlaceId,
                formattedAddress: wantRow.formattedAddress,
                location: {
                    latitude: wantRow.latitude,
                    longitude: wantRow.longitude,
                },
            },
            radiusInMeters: wantRow.radiusInMeters,
            createdAt: wantRow.createdAt,
            updatedAt: wantRow.updatedAt,
        };
    }
}
exports.WantsService = WantsService;
//# sourceMappingURL=wants-service.js.map