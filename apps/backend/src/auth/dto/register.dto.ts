import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    // Check if the input is a valid email format
    @IsEmail({}, { message: 'Please provide a valid email address, e.g., example@moe.govt.nz' })
    email!: string;

    // Check if it's a string and at least 8 characters long
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long for security purposes' })
    password!: string;

    // Check if first name is a valid string
    @IsString({ message: 'First name must be a valid string' })
    firstName!: string;

    // Check if last name is a valid string
    @IsString({ message: 'Last name must be a valid string' })
    lastName!: string;
}