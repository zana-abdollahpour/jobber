import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  AuthServiceController,
  AuthServiceControllerMethods,
  AuthenticateRequest,
  User,
} from '../../../types/proto/auth';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  authenticate(
    request: AuthenticateRequest,
  ): Promise<User> | Observable<User> | User {
    return {} as User;
  }
}
