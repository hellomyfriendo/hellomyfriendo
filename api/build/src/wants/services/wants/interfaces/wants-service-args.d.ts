import { Knex } from 'knex';
import { LanguageServiceClient } from '@google-cloud/language';
import { Client as GoogleMapsServicesClient } from '@googlemaps/google-maps-services-js';
import * as lb from '@google-cloud/logging-bunyan';
interface WantsServiceArgs {
    db: Knex;
    googleCloud: {
        language: {
            serviceClient: LanguageServiceClient;
        };
        maps: {
            serviceClient: GoogleMapsServicesClient;
            apiKey: string;
        };
    };
    logger: lb.express.Logger;
}
export { WantsServiceArgs };
