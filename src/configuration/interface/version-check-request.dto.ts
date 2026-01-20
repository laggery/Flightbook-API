import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
}

export class VersionCheckRequestDto {
  @ApiProperty({ enum: Platform, example: 'android' })
  @IsEnum(Platform)
  @IsNotEmpty()
  readonly platform: Platform;

  @ApiProperty({ example: '2.4.1' })
  @IsString()
  @IsNotEmpty()
  readonly app_version: string;

  @ApiProperty({ example: 241 })
  @IsNumber()
  @IsNotEmpty()
  readonly build_number: number;

  @ApiProperty({ example: '14' })
  @IsString()
  @IsNotEmpty()
  readonly os_version: string;

  @ApiProperty({ example: 'de' })
  @IsString()
  @IsNotEmpty()
  readonly locale: string;
}
