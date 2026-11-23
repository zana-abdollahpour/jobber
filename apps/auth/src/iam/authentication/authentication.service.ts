import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { GqlContext } from '@jobber/nestjs';
import { UsersService } from '../../users/users.service';
import { HashingService } from '../hashing/hashing.service';

import { LoginInput } from './dtos/login.input';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const isAuthenticated = await this.hashingService.compare(
        password,
        user.password,
      );

      if (!isAuthenticated) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  async login(loginInput: LoginInput, response: GqlContext['res']) {
    const user = await this.verifyUser(loginInput.email, loginInput.password);
    const expiresIn = new Date();
    expiresIn.setMilliseconds(
      expiresIn.getTime() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS')),
    );
    const tokenPayload: TokenPayload = { userId: user.id };

    const accessToken = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresIn,
    });

    return user;
  }
}
