import { ApiProperty } from '@nestjs/swagger';

export enum UpdateStatus {
  UP_TO_DATE = 'up_to_date',
  OPTIONAL_UPDATE = 'optional_update',
  FORCE_UPDATE = 'force_update',
}

export class VersionCheckResponseDto {
  @ApiProperty({ enum: UpdateStatus, example: 'force_update' })
  readonly status: UpdateStatus;

  @ApiProperty({ example: 250 })
  readonly min_supported_build: number;

  @ApiProperty({ example: 263 })
  readonly latest_build: number;

  @ApiProperty({ example: 'market://details?id=com.my.app' })
  readonly update_url: string;

  @ApiProperty({ example: 'Please update the app to continue using it.' })
  readonly message: string;
}
