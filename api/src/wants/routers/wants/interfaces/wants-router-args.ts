import { Auth } from '../../../../middleware';
import {WantsService} from '../../../services';

interface WantsRouterArgs {
  auth: Auth;
  wantsService: WantsService;
}

export {WantsRouterArgs};
