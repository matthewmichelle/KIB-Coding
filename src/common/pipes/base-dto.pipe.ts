import { IsOptional, IsString } from 'class-validator';

export class HeaderPipeDto {
  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  acceptLanguage?: string;

  @IsString()
  @IsOptional()
  appType?: string;

  @IsString()
  @IsOptional()
  versionNumber?: string;

  @IsString()
  @IsOptional()
  area?: string;

  // Allows for additional dynamic properties
  [key: string]: any;
}
