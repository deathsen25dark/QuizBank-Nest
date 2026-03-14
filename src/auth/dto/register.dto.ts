import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty
} from 'class-validator';
import { UserRole } from '../../users/enum/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}