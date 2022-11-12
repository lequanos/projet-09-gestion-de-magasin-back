import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsEnum,
} from 'class-validator';
import { Permission, Store } from '../../entities';

export class RoleIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class RoleDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public name: string;

  @IsEnum(Permission)
  public permissions: Permission[];

  @IsDefined()
  public store: Store;

  @IsOptional()
  public createdAt: Date = new Date();

  @IsOptional()
  public updatedAt: Date = new Date();
}
