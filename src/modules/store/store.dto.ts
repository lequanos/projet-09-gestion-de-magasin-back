import { MinLength, MaxLength, IsNumberString } from 'class-validator';

export class ParamDto {
  @MinLength(9)
  @MaxLength(9)
  @IsNumberString()
  public siren: string;
}
