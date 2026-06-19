import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import prisma client
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto'; // Import RegisterDto
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if the email already exists in the database
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // If user exists, throw an error
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    // Return user without password hash
    const { passwordHash, ...result } = newUser;

    return result;
  }
  // The login method to sign in an existing user
  async login(loginDto: LoginDto) {
    // 1. Check if email exists
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    // 2. If the user does not exist, throw an unauthorized error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 3. Compare the provided password with the hash in database
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    // 4. If the password do not match, throw the Exact Same error as step 2
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 5. Construct the payload to embedded inside the JWT
    // We will only store minimal information inside the JWT, which inlcudes the user ID and email
    const payload = {
      sub: user.id,
      email: user.email,
    };
    // 6. Generate the JWT token with the payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
