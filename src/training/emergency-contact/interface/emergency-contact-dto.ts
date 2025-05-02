import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Exclude()
export class EmergencyContactDto {
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  firstname: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiPropertyOptional()
  @Expose()
  additionalInformation?: string;
}
