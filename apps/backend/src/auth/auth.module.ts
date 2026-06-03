import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // Import JWT module for JWT token generation
    JwtModule.register({
      // In a production environment, this should be a strong, randomly generated secret stored in environment variables
      secret: 'my-secret-key',
      // JWT token will expire in 24 hours
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }