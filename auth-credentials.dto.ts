import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
export class AuthCredentialsDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}