import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class CustomValueDto {
  @ApiProperty()
  @Expose()
  @IsString()
  readonly key: string;

  @ApiProperty()
  @Expose()
  readonly value: any;
}
