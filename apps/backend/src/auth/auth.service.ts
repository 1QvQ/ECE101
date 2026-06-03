import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // Import prisma client

import { RegisterDto } from "./dto/register.dto"; // Import RegisterDto
import * as bcrypt from "bcrypt"; // Import bcrypt for password hashing

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async register(dto: RegisterDto) {
        // Check if the email already exists in the database
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // If user exists, throw an error
        if (existingUser) {
            throw new ConflictException("Email already registered, please use a different email");
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
            }
        });

        // Return user without password hash
        const { passwordHash, ...result } = newUser;

        return result;
    }
}
