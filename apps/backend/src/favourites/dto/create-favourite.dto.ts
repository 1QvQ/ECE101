import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavouriteDto {
  @IsNotEmpty()
  @IsString()
  resourceType!: string;

  @IsNotEmpty()
  @IsString()
  resourceId!: string;
}
