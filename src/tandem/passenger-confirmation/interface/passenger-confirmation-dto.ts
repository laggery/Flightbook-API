import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, ValidateNested } from "class-validator";

@Exclude()
export class PassengerConfirmationValidationDto {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    readonly fullyUnderstoodInstructions: boolean;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    readonly undertakePilotInstructions: boolean;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    readonly noHealthProblems: boolean;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    readonly understandRisks: boolean;
}

@Exclude()
export class PassengerConfirmationDto {
    @Expose()
    readonly id: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly date: Date;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly firstname: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly lastname: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly email: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly phone: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly place: string; 

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly signature: string;

    @Expose()
    @ApiProperty({ description: 'MIME type of the signature, e.g., "image/svg+xml"'})
    @IsNotEmpty()
    signatureMimeType: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PassengerConfirmationValidationDto)
    readonly validation: PassengerConfirmationValidationDto;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly canUseData: boolean;
}
