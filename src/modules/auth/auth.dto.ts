import { IsDefined, IsNumber } from 'class-validator';
import { Store, Role } from '../../entities';

export class JwtDto {
  public id: number;
  public email: string;
  public store: Store;
  public role: Role;
}

export class TokensDto {
  public access_token: string;
  public refresh_token: string;
}

export class SelectStoreDto {
  @IsNumber()
  @IsDefined()
  public store: number;
}
