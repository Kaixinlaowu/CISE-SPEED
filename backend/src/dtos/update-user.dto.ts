import {
  IsEmail,
  IsString,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['admin', 'editor', 'viewer'])
  role?: 'admin' | 'editor' | 'viewer';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
