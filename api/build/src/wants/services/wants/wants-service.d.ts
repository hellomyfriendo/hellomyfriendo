import { Want } from '../../models';
import { CreateWantArgs, WantsFeedArgs, WantsServiceArgs } from './interfaces';
declare class WantsService {
    private readonly db;
    private readonly googleCloud;
    private readonly logger;
    private readonly wantsTable;
    constructor(args: WantsServiceArgs);
    createWant(args: CreateWantArgs): Promise<Want>;
    wantsFeed(args: WantsFeedArgs): Promise<Want[]>;
    private validateWantTitle;
    private validateWantDescription;
    private detectTextExplicitContentCategory;
    private geocodeAddress;
    private makeWant;
}
export { WantsService };
