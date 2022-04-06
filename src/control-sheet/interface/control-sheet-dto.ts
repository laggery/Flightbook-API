import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "src/user/user.entity";
import { AltitudeFlightDto } from "./altitude-flight-dto";
import { TheoryDto } from "./theory-dto";
import { TrainingHillDto } from "./training-hill-dto";

export class ControlSheetDto {
  id: number;

  @Exclude()
  user: User;

  @ApiPropertyOptional()
  trainingHill: TrainingHillDto;

  @ApiPropertyOptional()
  theory: TheoryDto;
  
  @ApiPropertyOptional()
  altitudeFlight: AltitudeFlightDto;
}
