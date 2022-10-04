import { MaxLength, IsNotEmpty, IsEmail } from 'class-validator';

export class BecomeCustomerQueryParamsDto {
  @IsNotEmpty()
  public firstname: string;

  @IsNotEmpty()
  public lastname: string;

  @IsEmail()
  @MaxLength(150)
  public email: string;
}
