import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Tell strategy where to look for the token (Header -> Authorization -> Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Reject expired tokens immediately
      ignoreExpiration: false,
      // 3. The exact same secret key used by the JWT machine to issue the token
      secretOrKey: 'my-secret-key',
    });
  }
  // 4. This method is only executed if the token's signature is valid
  async validate(payload: any) {
    // Return the sanitised user data
    return { userId: payload.sub, email: payload.email };
  }
}
