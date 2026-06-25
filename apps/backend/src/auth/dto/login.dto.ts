import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Check if the input is a valid email format
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address, e.g., example@email.com',
    },
  )
  email!: string;

  // Check if password is a string and at least 8 characters long
  @IsString()
  @MinLength(8, {
    message:
      'Password must be at least 8 characters long for security purposes',
  })
  password!: string;
}
