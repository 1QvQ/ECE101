import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
        return this.authService.register(dto);
    }

    // Route for handling user authentication and issuing tokens
    @Post('login')
    @HttpCode(HttpStatus.OK) // Change default status code from 201 to 200, to indicate that user has logged in successfully and token has been issued
    login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
        return this.authService.login(loginDto);
    }
}
